const os=require('node:os');
const crypto=require('node:crypto');
const {inputText,hash}=require('./helpers');
const {cardHtml,statCard,tableHtml,menuHtml,progressHtml,sendHtmlPrimitive,richReply}=require('./richHtml');
const {t,locale,countries}=require('./i18n');

const handlers={
 ping:async({reply})=>reply(`🏓 ${process.env.BOT_NAME||'NODAX AI'} PONG\nUptime: ${Math.floor(process.uptime())}s`),
 uptime:async({reply})=>reply(`⏱️ ${Math.floor(process.uptime()/3600)}h ${Math.floor(process.uptime()/60)%60}m ${Math.floor(process.uptime()%60)}s\nRAM: ${Math.round(process.memoryUsage().rss/1048576)}MB`),
 time:async({reply})=>reply(`🕒 ${new Date().toLocaleString()}`),
 date:async({reply})=>reply(`📅 ${new Date().toISOString().slice(0,10)}`),
 serverinfo:async({reply})=>reply(`🖥️ ${os.platform()} ${os.arch()}\nCPU: ${os.cpus().length}\nRAM: ${Math.round(os.totalmem()/1048576)}MB`),
 hash:async({args,m,reply})=>reply(hash(inputText(args,m)||m.sender)),
 echo:async({args,m,reply})=>reply(inputText(args,m)||'Nothing to echo.'),
 upper:async({args,m,reply})=>reply(inputText(args,m).toUpperCase()),
 lower:async({args,m,reply})=>reply(inputText(args,m).toLowerCase()),
 reverse:async({args,m,reply})=>reply([...inputText(args,m)].reverse().join('')),
 length:async({args,m,reply})=>{const x=inputText(args,m);return reply(`Characters: ${[...x].length}\nWords: ${x.trim()?x.trim().split(/\s+/).length:0}`)},
 base64:async({args,m,reply})=>reply(Buffer.from(inputText(args,m)).toString('base64')),
 unbase64:async({args,m,reply})=>{try{return reply(Buffer.from(inputText(args,m),'base64').toString())}catch{return reply('Invalid base64.')}} ,
 choose:async({args,reply})=>{const a=args.join(' ').split(',').map(x=>x.trim()).filter(Boolean);return reply(a.length?`🎯 ${a[Math.floor(Math.random()*a.length)]}`:'Use .choose one,two,three')},
 uuid:async({reply})=>reply(crypto.randomUUID()),
 timestamp:async({reply})=>reply(String(Date.now())),
 binary:async({args,m,reply})=>reply([...Buffer.from(inputText(args,m))].map(x=>x.toString(2).padStart(8,'0')).join(' ')),
 hex:async({args,m,reply})=>reply(Buffer.from(inputText(args,m)).toString('hex')),
 urlencode:async({args,m,reply})=>reply(encodeURIComponent(inputText(args,m))),
 urldecode:async({args,m,reply})=>{try{return reply(decodeURIComponent(inputText(args,m)))}catch{return reply('Invalid URL encoding.')}},
 slug:async({args,m,reply})=>reply(inputText(args,m).toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-')),
 trim:async({args,m,reply})=>reply(inputText(args,m).trim()),
 dedupe:async({args,reply})=>reply([...new Set(args)].join(' ')),
 count:async({args,reply})=>reply(String(args.length)),
 repeat:async({args,reply})=>{const n=Math.min(20,Math.max(1,Number(args[0])||1));return reply(args.slice(1).join(' ').repeat(n))},
 palindrome:async({args,m,reply})=>{const x=inputText(args,m).toLowerCase().replace(/\W/g,'');return reply(x===x.split('').reverse().join('')?'✅ Palindrome':'❌ Not a palindrome')},
 average:async({args,reply})=>{const a=args.map(Number).filter(Number.isFinite);return reply(a.length?String(a.reduce((x,y)=>x+y,0)/a.length):'Provide numbers.')},
 sum:async({args,reply})=>reply(String(args.map(Number).filter(Number.isFinite).reduce((a,b)=>a+b,0))),
 min:async({args,reply})=>{const a=args.map(Number).filter(Number.isFinite);return reply(a.length?String(Math.min(...a)):'Provide numbers.')},
 max:async({args,reply})=>{const a=args.map(Number).filter(Number.isFinite);return reply(a.length?String(Math.max(...a)):'Provide numbers.')},
 sqrt:async({args,reply})=>{const n=Number(args[0]);return reply(Number.isFinite(n)&&n>=0?String(Math.sqrt(n)):'Invalid number.')},
 power:async({args,reply})=>{const a=Number(args[0]),b=Number(args[1]);return reply(Number.isFinite(a)&&Number.isFinite(b)?String(a**b):'Use .power base exponent')},
 factorial:async({args,reply})=>{const n=Number(args[0]);if(!Number.isInteger(n)||n<0||n>170)return reply('Use an integer from 0 to 170.');let r=1;for(let i=2;i<=n;i++)r*=i;return reply(String(r))},
 prime:async({args,reply})=>{const n=Number(args[0]);if(!Number.isInteger(n)||n<2)return reply('Not prime.');for(let i=2;i*i<=n;i++)if(n%i===0)return reply('❌ Not prime.');return reply('✅ Prime.')},
 fibonacci:async({args,reply})=>{const n=Math.min(100,Math.max(0,Number(args[0])||0));let a=0,b=1;for(let i=0;i<n;i++)[a,b]=[b,a+b];return reply(String(a))},
 categories:async({registry,reply})=>reply(registry.categories().map(x=>`• ${x}`).join('\n')),
 commands:async({registry,reply})=>reply(`Loaded commands: ${registry.commands.length}\nUse .help <category> <page>`),
 help:async(s,m,{registry,args,reply})=>{const cat=args[0],page=Number(args[1])||1;return richReply(s,m,menuHtml(`${process.env.BOT_NAME||'NODAX AI'} • HELP`,[{title:cat||'ALL COMMANDS',items:registry.commands.filter(c=>!cat||c.category.toLowerCase()===String(cat).toLowerCase()).slice((page-1)*20,page*20).map(c=>`${c.usage} — ${c.desc}`)}]),{fallback:registry.help(cat,page)})},
 status:async(s,m,{registry,reply})=>richReply(s,m,statCard('NODAX STATUS',[['Status','ONLINE'],['Commands',registry.commands.length],['Uptime',Math.floor(process.uptime())+'s'],['RAM',Math.round(process.memoryUsage().rss/1048576)+' MB']]),{fallback:'NODAX ONLINE'}),
 botinfo:async({reply})=>reply(`֎ ${process.env.BOT_NAME||'NODAX AI'}\nCreated by Musteqeem • Future Scientist\nEngine: @musteqeem/baileys`),
 countrylist:async({reply})=>reply(countries.map(k=>`${k} — ${locale(k).country} / ${locale(k).lang}`).join('\n')),
 lang:async({args,reply})=>{const l=locale(args[0]);return reply(`🌍 ${l.country}\nLanguage: ${l.lang}\nCode: ${l.code}\nCurrency: ${l.prefix}`)},
};
const descriptions={};
for(const k of Object.keys(handlers))descriptions[k]=`${k} — dedicated Utility implementation`;
function factory(category,names,descs={},special={}){
 return names.map(name=>({
  name,category,desc:descs[name]||descriptions[name]||`${name} ${category} command`,usage:`.${name}`,
  groupOnly:Boolean(special[name]?.groupOnly),adminOnly:Boolean(special[name]?.adminOnly),ownerOnly:Boolean(special[name]?.ownerOnly),botAdmin:Boolean(special[name]?.botAdmin),
  execute:special[name]?.execute||handlers[name]||(async({reply})=>reply(`⚠️ ${name} is registered but has no handler.`))
 }));
}
module.exports={factory,handlers};
