require('dotenv').config();
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const readline=require('node:readline');
const express=require('express');
const pino=require('pino');
const {default:makeWASocket,Browsers,useMultiFileAuthState,DisconnectReason,downloadContentFromMessage}=require('@musteqeem/baileys');
const {Boom}=require('@hapi/boom');
const {JsonStore}=require('./src/store/jsonStore');
const {CommandRegistry}=require('./src/core/commandRegistry');
const {DefenseEngine}=require('./src/core/defenseEngine');
const {normalizeJid}=require('./src/core/helpers');
// YOUR SPECIAL RICH HTML - ADDED BACK
const {sendHtmlPrimitive,menuHtml}=require('./src/core/richHtml');

const PORT=Number(process.env.PORT||3000);
const SESSION=path.resolve(process.env.SESSION_DIR||'sessions');
let PHONE=String(process.env.PAIRING_PHONE||process.env.PAIRING_NUMBER||'').replace(/\D/g,'');
let sock=null;
let reconnectTimer=null;
let attempts=0;
let shutting=false;

const app=express();
const server=http.createServer(app);
const store=new JsonStore();
const registry=new CommandRegistry();
const defense=new DefenseEngine(store);

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ask=q=>{const rl=readline.createInterface({input:process.stdin,output:process.stdout});return new Promise(r=>rl.question(q,a=>{rl.close();r(a);}));};
const owner=j=>String(process.env.OWNER_NUMBERS||'').split(',').map(x=>x.replace(/\D/g,'')).filter(Boolean).includes(String(j).split('@')[0].split(':')[0]);

app.get('/',(_q,r)=>r.json({name:'NODAX',status:sock?.user?'online':'starting',commands:registry.commands.length,version:require('./package.json').version}));
app.get('/health',(_q,r)=>r.json({ok:true,connected:Boolean(sock?.user),commands:registry.commands.length,uptime:process.uptime()}));
app.get('/ready',(_q,r)=>r.status(sock?.user?200:503).json({ready:Boolean(sock?.user)}));
server.listen(PORT,'0.0.0.0',()=>console.log(`[web] NODAX health on ${PORT}`));
registry.load();

function textOf(msg={}){return String(msg.conversation||msg.extendedTextMessage?.text||msg.imageMessage?.caption||msg.videoMessage?.caption||msg.documentMessage?.caption||msg.buttonsResponseMessage?.selectedButtonId||msg.listResponseMessage?.singleSelectReply?.selectedRowId||'').trim()}

async function context(raw,s){
 const jid=raw.key.remoteJid;
 const sender=normalizeJid(raw.key.participant||jid);
 const msg=raw.message||{};
 const isGroup=jid.endsWith('@g.us');
 let metadata=null,isAdmin=owner(sender),isBotAdmin=false;
 if(isGroup){
  try{
    metadata=await s.groupMetadata(jid);
    const me=normalizeJid(s.user?.id);
    const p=metadata.participants.find(x=>normalizeJid(x.id)===sender);
    const b=metadata.participants.find(x=>normalizeJid(x.id)===me||String(x.id||'').startsWith(String(s.user?.id||'').split(':')[0]));
    isAdmin=isAdmin||['admin','superadmin'].includes(p?.admin);
    isBotAdmin=['admin','superadmin'].includes(b?.admin);
  }catch(e){console.error('[group metadata]',e.message)}
 }
 const ci=msg.extendedTextMessage?.contextInfo||msg.imageMessage?.contextInfo||msg.videoMessage?.contextInfo;
 const quotedRaw=ci?.quotedMessage;
 const quotedSender=ci?.participant;
 return {
  raw,chat:jid,sender,text:textOf(msg),isGroup,metadata,isAdmin,isBotAdmin,
  mentionedJid:ci?.mentionedJid||[],
  quoted:quotedRaw?{raw:{key:{remoteJid:jid,participant:quotedSender,message:quotedRaw},message:quotedRaw},sender:quotedSender,text:textOf(quotedRaw)}:null
 };
}

