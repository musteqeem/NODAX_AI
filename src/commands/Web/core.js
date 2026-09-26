const api=require('../../core/publicApis');
const {richReply,statCard,cardHtml,tableHtml}=require('../../core/richHtml');
const {inputText}=require('../../core/helpers');
const wrap=(name,fn,format)=>({name,category:'Web',desc:`Live ${name} data`,usage:`.${name} [query]`,execute:async(s,m,{args,reply})=>{try{const x=await fn(inputText(args,m));return format?format(x,m):reply(typeof x==='string'?x:JSON.stringify(x,null,2))}catch(e){return reply(`❌ ${name}: ${e.message}`)}}});
module.exports=[
wrap('weather',api.weather,x=>richReply(null,{chat:null},'').catch(()=>{})),
].filter(Boolean);
module.exports=[
 {name:'weather',category:'Web',desc:'Live weather lookup',usage:'.weather Lagos',execute:async(s,m,{args,reply})=>{try{const x=await api.weather(inputText(args,m)||'Lagos');return richReply(s,m,statCard('🌤️ WEATHER',[['Place',x.title],['Temperature',x.temperature+'°C'],['Feels like',x.feels+'°C'],['Humidity',x.humidity+'%'],['Wind',x.wind+' km/h'],['Code',x.code]]),{fallback:`${x.title}: ${x.temperature}°C, ${x.humidity}% humidity`})}catch(e){return reply('❌ '+e.message)}}},
 {name:'wiki',category:'Web',desc:'Wikipedia summary',usage:'.wiki topic',execute:async(s,m,{args,reply})=>{try{const x=await api.wiki(inputText(args,m));return richReply(s,m,cardHtml('📚 '+x.title,'WIKIPEDIA',x.extract+(x.url?'\n\n'+x.url:'')),{fallback:x.extract})}catch(e){return reply('❌ '+e.message)}}},
 {name:'define',category:'Web',desc:'Dictionary definition',usage:'.define word',execute:async(s,m,{args,reply})=>{try{const x=await api.define(inputText(args,m));return richReply(s,m,cardHtml('📖 '+x.word,x.pos,x.definition+(x.example?'\n\nExample: '+x.example:'')),{fallback:x.definition})}catch(e){return reply('❌ '+e.message)}}},
 {name:'joke',category:'Web',desc:'Safe public joke API',usage:'.joke',execute:async(s,m,{reply})=>reply(await api.joke())},
 {name:'country',category:'Web',desc:'Country information',usage:'.country Nigeria',execute:async(s,m,{args,reply})=>{try{const x=await api.country(inputText(args,m));return richReply(s,m,statCard('🌍 '+x.name,[['Capital',x.capital],['Population',x.population],['Region',x.region],['Currency',x.currency]]),{fallback:`${x.name} • ${x.capital} • ${x.population}`})}catch(e){return reply('❌ '+e.message)}}},
 {name:'github',category:'Web',desc:'GitHub repository information',usage:'.github owner/repo',execute:async(s,m,{args,reply})=>{try{const x=await api.github(inputText(args,m));return richReply(s,m,statCard('🐙 '+x.repo,[['Stars',x.stars],['Forks',x.forks],['Open issues',x.issues],['Description',x.description]]),{fallback:x.description})}catch(e){return reply('❌ '+e.message)}}},
 {name:'quoteapi',category:'Web',desc:'Random quote',usage:'.quoteapi',execute:async(s,m,{reply})=>reply(await api.quote())},
 {name:'advice',category:'Web',desc:'Advice API',usage:'.advice',execute:async(s,m,{reply})=>reply('🧠 '+await api.advice())},
 {name:'ipinfo',category:'Web',desc:'IP information',usage:'.ipinfo [ip]',execute:async(s,m,{args,reply})=>reply(JSON.stringify(await api.ip(inputText(args,m)||'json'),null,2))},
 {name:'crypto',category:'Web',desc:'Crypto spot price',usage:'.crypto bitcoin',execute:async(s,m,{args,reply})=>{try{const x=await api.crypto(inputText(args,m)||'bitcoin');return reply(`🪙 ${x.id}: $${x.usd}`)}catch(e){return reply('❌ '+e.message)}}},
 {name:'npm',category:'Web',desc:'NPM package lookup',usage:'.npm express',execute:async(s,m,{args,reply})=>{try{const x=await api.npm(inputText(args,m));return richReply(s,m,statCard('📦 '+x.name,[['Version',x.version],['Description',x.description]]),{fallback:`${x.name}@${x.version}`})}catch(e){return reply('❌ '+e.message)}}},
 {name:'exchange',category:'Web',desc:'Currency conversion',usage:'.exchange USD NGN 10',execute:async(s,m,{args,reply})=>{try{const x=await api.exchange(args[0]||'USD',args[1]||'NGN',Number(args[2]||1));return reply(`${x.amount} ${x.from} = ${x.result.toFixed(2)} ${x.to}\nRate: ${x.rate}`)}catch(e){return reply('❌ '+e.message)}}},
 {name:'translate',category:'Web',desc:'Translate text through a public translation service',usage:'.translate fr hello world',execute:async(s,m,{args,reply})=>{try{const to=args.shift()||'fr';return reply(await api.translate(args.join(' '),to))}catch(e){return reply('❌ '+e.message)}}}
];
