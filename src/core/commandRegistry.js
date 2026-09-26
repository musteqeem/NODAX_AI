const fs=require('node:fs'),path=require('node:path');
class CommandRegistry{
 constructor(root=path.resolve(__dirname,'../commands')){this.root=root;this.byKey=new Map();this.commands=[];this.errors=[]}
 load(){this.byKey.clear();this.commands=[];this.errors=[];if(!fs.existsSync(this.root))return 0;
  for(const category of fs.readdirSync(this.root,{withFileTypes:true}).filter(x=>x.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name)))
   for(const file of fs.readdirSync(path.join(this.root,category.name)).filter(x=>x.endsWith('.js')).sort()){const fp=path.join(this.root,category.name,file);try{delete require.cache[require.resolve(fp)];const ex=require(fp);for(const raw of(Array.isArray(ex)?ex:[ex]))this.add({...raw,category:raw.category||category.name,source:`${category.name}/${file}`})}catch(error){this.errors.push({file:fp,error:error.message})}}
  return this.commands.length}
 add(cmd){if(!cmd?.name||typeof cmd.execute!=='function')throw Error('Command needs name and execute()');const n={...cmd,name:String(cmd.name).toLowerCase().replace(/[^a-z0-9-]/g,'-'),alias:(cmd.alias||[]).map(x=>String(x).toLowerCase()),category:cmd.category||'General',usage:cmd.usage||`.${cmd.name}`,desc:cmd.desc||`${cmd.name} command`};
  if(this.byKey.has(n.name))throw Error(`Duplicate command: ${n.name}`);this.byKey.set(n.name,n);this.commands.push(n);
  for(const a of n.alias){if(this.byKey.has(a))throw Error(`Duplicate command alias: ${a}`);this.byKey.set(a,n)}
 }
 resolve(name){return this.byKey.get(String(name||'').toLowerCase())}
 help(category,page=1,size=30){const items=this.commands.filter(c=>!category||c.category.toLowerCase()===category.toLowerCase()),start=Math.max(0,(Number(page)-1)*size);return items.slice(start,start+size).map(c=>`• ${c.usage} — ${c.desc}`).join('\n')||'No commands found.'}
 categories(){return [...new Set(this.commands.map(c=>c.category))].sort()}
}
module.exports={CommandRegistry};