function patchSend(s){
 if(s.__nodaxPatched)return;
 const original=s.sendMessage.bind(s);
 s.sendMessage=async(jid,content={},options={})=>{
  const c={...content};
  c.contextInfo={...(c.contextInfo||{})};
  if(String(process.env.AI_BADGE??'true')!=='false'&&/@s\.whatsapp\.net$/.test(jid))c.ai=true;
  if(String(process.env.SECURE_META_LABEL??'true')!=='false')c.secureMetaServiceLabel=true;
  if(process.env.NEWSLETTER_JID){
    c.contextInfo.forwardedNewsletterMessageInfo={
      newsletterJid:process.env.NEWSLETTER_JID,
      newsletterName:process.env.NEWSLETTER_NAME||'VERIFIED',
      serverMessageId:1
    };
  }
  return original(jid,c,options);
 };
 s.__nodaxPatched=true;
}

async function execute(cmd,m,args){
 if(cmd.groupOnly&&!m.isGroup)return m.reply('❌ Group only.');
 if(cmd.ownerOnly&&!owner(m.sender))return m.reply('❌ Owner only.');
 if(cmd.adminOnly&&!m.isAdmin)return m.reply('❌ Group-admin permission required.');
 if(cmd.botAdmin&&!m.isBotAdmin)return m.reply('❌ Make bot a group admin first.');
 // Pass your richHtml to commands so they can use it
 return cmd.execute(sock,m,{args,reply:m.reply,store,registry,defense,sendHtmlPrimitive,menuHtml});
}

async function handle(raw){
 if(!raw?.key?.remoteJid||raw.key.fromMe)return;
 const m=await context(raw,sock);
 m.reply=async(content,extra={})=>sock.sendMessage(m.chat,typeof content==='string'?{text:content,...extra}:content,{quoted:m.raw});
 // Extra helper for rich html reply
 m.replyHtml=async(html,extra={})=>sendHtmlPrimitive(sock,m.chat,html,extra,m.raw);
 if(!m.text)return;
 const violation=await defense.inspect(sock,m);
 if(violation)return m.reply(violation,{mentions:[m.sender]});
 const prefix=process.env.PREFIX||'.';
 if(!m.text.startsWith(prefix))return;
 const body=m.text.slice(prefix.length).trim();
 if(!body)return;
 const [name,...args]=body.split(/\s+/);
 const cmd=registry.resolve(name);
 if(!cmd)return m.reply(`❌ Unknown command *${name}*. Use ${prefix}help.`);
 try{
  await execute(cmd,m,args)
 }catch(e){
  console.error(`[${cmd.name}]`,e);
  await m.reply(`❌ ${cmd.name} failed: ${e.message}`);
  store.log({type:'command-error',command:cmd.name,error:e.message,user:m.sender,chat:m.chat})
 }
}

async function groupEvent(s,u){
 if(!['add','remove'].includes(u.action))return;
 const g=store.group(u.id);
 if((u.action==='add'&&!g.welcome)||(u.action==='remove'&&!g.goodbye))return;
 let meta;
 try{meta=await s.groupMetadata(u.id)}catch{return}
 for(const p0 of u.participants||[]){
  const p=typeof p0==='string'?p0:p0.id;
  if(!p)continue;
  const join=u.action==='add';
  const template=join?g.welcomeText:g.goodbyeText;
  const text=String(template||'').replaceAll('@user',`@${p.split('@')[0]}`).replaceAll('@group',meta.subject||'group').replaceAll('@count',String(meta.participants.length));
  let avatar=null;
  try{avatar=await s.profilePictureUrl(p,'image')}catch{}
  await s.sendMessage(u.id,avatar?{image:{url:avatar},caption:text,mentions:[p]}:{text,mentions:[p]})
 }
}

function clearReconnect(){if(reconnectTimer)clearTimeout(reconnectTimer);reconnectTimer=null}
function schedule(reason){
 if(shutting||reconnectTimer)return;
 attempts++;
 const wait=Math.min(120000,5000*2**Math.min(attempts-1,5));
 console.log(`[connection] ${reason}; retry in ${Math.ceil(wait/1000)}s`);
 reconnectTimer=setTimeout(()=>{reconnectTimer=null;connect().catch(e=>schedule(e.message))},wait)
}
async function closeSocket(s){try{s?.ws?.close?.()}catch{}try{await s?.end?.()}catch{}}

