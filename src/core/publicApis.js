const axios=require('axios');
const cache=new Map();
const http=axios.create({timeout:10000,headers:{'User-Agent':'NODAX-AI/3.0 by Musteqeem','Accept':'application/json'}});
async function get(url,params={},ttl=30000){
 const key=url+'?'+new URLSearchParams(params).toString(),old=cache.get(key);
 if(old&&Date.now()-old.at<ttl)return old.data;
 let last;
 for(let i=0;i<2;i++){try{const r=await http.get(url,{params});cache.set(key,{at:Date.now(),data:r.data});return r.data}catch(e){last=e;await new Promise(r=>setTimeout(r,250*(i+1)))}}
 throw new Error(last?.response?.data?.message||last?.message||'API request failed');
}
const need=x=>String(x||'').trim();
async function weather(place='Lagos'){const g=await get('https://geocoding-api.open-meteo.com/v1/search',{name:place,count:1,language:'en',format:'json'});const x=g.results?.[0];if(!x)throw Error('Location not found');const w=await get('https://api.open-meteo.com/v1/forecast',{latitude:x.latitude,longitude:x.longitude,current:'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code',timezone:'auto'});const c=w.current;return {title:`${x.name}, ${x.country}`,temperature:c.temperature_2m,feels:c.apparent_temperature,humidity:c.relative_humidity_2m,wind:c.wind_speed_10m,code:c.weather_code};}
async function wiki(q){if(!need(q))throw Error('Topic required');const r=await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(need(q).replace(/\s+/g,'_'))}`,{},60000);return {title:r.title,extract:r.extract||'No summary.',url:r.content_urls?.desktop?.page};}
async function define(q){if(!need(q))throw Error('Word required');const a=await get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(need(q))}`,{},60000),e=a[0],m=e.meanings?.[0],d=m?.definitions?.[0];return {word:e.word,pos:m?.partOfSpeech||'word',definition:d?.definition||'No definition',example:d?.example||''};}
async function joke(){const r=await get('https://v2.jokeapi.dev/joke/Any',{type:'single',safeMode:'true'});return r.joke||'No joke returned.'}
async function country(q){if(!need(q))throw Error('Country required');const a=await get(`https://restcountries.com/v3.1/name/${encodeURIComponent(q)}`),c=a[0];return {name:c.name.common,capital:c.capital?.[0]||'N/A',population:(c.population||0).toLocaleString(),region:c.region||'N/A',currency:Object.keys(c.currencies||{})[0]||'N/A',flag:c.flag||''};}
async function github(q){if(!need(q))throw Error('Use owner/repository');const r=await get(`https://api.github.com/repos/${need(q).replace(/^https?:\/\/github\.com\//,'').replace(/\/$/,'')}`,{},30000);return {repo:r.full_name,stars:r.stargazers_count,forks:r.forks_count,issues:r.open_issues_count,description:r.description||'No description'};}
async function quote(){const r=await get('https://dummyjson.com/quotes/random');return `“${r.quote}” — ${r.author}`}
async function advice(){const r=await get('https://api.adviceslip.com/advice');return r.slip.advice}
async function ip(q='json'){const r=await get(`https://ipapi.co/${encodeURIComponent(q)}/json/`,{},60000);return {ip:r.ip,city:r.city,country:r.country_name,org:r.org,timezone:r.timezone};}
async function crypto(q='bitcoin'){const id=need(q)||'bitcoin',r=await get('https://api.coingecko.com/api/v3/simple/price',{ids:id,vs_currencies:'usd'},15000);if(!r[id])throw Error('Coin not found');return {id,usd:r[id].usd};}
async function npm(q){if(!need(q))throw Error('Package required');const r=await get(`https://registry.npmjs.org/${encodeURIComponent(q)}`,{},30000);return {name:r.name,version:r['dist-tags']?.latest||'?',description:r.description||'No description'};}
async function exchange(from='USD',to='NGN',amount=1){const r=await get(`https://open.er-api.com/v6/latest/${String(from).toUpperCase()}`,{},60000);const rate=r.rates?.[String(to).toUpperCase()];if(!rate)throw Error('Currency unavailable');return {from,to,amount,rate,result:amount*rate};}
async function translate(text,to='fr',from='auto'){if(!need(text))throw Error('Text required');const url=process.env.TRANSLATE_URL||'https://api.mymemory.translated.net/get';const r=await get(url,{q:text,langpair:`${from}|${to}`},10000);return r.responseData?.translatedText||text;}
module.exports={weather,wiki,define,joke,country,github,quote,advice,ip,crypto,npm,exchange,translate};
