const c=(name,desc,execute,alias=[])=>({name,alias,category:'Owner',desc,usage:`.${name}`,execute,ownerOnly:true});
module.exports=[
 c('reload','Reload all command modules',async(s,m,{reply,registry})=>reply(`✅ Reloaded ${registry.load()} commands.`),['restartcmds']),
 c('cmdcount','Show loaded command count',async(s,m,{reply,registry})=>reply(`📦 ${registry.commands.length} commands loaded.`)),
 c('cmderrors','Show command load errors',async(s,m,{reply,registry})=>reply(registry.errors.length?registry.errors.map(x=>`${x.file}: ${x.error}`).join('\n'):'✅ No command load errors.')),
 c('setvar','Set a persistent NODAX variable',async(s,m,{args,reply,store})=>{const [k,...v]=args;if(!k||!v.length)return reply('Usage: .setvar key value');store.data.kv[k]=v.join(' ');store.save();return reply(`✅ ${k} saved.`)}),
 c('getvar','Read a persistent NODAX variable',async(s,m,{args,reply,store})=>reply(String(store.data.kv[args[0]]??'Not set.'))),
 c('delvar','Delete a persistent variable',async(s,m,{args,reply,store})=>{delete store.data.kv[args[0]];store.save();return reply('✅ Variable removed.')}),
 c('logs','Show recent moderation logs',async(s,m,{reply,store})=>reply(store.data.logs.slice(-20).map(x=>`${new Date(x.at).toISOString()} ${x.type||'event'} ${x.chat||''}`).join('\n')||'No logs.')),
 c('backup','Create an in-process data backup',async(s,m,{reply,store})=>{store.save();return reply(`✅ Data persisted at ${store.file}`)}),
 c('health','Show internal health',async(s,m,{reply,registry})=>reply(`✅ NODAX healthy\nCommands: ${registry.commands.length}\nUptime: ${Math.floor(process.uptime())}s`)),
 c('announceall','Send a controlled announcement to current chat',async(s,m,{args,reply})=>reply(`📢 OWNER ANNOUNCEMENT\n\n${args.join(' ')||'No text provided.'}`)),
 c('maintenance','Show maintenance notice',async(s,m,{reply})=>reply('🛠️ NODAX maintenance mode is controlled by the operator.')), 
 c('setprefix','Explain prefix configuration',async(s,m,{reply})=>reply(`Current prefix: ${process.env.PREFIX||'.'}\nChange PREFIX in .env and restart NODAX.`)),
 c('version','Show NODAX version',async(s,m,{reply})=>reply('NODAX 1.0.0 · Musteqeem · command engine')), 
 c('debug','Show current message context',async(s,m,{reply})=>reply(JSON.stringify({chat:m.chat,sender:m.sender,isGroup:m.isGroup,isAdmin:m.isAdmin,isBotAdmin:m.isBotAdmin},null,2))),
 c('shutdown','Refuse remote shutdown safely',async(s,m,{reply})=>reply('For safety, stop NODAX from the hosting process instead of through a chat command.'))
];
