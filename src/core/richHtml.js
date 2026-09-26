const crypto = require('node:crypto');
const { generateWAMessageFromContent } = require('@musteqeem/baileys');

const esc = (v='') => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css = `
*{box-sizing:border-box}html,body{margin:0;padding:0;background:#020617;color:#e5f7ff;font-family:Arial,Helvetica,sans-serif}
body{padding:8px}.card{max-width:620px;margin:auto;border:1px solid #164e63;border-radius:24px;padding:16px;
background:radial-gradient(circle at 50% 0,#123c5c 0,#061426 42%,#020617 100%);box-shadow:0 14px 40px #000b}
h1{margin:0;text-align:center;font-size:24px;color:#67e8f9;text-shadow:0 0 18px #22d3ee}.sub{text-align:center;color:#94a3b8;font:11px monospace;margin:6px 0 14px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tile{padding:12px;border:1px solid #155e75;border-radius:15px;background:#061522}
.label{font:10px monospace;color:#67e8f9;text-transform:uppercase}.value{font-weight:800;margin-top:4px;word-break:break-word}
.bar{height:9px;border-radius:9px;background:#0f2533;overflow:hidden;margin-top:8px}.bar>i{display:block;height:100%;background:#22d3ee}
.body{white-space:pre-wrap;line-height:1.55;padding:12px;border:1px solid #ffffff14;border-radius:14px;background:#020617aa}
.table{width:100%;border-collapse:collapse}.table td,.table th{padding:7px;border-bottom:1px solid #ffffff14;text-align:left}.muted{color:#94a3b8}
.footer{text-align:center;color:#64748b;font:10px monospace;margin-top:12px}
button{border:1px solid #155e75;background:#082536;color:#dffcff;border-radius:12px;padding:10px;font-weight:800}
`;
function page(title,subtitle,body,footer='֎ NODAX AI • MUSTEQEEM'){
 return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><section class="card"><h1>${esc(title)}</h1><div class="sub">${esc(subtitle)}</div>${body}<div class="footer">${esc(footer)}</div></section></body></html>`;
}
function cardHtml(title,subtitle,body){return page(title,subtitle,`<div class="body">${esc(body)}</div>`)}
function statCard(title,items){
 const body=`<div class="grid">${items.map(([k,v])=>`<div class="tile"><div class="label">${esc(k)}</div><div class="value">${esc(v)}</div></div>`).join('')}</div>`;
 return page(title,'NODAX RICHMSG • MUSTEQEEM',body);
}
function menuHtml(title,sections){
 const body=sections.map(s=>`<div class="tile"><div class="label">${esc(s.title)}</div>${s.items.map(x=>`<div style="padding:5px 0">▸ ${esc(x)}</div>`).join('')}</div>`).join('');
 return page(title,'MODERN COMMAND CENTER',`<div class="grid">${body}</div>`);
}
function tableHtml(title,headers,rows){
 const body=`<table class="table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 return page(title,'RICH DATA VIEW',body);
}
function progressHtml(title,label,value,max=100){
 const pct=Math.max(0,Math.min(100,Number(value)/Number(max)*100));
 return page(title,'PROGRESS',`<div class="tile"><div class="label">${esc(label)}</div><div class="value">${esc(value)} / ${esc(max)}</div><div class="bar"><i style="width:${pct}%"></i></div></div>`);
}
function gameHtml(name,description,state=[]){
 return page(`🎮 ${name}`,'NODAX GAME ARENA',`<div class="body">${esc(description)}</div>${state.length?`<div class="grid" style="margin-top:9px">${state.map(([k,v])=>`<div class="tile"><div class="label">${esc(k)}</div><div class="value">${esc(v)}</div></div>`).join('')}</div>`:''}`);
}
function helpHtml(bot,categories,commands){
 return menuHtml(`${bot} • COMMANDS`,categories.map(x=>({title:x,items:commands.filter(c=>c.category===x).slice(0,8).map(c=>`${c.usage} — ${c.desc}`)})));
}
function profileHtml(title,data){return statCard(title,Object.entries(data))}
function errorHtml(title,error){return cardHtml(`❌ ${title}`,'ERROR',String(error))}
async function sendHtmlPrimitive(sock,jid,html,options={}){
 const payload={__typename:'GenAIUnifiedResponse',response_id:crypto.randomUUID(),sections:[{__typename:'GenAIUnifiedResponseSection',view_model:{__typename:'GenAISingleLayoutViewModel',primitive:{__typename:'FOAHtmlPrimitiveDemoDONOTUSE',trusted_sources:[],payload:String(html).trim()}}}]};
 const content={botForwardedMessage:{message:{richResponseMessage:{messageType:1,unifiedResponse:{data:Buffer.from(JSON.stringify(payload)).toString('base64')},contextInfo:{isForwarded:true,forwardOrigin:4}}}}};
 const msg=generateWAMessageFromContent(jid,content,{});
 return sock.relayMessage(jid,msg.message,{messageId:msg.key.id,...options});
}
async function richReply(sock,m,html,opts={}){try{return await sendHtmlPrimitive(sock,m.chat,html,{...opts,quoted:m.raw})}catch(e){return m.reply(opts.fallback||'Rich message unavailable. '+e.message)}}
const rich = {
 esc,page,cardHtml,statCard,menuHtml,tableHtml,progressHtml,gameHtml,helpHtml,profileHtml,errorHtml,sendHtmlPrimitive,richReply,
 badge:(t)=>`<span>${esc(t)}</span>`,
 pill:(t)=>`<span style="display:inline-block;padding:5px 9px;border:1px solid #155e75;border-radius:99px">${esc(t)}</span>`,
 divider:()=>'<hr style="border:0;border-top:1px solid #ffffff14">',
 code:(code,lang='text')=>`<div class="tile"><div class="label">${esc(lang)}</div><pre style="white-space:pre-wrap">${esc(code)}</pre></div>`,
 list:(items)=>`<div class="body">${items.map(x=>`• ${esc(x)}`).join('<br>')}</div>`,
 kv:(obj)=>Object.entries(obj).map(([k,v])=>`<div class="tile"><div class="label">${esc(k)}</div><div class="value">${esc(v)}</div></div>`).join(''),
 alert:(t)=>`<div class="tile" style="border-color:#0e7490">${esc(t)}</div>`,
 title:(t)=>`<h1>${esc(t)}</h1>`,
 small:(t)=>`<div class="muted">${esc(t)}</div>`,
 badgeRow:(xs)=>`<div style="display:flex;gap:6px;flex-wrap:wrap">${xs.map(x=>rich.pill(x)).join('')}</div>`,
};
module.exports={...rich};