async function connect(){
 if(shutting||sock)return;
 fs.mkdirSync(SESSION,{recursive:true});

 // ALWAYS ASK FOR PHONE IF NOT SET AND NOT REGISTERED
 const firstCheck=await useMultiFileAuthState(SESSION);
 if(!firstCheck.state.creds.registered&&!PHONE){
  console.log('\n[setup] No phone number found in.env');
  const input=await ask('📱 Enter your WhatsApp number with country code (e.g 2348031234567): ');
  PHONE=String(input).replace(/\D/g,'');
  console.log(`[setup] Using number: ${PHONE}\n`);
 }

 const {state,saveCreds}=await useMultiFileAuthState(SESSION);
 let pairingRequested=false;

 const current=makeWASocket({
  logger:pino({level:process.env.LOG_LEVEL||'silent'}),
  auth:state,
  browser:Browsers.ubuntu('Chrome'),
  version:[2,3000,1015901307],
  connectTimeoutMs:60000,
  defaultQueryTimeoutMs:0,
  keepAliveIntervalMs:10000,
  markOnlineOnConnect:false,
  printQRInTerminal:false,
  syncFullHistory:false
 });

 current.downloadContentFromMessage=downloadContentFromMessage;
 sock=current;
 patchSend(current);
 current.ev.on('creds.update',saveCreds);

 current.ev.on('connection.update',async u=>{
  if(current!==sock)return;
  const {connection,lastDisconnect}=u;
  console.log(`[connection.update] ${connection||'connecting'}`);

  if(!state.creds.registered && PHONE &&!pairingRequested){
    if(connection==='connecting' ||!connection || u.qr){
      await sleep(4000);
      if(pairingRequested) return;
      pairingRequested=true;
      try{
        console.log(`[pairing] Requesting code for ${PHONE}...`);
        const code=await current.requestPairingCode(PHONE);
        console.log('\n╔════════════════════════════════════╗');
        console.log(`║ PAIRING CODE: ${code} ║`);
        console.log('╚════════════════════════════════════╝\n');
        console.log('Go to: WhatsApp > Settings > Linked Devices > Link a device > Link with phone number\n');
      }catch(e){
        console.error('[pairing] failed:',e.message);
        pairingRequested=false;
        await sleep(5000);
        try{
          pairingRequested=true;
          const code=await current.requestPairingCode(PHONE);
          console.log(`\nPAIRING CODE: ${code}\n`);
        }catch(err){
          console.error('[pairing retry]',err.message);
          pairingRequested=false;
        }
      }
    }
  }

  if(connection==='open'){
    attempts=0;
    console.log(`[connection] ✅ NODAX online as ${current.user?.id}`);
  }

  if(connection==='close'){
    const code=lastDisconnect?.error?.output?.statusCode||new Boom(lastDisconnect?.error||{}).output?.statusCode;
    console.log('[connection] closed',code,lastDisconnect?.error?.message||'');

    if(code===DisconnectReason.loggedOut){
      console.log('[connection] Logged out, clearing session');
      try{fs.rmSync(SESSION,{recursive:true,force:true});}catch{}
      sock=null;
      return;
    }

    sock=null;
    await closeSocket(current);
    if(code!==DisconnectReason.connectionReplaced){
      schedule('transient disconnect');
    }
  }
 });

 current.ev.on('group-participants.update',u=>groupEvent(current,u).catch(e=>console.error('[group event]',e.message)));
 current.ev.on('messages.upsert',async({messages})=>{
  for(const x of messages)await handle(x).catch(e=>console.error('[message]',e.message))
 });
}

async function shutdown(sig){shutting=true;clearReconnect();await closeSocket(sock);server.close();console.log('[shutdown]',sig);process.exit(0)}
process.once('SIGINT',()=>shutdown('SIGINT'));
process.once('SIGTERM',()=>shutdown('SIGTERM'));
process.on('unhandledRejection',e=>console.error('[unhandled]',e));

connect().catch(e=>{sock=null;console.error('[startup]',e.message);schedule('startup failure')});