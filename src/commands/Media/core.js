const {factory}=require('../../core/catalog');
const names=['sticker','toimg','tovideo','toaudio','tomp3','resize','crop','rotate','flip','mirror','blur','sharpen','compress','metadata','mimetype','filesize','mediainfo','caption','repack','thumbnail','watermark','removebg','qr','barcode','ocr','translateimage','scan','palette','dominant','frames','gif','webp','jpg','png','mp4','mp3','wav','document','contactcard','vcard','textpro','ephoto','photooxy','makerhelp'];
async function maker(kind,args,reply){
 let mumaker;try{mumaker=require('mumaker')}catch{return reply('Install mumaker first: npm i mumaker')}
 const text=args.join(' ').trim();if(!text)return reply(`Use .${kind} <text>`);
 const urls={textpro:'https://textpro.me/create-neon-devil-wings-text-effect-online-free-1014.html',ephoto:'https://ephoto360.com/tao-hieu-ung-chu-phong-cach-dragon-ball-truc-tuyen-1000.html',photooxy:'https://photooxy.com/logo-and-text-effects/make-tik-tok-text-effect-375.html'};
 try{const r=await mumaker[kind](urls[kind],text);if(r?.image)return reply({image:{url:r.image},caption:`֎ ${kind} • NODAX AI`});return reply('Maker returned no image URL.')}catch(e){return reply(`❌ ${kind}: ${e.message}`)}
}
const special={
 mimetype:{execute:async(s,m,{reply})=>reply(`MIME: ${Object.keys(m.raw.message||{})[0]||'text/plain'}`)},
 mediainfo:{execute:async(s,m,{reply})=>reply(`Message types: ${Object.keys(m.raw.message||{}).join(', ')||'text'}`)},
 textpro:{execute:async(s,m,{args,reply})=>maker('textpro',args,reply)},
 ephoto:{execute:async(s,m,{args,reply})=>maker('ephoto',args,reply)},
 photooxy:{execute:async(s,m,{args,reply})=>maker('photooxy',args,reply)},
 makerhelp:{execute:async(s,m,{reply})=>reply('🎨 .textpro TEXT\n🎨 .ephoto TEXT\n🎨 .photooxy TEXT\nUses the mumaker package when installed.')}
};
module.exports=factory('Media',names,{},special);
