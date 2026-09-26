const fs=require('node:fs'),path=require('node:path'),pkg=require('../package.json');
const {CommandRegistry}=require('../src/core/commandRegistry');
const root=path.resolve(__dirname,'..'),r=new CommandRegistry(),n=r.load();
const exists=name=>fs.existsSync(path.join(root,name));
const checks=[
 ['Node >=20',Number(process.versions.node.split('.')[0])>=20],
 ['manifest',exists('package.json')],
 ['Baileys dependency',Boolean(pkg.dependencies['@musteqeem/baileys'])],
 ['exactly 500 commands',n===500],
 ['exactly 20 defense commands',r.commands.filter(x=>x.category==='Defense').length===20],
 ['exactly 20 science commands',r.commands.filter(x=>x.category==='Science').length===20],
 ['loader errors absent',r.errors.length===0],
 ['Koyeb manifest',exists('koyeb.yaml')],
 ['DigitalOcean app spec',exists('.do/app.yaml')],
 ['Cloud Run guide',exists('deploy/cloud-run.md')],
 ['Northflank guide',exists('deploy/northflank.md')],
 ['Zeabur guide',exists('deploy/zeabur.md')],
 ['AWS App Runner guide',exists('deploy/app-runner.md')],
 ['Dockerfile',exists('Dockerfile')],
 ['Health endpoint in index',fs.readFileSync(path.join(root,'index.js'),'utf8').includes("app.get('/health'")]
];
for(const [name,ok] of checks)console.log(`${ok?'OK ':'ERR'} ${name}`);
process.exitCode=checks.some(x=>!x[1])?1:0;
