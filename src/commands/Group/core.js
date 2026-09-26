const {inputText,getTargets}=require('../../core/helpers');
const {factory}=require('../../core/catalog');
const {richReply,statCard}=require('../../core/richHtml');
const names=['groupinfo','grouplink','groupid','admins','members','tagall','hidetag','mentionall','add','remove','promote','demote','kick','warn','warns','clearwarns','setrules','rules','welcome','goodbye','setwelcome','setgoodbye','setsubject','setdesc','lock','unlock','mute','unmute','approve','reject','requests','invite','revoke','groupstats','membercount','setlang','grouphelp'];
const special={
 groupinfo:{groupOnly:true,execute:async(s,m,{reply})=>{const g=await s.groupMetadata(m.chat);return reply(`👥 ${g.subject}\nMembers: ${g.participants.length}\nOwner: ${g.owner||'unknown'}`)}},
 grouplink:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,{reply})=>reply(await s.groupInviteCode(m.chat).then(x=>`https://chat.whatsapp.com/${x}`))},
 groupid:{groupOnly:true,execute:async(s,m,{reply})=>reply(m.chat)},
 members:{groupOnly:true,execute:async(s,m,{reply})=>{const g=await s.groupMetadata(m.chat);return reply(g.participants.map((p,i)=>`${i+1}. ${p.id}${p.admin?' ['+p.admin+']':''}`).join('\n'))}},
 admins:{groupOnly:true,execute:async(s,m,{reply})=>{const g=await s.groupMetadata(m.chat);return reply(g.participants.filter(p=>p.admin).map(p=>'@'+p.id.split('@')[0]).join('\n')||'No admins found.')}},
 tagall:{groupOnly:true,adminOnly:true,execute:async(s,m,{reply})=>{const g=await s.groupMetadata(m.chat),ids=g.participants.map(p=>p.id);return reply(ids.map(x=>'@'+x.split('@')[0]).join(' '),{mentions:ids})}},
 hidetag:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply})=>{const g=await s.groupMetadata(m.chat),ids=g.participants.map(p=>p.id);return reply(inputText(args,m)||'📢 Announcement',{mentions:ids})}},
 promote:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,{args,reply})=>{const t=getTargets(m,args);if(!t.length)return reply('Mention, reply to a user, or provide a number.');await s.groupParticipantsUpdate(m.chat,t,'promote');return reply('✅ Promoted '+t.map(x=>'@'+x.split('@')[0]).join(', '),{mentions:t})}},
 demote:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,{args,reply})=>{const t=getTargets(m,args);if(!t.length)return reply('Mention, reply to a user, or provide a number.');await s.groupParticipantsUpdate(m.chat,t,'demote');return reply('✅ Demoted '+t.map(x=>'@'+x.split('@')[0]).join(', '),{mentions:t})}},
 remove:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,{args,reply})=>{const t=getTargets(m,args);if(!t.length)return reply('Mention, reply, or provide a number.');await s.groupParticipantsUpdate(m.chat,t,'remove');return reply('✅ Removed '+t.length+' member(s).')}},
 kick:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,c)=>special.remove.execute(s,m,c)},
 add:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,{args,reply})=>{const t=getTargets(m,args);if(!t.length)return reply('Provide a phone number.');await s.groupParticipantsUpdate(m.chat,t,'add');return reply('✅ Add request sent.')}},
 warn:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply,store})=>{const t=getTargets(m,args);const u=t[0]||m.sender;const n=store.warn(m.chat,u,inputText(args,m)||'manual warning');return reply(`⚠️ @${u.split('@')[0]} warned: ${n}`,{mentions:[u]})}},
 warns:{groupOnly:true,execute:async(s,m,{reply,store})=>reply(`⚠️ ${store.getWarnings(m.chat,m.sender)} warning(s)`)},
 clearwarns:{groupOnly:true,adminOnly:true,execute:async(s,m,{reply,store})=>{const t=getTargets(m,[]),u=t[0]||m.sender;store.clearWarnings(m.chat,u);return reply('✅ Warnings cleared.')}},
 setrules:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply,store})=>{store.group(m.chat).rules=inputText(args,m);store.save();return reply('✅ Rules saved.')}},
 rules:{groupOnly:true,execute:async(s,m,{reply,store})=>reply(store.group(m.chat).rules||'No rules configured.')},
 welcome:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply,store})=>{const g=store.group(m.chat);if(['on','off'].includes(args[0]))g.welcome=args[0]==='on';store.save();return reply(`Welcome: ${g.welcome?'🟢 ON':'🔴 OFF'}`)}},
 goodbye:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply,store})=>{const g=store.group(m.chat);if(['on','off'].includes(args[0]))g.goodbye=args[0]==='on';store.save();return reply(`Goodbye: ${g.goodbye?'🟢 ON':'🔴 OFF'}`)}},
 setwelcome:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply,store})=>{store.group(m.chat).welcomeText=inputText(args,m)||'Welcome @user to @group!';store.save();return reply('✅ Welcome template saved.')}},
 setgoodbye:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply,store})=>{store.group(m.chat).goodbyeText=inputText(args,m)||'Goodbye @user.';store.save();return reply('✅ Goodbye template saved.')}},
 setsubject:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,{args,reply})=>{await s.groupUpdateSubject(m.chat,inputText(args,m));return reply('✅ Subject updated.')}},
 setdesc:{groupOnly:true,adminOnly:true,botAdmin:true,execute:async(s,m,{args,reply})=>{await s.groupUpdateDescription(m.chat,inputText(args,m));return reply('✅ Description updated.')}},
 groupstats:{groupOnly:true,execute:async(s,m,{reply,store})=>richReply(s,m,statCard('👥 GROUP STATS',[['Members',(await s.groupMetadata(m.chat)).participants.length],['Warnings',Object.keys(store.data.warnings).filter(k=>k.startsWith(m.chat+':')).length],['Welcome',store.group(m.chat).welcome?'ON':'OFF'],['Goodbye',store.group(m.chat).goodbye?'ON':'OFF']]),{fallback:'Group stats ready'})},
 membercount:{groupOnly:true,execute:async(s,m,{reply})=>reply(String((await s.groupMetadata(m.chat)).participants.length))},
 setlang:{groupOnly:true,adminOnly:true,execute:async(s,m,{args,reply,store})=>{store.group(m.chat).lang=args[0]||'NG';store.save();return reply(`🌍 Group locale: ${store.group(m.chat).lang}`)}}
};
module.exports=factory('Group',names,{},special);
