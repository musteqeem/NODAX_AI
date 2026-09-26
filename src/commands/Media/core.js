const { inputText } = require('../../core/helpers');
const c=(name,desc,execute,alias=[],extra={})=>({name,alias,category:'Media',desc,usage:`.${name}`,execute,...extra});
const needQuoted=(m,reply)=>{if(!m.quoted)return reply('Reply to a media message first.');};
module.exports=[
 c('sticker','Convert a replied image or video to a sticker',async(s,m,{reply})=>{if(!m.quoted?.raw)return reply('Reply to an image or video.');const type=m.quoted.raw.message?.imageMessage?'image':m.quoted.raw.message?.videoMessage?'video':null;if(!type)return reply('Reply to an image or short video.');const stream=await s.downloadContentFromMessage(m.quoted.raw.message[`${type}Message`],type);const chunks=[];for await(const x of stream)chunks.push(x);return s.sendMessage(m.chat,{sticker:Buffer.concat(chunks)},{quoted:m.raw})},['s']),
 c('mediaid','Show the quoted media type and metadata',async(s,m,{reply})=>{needQuoted(m,reply);return reply(`Media: ${Object.keys(m.quoted.raw.message||{}).join(', ')}`)}),
 c('caption','Send a caption for the replied media',async(s,m,{args,reply})=>{needQuoted(m,reply);return s.sendMessage(m.chat,{text:inputText(args,m)},{quoted:m.raw})}),
 c('react','React to the replied message',async(s,m,{args,reply})=>{const emoji=args[0]||'👍';return s.sendMessage(m.chat,{react:{text:emoji,key:m.quoted?.raw?.key||m.raw.key}}).then(()=>reply(`Reacted with ${emoji}.`))}),
 c('pin','Pin the replied message',async(s,m,{reply})=>{if(!m.quoted?.raw)return reply('Reply to a message.');await s.sendMessage(m.chat,{pin:{key:m.quoted.raw.key,time:86400}});return reply('📌 Pinned for 24 hours.')},[],{groupOnly:true,adminOnly:true}),
 c('unpin','Unpin the replied message',async(s,m,{reply})=>{if(!m.quoted?.raw)return reply('Reply to a message.');await s.sendMessage(m.chat,{pin:{key:m.quoted.raw.key,time:0}});return reply('📌 Unpinned.')},[],{groupOnly:true,adminOnly:true}),
 c('read','Mark the current chat read',async(s,m,{reply})=>{await s.readMessages([m.raw.key]);return reply('✅ Marked as read.')}),
 c('typing','Show typing presence briefly',async(s,m,{reply})=>{await s.sendPresenceUpdate('composing',m.chat);setTimeout(()=>s.sendPresenceUpdate('paused',m.chat).catch(()=>{}),1500);return reply('⌨️ Typing presence sent.')}),
 c('recording','Show recording presence briefly',async(s,m,{reply})=>{await s.sendPresenceUpdate('recording',m.chat);setTimeout(()=>s.sendPresenceUpdate('paused',m.chat).catch(()=>{}),1500);return reply('🎙️ Recording presence sent.')}),
 c('vcard','Create a contact card from a number',async(s,m,{args,reply})=>{const n=String(args[0]||'').replace(/\D/g,'');if(n.length<7)return reply('Usage: .vcard 2348012345678 | Name');const name=args.slice(1).join(' ')||'NODAX Contact';return s.sendMessage(m.chat,{contacts:{displayName:name,contacts:[{vcard:`BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;waid=${n}:${n}\nEND:VCARD`}]}})}),
 c('location','Share a location: .location lat lon name',async(s,m,{args,reply})=>{if(args.length<2)return reply('Usage: .location latitude longitude | name');const [lat,lon]=args;return s.sendMessage(m.chat,{location:{degreesLatitude:Number(lat),degreesLongitude:Number(lon),name:args.slice(2).join(' ')||'Pinned location'}})}),
 c('audioinfo','Inspect a replied audio message',async(s,m,{reply})=>{needQuoted(m,reply);return reply('🎧 Audio message detected. Use the original message to preserve its media metadata.')}),
 c('videoinfo','Inspect a replied video message',async(s,m,{reply})=>{needQuoted(m,reply);return reply('🎬 Video message detected.')}),
 c('imageinfo','Inspect a replied image message',async(s,m,{reply})=>{needQuoted(m,reply);return reply('🖼️ Image message detected.')}),
 c('docinfo','Inspect a replied document',async(s,m,{reply})=>{needQuoted(m,reply);return reply('📄 Document message detected.')}),
 c('voice','Send a text voice-note placeholder safely',async(s,m,{reply})=>reply('Voice generation requires an audio provider. NODAX does not fake an audio file.')),
 c('gif','Explain how to send a GIF',async(s,m,{reply})=>reply('Reply to a short video and use .sticker for a WhatsApp sticker.')),
 c('quote','Quote the replied message',async(s,m,{reply})=>reply(m.quoted?.text||'Reply to a message to quote it.')),
 c('forward','Forward the replied message to the current chat',async(s,m,{reply})=>{if(!m.quoted?.raw)return reply('Reply to a message.');await s.sendMessage(m.chat,{forward:m.quoted.raw});return reply('↪️ Forwarded.')},[],{adminOnly:false}),
 c('delete','Delete the replied message',async(s,m,{reply})=>{if(!m.quoted?.raw)return reply('Reply to a message.');await s.sendMessage(m.chat,{delete:m.quoted.raw.key});return reply('🗑️ Deleted.')},[],{groupOnly:true,adminOnly:true,botAdmin:true})
];
