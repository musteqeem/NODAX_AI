const LINK=/https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me\//i;
const SCAM=/(send money|otp|one[- ]time password|claim prize|double your|crypto giveaway)/i;
const BAD=/(porn|sex scam|free money|verify your account)/i;
class DefenseEngine {
  constructor(store){this.store=store;this.activity=new Map();this.repeats=new Map()}
  classify(m){const g=this.store.group(m.chat),t=m.text||'',raw=m.raw.message||{},out=[];const add=(key,why)=>{if(g[key])out.push([key,why])};
    if(LINK.test(t))add('antilink','link'); if(/chat\.whatsapp\.com/i.test(t))add('antiinvite','invite'); if(SCAM.test(t))add('antiscam','scam'); if(BAD.test(t))add('antiword','blocked word'); if(/[A-Z]{12,}/.test(t))add('anticaps','caps flood'); if((t.match(/@\d+/g)||[]).length>8)add('antitag','mention flood'); if(t.length>2500)add('antilongtext','long message'); if(/[^\x00-\x7F]{40,}/.test(t))add('antiunicode','unicode flood'); if(raw.forwarded||raw.extendedTextMessage?.contextInfo?.isForwarded)add('antiforward','forward');
    const types={imageMessage:'antiimage',videoMessage:'antivideo',audioMessage:'antiaudio',stickerMessage:'antisticker',documentMessage:'antidocument',contactMessage:'anticontact',locationMessage:'antilocation',pollCreationMessage:'antipoll',viewOnceMessageV2:'antiviewonce'};for(const k of Object.keys(types))if(raw[k])add(types[k],k);if(raw.call)add('anticall','call');return out;
  }
  async inspect(sock,m){if(!m.isGroup||m.isAdmin)return null;const g=this.store.group(m.chat),now=Date.now(),key=`${m.chat}:${m.sender}`;const list=(this.activity.get(key)||[]).filter(x=>now-x<10000);list.push(now);this.activity.set(key,list);if(g.antiflood&&list.length>Number(process.env.MAX_MESSAGES_PER_10S||8))return this.penalize(sock,m,'flood');const sig=`${key}:${m.text}`;const reps=(this.repeats.get(sig)||[]).filter(x=>now-x<30000);reps.push(now);this.repeats.set(sig,reps);if(g.antirepeat&&reps.length>=3)return this.penalize(sock,m,'repeat');const violations=this.classify(m);if(violations.length)return this.penalize(sock,m,violations[0][1]);return null}
  async penalize(sock,m,reason){try{await sock.sendMessage(m.chat,{delete:m.raw.key})}catch{}const n=this.store.warn(m.chat,m.sender,reason),limit=Number(process.env.WARN_LIMIT||3);if(n>=limit){try{if(m.isBotAdmin)await sock.groupParticipantsUpdate(m.chat,[m.sender],'remove')}catch{}return `🛡️ NODAX removed @${m.sender.split('@')[0]} after ${n} warnings (${reason}).`}return `🛡️ Warning ${n}/${limit} for @${m.sender.split('@')[0]} (${reason}).`}
}
module.exports={DefenseEngine};
