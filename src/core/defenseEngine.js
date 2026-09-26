const RULES={
 antilink:t=>/https?:\/\/|www\./i.test(t),
 antiinvite:t=>/chat\.whatsapp\.com|wa\.me\//i.test(t),
 antispam:t=>/(free\s+gift|click\s+now|limited\s+offer|dm\s+me\s+now)/i.test(t),
 antiflood:()=>false,
 anticaps:t=>{const letters=t.replace(/[^A-Za-z]/g,'');return letters.length>=20&&(letters.match(/[A-Z]/g)||[]).length/letters.length>.82},
 antiemoji:t=>(t.match(/[\p{Extended_Pictographic}]/gu)||[]).length>=25,
 antitag:t=>(t.match(/@\d+/g)||[]).length>=6,
 antiword:(t,g)=>g.blockedWords?.some(w=>w&&t.toLowerCase().includes(String(w).toLowerCase())),
 antiscam:t=>/(send money|otp|one[- ]time password|claim prize|double your money|verification fee)/i.test(t),
 antiphishing:t=>/(verify your account|login here|reset your password|security alert).*(http|www\.)/i.test(t),
 antirepeat:()=>false,
 antilongtext:t=>t.length>2500,
 antiunicode:t=>(t.match(/[^\x00-\x7F]/g)||[]).length>120,
 antiforward:(_t,m)=>Boolean(m.raw.message?.extendedTextMessage?.contextInfo?.isForwarded),
 antiimage:(_t,m)=>Boolean(m.raw.message?.imageMessage),
 antivideo:(_t,m)=>Boolean(m.raw.message?.videoMessage),
 antiaudio:(_t,m)=>Boolean(m.raw.message?.audioMessage),
 antisticker:(_t,m)=>Boolean(m.raw.message?.stickerMessage),
 antidocument:(_t,m)=>Boolean(m.raw.message?.documentMessage),
 anticontact:(_t,m)=>Boolean(m.raw.message?.contactMessage),
 antilocation:(_t,m)=>Boolean(m.raw.message?.locationMessage),
 antipoll:(_t,m)=>Boolean(m.raw.message?.pollCreationMessage),
 antiviewonce:(_t,m)=>Boolean(m.raw.message?.viewOnceMessage),
 anticall:()=>false,
 antibot:(t,m)=>Boolean(m.raw.key?.fromMe===false&&/\b(bot|automated assistant)\b/i.test(t)),
 antistatus:()=>false,
 antidisappearing:(_t,m)=>Boolean(m.raw.message?.protocolMessage?.type===3),
 antighost:()=>false
};
class DefenseEngine{
 constructor(store){this.store=store;this.activity=new Map();this.repeats=new Map();}
 classify(m){const g=this.store.group(m.chat),out=[];for(const [key,fn] of Object.entries(RULES))if(g[key]){try{if(fn(m.text||'',g,m))out.push(key)}catch(e){this.store.log({type:'defense-error',rule:key,error:e.message})}}return out}
 async inspect(sock,m){
  if(!m.isGroup||m.isAdmin)return null;
  const g=this.store.group(m.chat),now=Date.now(),key=`${m.chat}:${m.sender}`;
  if(g.antiflood){const a=(this.activity.get(key)||[]).filter(x=>now-x<10000);a.push(now);this.activity.set(key,a);if(a.length>Number(process.env.MAX_MESSAGES_PER_10S||8))return this.penalize(sock,m,'message flood')}
  if(g.antirepeat&&m.text){const k=`${key}:${m.text.slice(0,500)}`,a=(this.repeats.get(k)||[]).filter(x=>now-x<30000);a.push(now);this.repeats.set(k,a);if(a.length>=3)return this.penalize(sock,m,'repeated message')}
  const hit=this.classify(m);if(hit.length)return this.penalize(sock,m,hit[0]);
  return null;
 }
 async penalize(sock,m,reason){try{await sock.sendMessage(m.chat,{delete:m.raw.key})}catch{}const n=this.store.warn(m.chat,m.sender,reason),limit=Number(process.env.WARN_LIMIT||3);this.store.log({type:'defense',group:m.chat,user:m.sender,reason,warn:n});if(n>=limit&&m.isBotAdmin){try{await sock.groupParticipantsUpdate(m.chat,[m.sender],'remove');return `🛡️ Removed @${m.sender.split('@')[0]} after ${n} warnings (${reason}).`}catch{}}return `🛡️ Warning ${n}/${limit} • ${reason}`;}
}
module.exports={DefenseEngine,RULES};
