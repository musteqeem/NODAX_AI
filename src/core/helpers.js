const crypto=require('node:crypto');
const inputText=(args=[],m={})=>args.join(' ').trim()||String(m.quoted?.text||'').trim();
const normalizeJid=jid=>String(jid||'').replace(/:\d+(?=@)/,'');
const unique=a=>[...new Set((a||[]).filter(Boolean))];
const getTargets=(m,args=[])=>unique([...(m.quoted?.sender?[m.quoted.sender]:[]),...(m.mentionedJid||[]),...args.map(x=>{const d=String(x).replace(/\D/g,'');return d.length>=7?`${d}@s.whatsapp.net`:null})].filter(Boolean).map(normalizeJid));
const hash=(text,algorithm='sha256')=>crypto.createHash(algorithm).update(String(text)).digest('hex');
const safeJson=(v,max=12000)=>{const x=typeof v==='string'?v:JSON.stringify(v,null,2);return x.length>max?x.slice(0,max-18)+'\n…truncated':x};
module.exports={inputText,normalizeJid,getTargets,unique,hash,safeJson};
