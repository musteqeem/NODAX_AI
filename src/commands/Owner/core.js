const fs=require('node:fs'),path=require('node:path');
const {factory}=require('../../core/catalog');
const {richReply,statCard}=require('../../core/richHtml');
const names=['owner','ownerid','reload','restart','shutdown','broadcast','setvar','getvar','delvar','envkeys','logs','clearlogs','stats','registry','errors','doctor','sessionstatus','setprefix','setbotname','setnewsletter','setsecurelabel','setaibadge','maintenance','debug'];
const special={
 reload:{ownerOnly:true,execute:async(s,m,{reply,registry})=>reply(`🔄 Reloaded ${registry.load()} commands.`)},
 stats:{ownerOnly:true,execute:async(s,m,{reply,registry,store})=>richReply(s,m,statCard('֎ NODAX DIAGNOSTICS',[['Commands',registry.commands.length],['Categories',registry.categories().length],['Groups',Object.keys(store.data.groups).length],['Logs',store.data.logs.length],['Registry errors',registry.errors.length]]),{fallback:`Commands: ${registry.commands.length}`})},
 registry:{ownerOnly:true,execute:async(s,m,{reply,registry})=>reply(`Registry: ${registry.commands.length} commands • ${registry.errors.length} load errors`)},
 errors:{ownerOnly:true,execute:async(s,m,{reply,registry})=>reply(registry.errors.length?JSON.stringify(registry.errors,null,2):'✅ No loader errors.')},
 setvar:{ownerOnly:true,execute:async(s,m,{args,reply})=>{if(!args[0])return reply('Use .setvar KEY VALUE');process.env[args[0]]=args.slice(1).join(' ');return reply(`✅ ${args[0]} set for this process.`)}},
 getvar:{ownerOnly:true,execute:async(s,m,{args,reply})=>reply(process.env[args[0]]??'Not set')},
 delvar:{ownerOnly:true,execute:async(s,m,{args,reply})=>{if(args[0])delete process.env[args[0]];return reply('✅ Runtime variable removed.')}},
 envkeys:{ownerOnly:true,execute:async(s,m,{reply})=>reply(Object.keys(process.env).filter(k=>!/(KEY|TOKEN|SECRET|PASSWORD|PASS)/i.test(k)).sort().join('\n'))},
 sessionstatus:{ownerOnly:true,execute:async(s,m,{reply})=>reply(`📁 ${path.resolve(process.env.SESSION_DIR||'sessions')}\nExists: ${fs.existsSync(path.resolve(process.env.SESSION_DIR||'sessions'))}`)},
 setprefix:{ownerOnly:true,execute:async(s,m,{args,reply})=>{process.env.PREFIX=args[0]||'.';return reply(`Prefix: ${process.env.PREFIX}`)}},
 setbotname:{ownerOnly:true,execute:async(s,m,{args,reply})=>{process.env.BOT_NAME=args.join(' ')||'NODAX AI';return reply(`Bot name: ${process.env.BOT_NAME}`)}},
 setnewsletter:{ownerOnly:true,execute:async(s,m,{args,reply})=>{process.env.NEWSLETTER_JID=args[0]||'';process.env.NEWSLETTER_NAME=args.slice(1).join(' ')||'MUSTEQEEM VERIFIED ✓';return reply('✅ Newsletter context configured.')}},
 setsecurelabel:{ownerOnly:true,execute:async(s,m,{args,reply})=>{process.env.SECURE_META_LABEL=args[0]??'true';return reply(`Secure label: ${process.env.SECURE_META_LABEL}`)}},
 setaibadge:{ownerOnly:true,execute:async(s,m,{args,reply})=>{process.env.AI_BADGE=args[0]??'true';return reply(`AI badge: ${process.env.AI_BADGE}`)}}
};
module.exports=factory('Owner',names,{},special);
