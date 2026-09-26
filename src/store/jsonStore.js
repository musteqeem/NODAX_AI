const fs=require('node:fs'),path=require('node:path');
class JsonStore{
 constructor(file=path.resolve(process.env.DATA_FILE||'data/nodax.json')){this.file=file;this.data={groups:{},warnings:{},logs:[],kv:{},users:{}};this.load();}
 load(){fs.mkdirSync(path.dirname(this.file),{recursive:true});try{if(fs.existsSync(this.file))this.data={...this.data,...JSON.parse(fs.readFileSync(this.file,'utf8'))}}catch(e){console.error('[store] load:',e.message)}}
 save(){fs.mkdirSync(path.dirname(this.file),{recursive:true});const tmp=this.file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(this.data,null,2));fs.renameSync(tmp,this.file);}
 group(jid){return this.data.groups[jid] ||= {welcome:true,goodbye:true,welcomeText:'Welcome @user to @group! You are member @count.',goodbyeText:'Goodbye @user. We wish you well.',rules:'',whitelist:[],blockedWords:[],warnings:3,locked:false,...Object.fromEntries(['antilink','antiinvite','antispam','antiflood','anticaps','antiemoji','antitag','antiword','antiscam','antiphishing','antirepeat','antilongtext','antiunicode','antiforward','antiimage','antivideo','antiaudio','antisticker','antidocument','anticontact','antilocation','antipoll','antiviewonce','anticall','antibot','antistatus','antidisappearing','antighost'].map(k=>[k,false]))};}
 warn(g,u,reason){const k=`${g}:${u}`;this.data.warnings[k] ||= {count:0,reasons:[]};this.data.warnings[k].count++;this.data.warnings[k].reasons.push({reason,at:Date.now()});this.save();return this.data.warnings[k].count;}
 getWarnings(g,u){return this.data.warnings[`${g}:${u}`]?.count||0;}
 clearWarnings(g,u){delete this.data.warnings[`${g}:${u}`];this.save();}
 log(event){this.data.logs.push({...event,at:Date.now()});this.data.logs=this.data.logs.slice(-1000);this.save();}
}
module.exports={JsonStore};
