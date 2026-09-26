const os = require('node:os');
const { inputText, hash, safeJson } = require('../../core/helpers');
const api = require('../../core/publicApis');
const command = (name, desc, execute, alias = [], extra = {}) => ({ name, alias, category: 'Utility', desc, usage: `.${name}`, execute, ...extra });
const reply = (r, text) => r(text);

module.exports = [
 command('ping', 'Check NODAX latency and process health', async (s,m,{reply}) => reply(`🏓 *PONG*\nOnline: ${Math.round(process.uptime())}s\nNode: ${process.version}`), ['p']),
 command('uptime', 'Show process uptime and memory', async (s,m,{reply}) => reply(`⏱️ Uptime: ${Math.floor(process.uptime()/3600)}h ${Math.floor(process.uptime()/60)%60}m\nMemory: ${Math.round(process.memoryUsage().rss/1024/1024)}MB`)),
 command('time', 'Show the current server time', async (s,m,{reply}) => reply(`🕒 ${new Date().toString()}`)),
 command('date', 'Show today’s date', async (s,m,{reply}) => reply(`📅 ${new Date().toISOString().slice(0,10)}`)),
 command('calc', 'Safely calculate basic arithmetic', async (s,m,{args,reply}) => { const x=inputText(args,m); if(!/^[0-9+\-*/%().\s]+$/.test(x)) return reply('Only numbers and arithmetic operators are allowed.'); try{return reply(`🧮 ${Function(`"use strict";return (${x})`)()}`)}catch(e){return reply('Invalid expression.')} }),
 command('echo', 'Repeat text', async (s,m,{args,reply}) => reply(inputText(args,m) || 'Nothing to echo.')),
 command('upper', 'Convert text to uppercase', async (s,m,{args,reply}) => reply(inputText(args,m).toUpperCase())),
 command('lower', 'Convert text to lowercase', async (s,m,{args,reply}) => reply(inputText(args,m).toLowerCase())),
 command('reverse', 'Reverse text', async (s,m,{args,reply}) => reply([...inputText(args,m)].reverse().join(''))),
 command('length', 'Count characters and words', async (s,m,{args,reply}) => {const x=inputText(args,m); return reply(`Characters: ${x.length}\nWords: ${x ? x.trim().split(/\s+/).length : 0}`)}),
 command('base64', 'Encode text as base64', async (s,m,{args,reply}) => reply(Buffer.from(inputText(args,m)).toString('base64'))),
 command('unbase64', 'Decode base64 text', async (s,m,{args,reply}) => {try{return reply(Buffer.from(inputText(args,m),'base64').toString('utf8'))}catch{return reply('Invalid base64.')}}),
 command('sha256', 'Hash text with SHA-256', async (s,m,{args,reply}) => reply(hash(inputText(args,m)||String(m.sender)))),
 command('json', 'Pretty-print a JSON object', async (s,m,{args,reply}) => {try{return reply(safeJson(JSON.parse(inputText(args,m))))}catch{return reply('Invalid JSON.')}}),
 command('serverinfo', 'Show server platform details', async (s,m,{reply}) => reply(`🖥️ ${os.platform()} ${os.arch()}\nCPU: ${os.cpus().length}\nFree RAM: ${Math.round(os.freemem()/1024/1024)}MB`)),
 command('id', 'Show the current chat and sender IDs', async (s,m,{reply}) => reply(`Chat: ${m.chat}\nSender: ${m.sender || 'unknown'}`)),
 command('botinfo', 'Show NODAX identity and version', async (s,m,{reply}) => reply('⚡ *NODAX*\nDeterministic command engine\nCreated by Musteqeem\nPairing-code WhatsApp runtime')),
 command('weather', 'Get keyless current weather', async (s,m,{args,reply}) => {try{return reply(await api.weather(inputText(args,m)||'Lagos'))}catch(e){return reply(`Weather service unavailable: ${e.message}`)}}),
 command('wiki', 'Get a Wikipedia summary', async (s,m,{args,reply}) => {try{return reply(await api.wiki(inputText(args,m)))}catch(e){return reply(`Wikipedia unavailable: ${e.message}`)}}),
 command('define', 'Get an English dictionary definition', async (s,m,{args,reply}) => {try{return reply(await api.define(inputText(args,m)))}catch(e){return reply(`Dictionary unavailable: ${e.message}`)}}),
 command('joke', 'Get a safe random joke', async (s,m,{reply}) => {try{return reply(await api.joke())}catch(e){return reply('Joke service unavailable.')}}),
 command('country', 'Look up country facts', async (s,m,{args,reply}) => {try{return reply(await api.country(inputText(args,m)))}catch(e){return reply(`Country service unavailable: ${e.message}`)}}),
 command('github', 'Inspect a public GitHub repository', async (s,m,{args,reply}) => {try{return reply(await api.github(inputText(args,m)))}catch(e){return reply(`GitHub lookup unavailable: ${e.message}`)}}),
 command('choose', 'Choose randomly from comma-separated options', async (s,m,{args,reply}) => {const a=inputText(args,m).split(',').map(x=>x.trim()).filter(Boolean); return reply(a.length ? `🎯 ${a[Math.floor(Math.random()*a.length)]}` : 'Use .choose red, blue, green')}),
 command('remindme', 'Record a reminder request for the current chat', async (s,m,{args,reply,store}) => {const x=inputText(args,m); if(!x)return reply('Tell me the reminder text.'); store.data.kv[`reminder:${m.chat}`]={text:x,at:Date.now()};store.save();return reply(`🔔 Reminder saved: ${x}`)}),
 command('rules', 'Show group rules', async (s,m,{reply,store}) => reply(store.group(m.chat).rules || 'No rules configured. An admin can use .setrules <text>.')), 
 command('setrules', 'Set group rules', async (s,m,{args,reply,store}) => {store.group(m.chat).rules=inputText(args,m);store.save();return reply('✅ Group rules updated.')} ,[],{groupOnly:true,adminOnly:true}),
 command('help', 'Show the command index', async (s,m,{args,reply,registry}) => reply(`📚 *NODAX COMMANDS*\n${registry.help(args.join(' ')) || 'No commands in that category.'}`)),
 command('categories', 'List command categories', async (s,m,{reply,registry}) => reply([...new Set(registry.commands.map(c=>c.category))].sort().map(x=>`• ${x}`).join('\n'))),
 command('reload', 'Reload command modules', async (s,m,{reply,registry}) => reply(`✅ Loaded ${registry.load()} commands.`),[],{ownerOnly:true}),
 command('prefix', 'Show the active prefix', async (s,m,{reply}) => reply(`Prefix: ${process.env.PREFIX || '.'}`)),
 command('quote', 'Quote the replied message text', async (s,m,{reply}) => reply(m.quoted?.text || 'Reply to a text message.')),
 command('format', 'Format text as a rich boxed message', async (s,m,{args,reply}) => reply(`╭─〔 NODAX 〕─╮\n${inputText(args,m) || 'Hello from NODAX'}\n╰────────────╯`)),
 command('clean', 'Normalize repeated whitespace', async (s,m,{args,reply}) => reply(inputText(args,m).replace(/\s+/g,' ').trim())),
 command('words', 'Count word frequency', async (s,m,{args,reply}) => {const c={};for(const w of inputText(args,m).toLowerCase().match(/[a-z0-9]+/g)||[])c[w]=(c[w]||0)+1;return reply(Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([w,n])=>`${w}: ${n}`).join('\n')||'No words.')})
];
