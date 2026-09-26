const {inputText}=require('../../core/helpers');
const {richReply,cardHtml,tableHtml}=require('../../core/richHtml');
const E={h:['Hydrogen',1.008],he:['Helium',4.003],c:['Carbon',12.011],n:['Nitrogen',14.007],o:['Oxygen',15.999],na:['Sodium',22.990],cl:['Chlorine',35.45],fe:['Iron',55.845],ca:['Calcium',40.078],cu:['Copper',63.546],mg:['Magnesium',24.305],s:['Sulfur',32.06],k:['Potassium',39.098]};
const formulas={ohm:'V = IR',newton:'F = ma',kinetic:'KE = ½mv²',momentum:'p = mv',density:'ρ = m/V',power:'P = W/t',wave:'v = fλ',ideal:'PV = nRT'};
const qs=[
 ['physicsquiz','Physics','Which quantity is measured in newtons?','force'],['chemquiz','Chemistry','What is the chemical symbol for sodium?','na'],
 ['biologyquiz','Biology','Which organelle is the main site of aerobic respiration?','mitochondrion'],['mathquiz','Mathematics','What is 12 × 8?','96'],
 ['astronomyquiz','Astronomy','Which star is at the centre of our solar system?','sun'],['earthquiz','Earth Science','What layer lies beneath Earth’s crust?','mantle'],
 ['geneticsquiz','Genetics','What molecule carries genetic information?','dna'],['ecologyquiz','Ecology','What are organisms that make their own food called?','producers'],
 ['anatomyquiz','Anatomy','What organ pumps blood around the body?','heart'],['spacequiz','Space','Which planet has the largest diameter?','jupiter']
];
const quiz=Object.fromEntries(qs.map(([n,s,q,a])=>[n,async({reply})=>reply(`🧠 ${s}\n\n${q}\n\nAnswer: ${a}`)]));
function cmd(name,execute,desc=`${name} science tool`){return {name,category:'Science',desc,usage:`.${name}`,execute}}
const out=qs.map(([n])=>cmd(n,quiz[n],'Dedicated science revision question'));
out.push(
cmd('element',async({args,m,reply})=>{const e=E[String(args[0]||'').toLowerCase()];if(!e)return reply(`Available: ${Object.keys(E).join(', ')}`);return richReply(m,cardHtml(`⚛️ ${String(args[0]).toUpperCase()}`,e[0],`Atomic mass: ${e[1]} u`),{fallback:`${e[0]} • ${e[1]} u`})}),
cmd('formula',async({args,reply})=>reply(formulas[String(args[0]||'').toLowerCase()]||Object.entries(formulas).map(([k,v])=>`${k}: ${v}`).join('\n'))),
cmd('molar',async({args,reply})=>{const x=inputText(args).replace(/\s+/g,'');if(!x)return reply('Use .molar H2O');let t=0;for(const m of x.matchAll(/([A-Z][a-z]?)(\d*)/g)){const e=E[m[1].toLowerCase()];if(!e)return reply(`Unknown element: ${m[1]}`);t+=e[1]*(Number(m[2])||1)}return reply(`${x} ≈ ${t.toFixed(3)} g/mol`)}),
cmd('unitconvert',async({args,reply})=>{const n=Number(args[0]),a=String(args[1]||'').toLowerCase(),b=String(args[2]||'').toLowerCase(),map={cm:{m:x=>x/100},m:{cm:x=>x*100,km:x=>x/1000},km:{m:x=>x*1000},g:{kg:x=>x/1000},kg:{g:x=>x*1000},c:{k:x=>x+273.15},k:{c:x=>x-273.15}};if(!Number.isFinite(n)||!map[a]?.[b])return reply('Use .unitconvert 100 cm m');return reply(`${n} ${a} = ${map[a][b](n)} ${b}`)}),
cmd('equation',async({args,reply})=>{const a=+args[0],b=+args[1],c=+args[2];if(!Number.isFinite(a)||!Number.isFinite(b)||!Number.isFinite(c)||a===0)return reply('Use .equation 2 4 10');return reply(`x = ${(c-b)/a}`)}),
cmd('physicsformula',async({reply})=>reply(Object.entries(formulas).map(([k,v])=>`${k}: ${v}`).join('\n'))),
cmd('scientific',async({reply})=>reply(['Ice is less dense than liquid water.','Sound needs a medium to travel.','Jupiter is the largest planet in our Solar System.','ATP transfers chemical energy in cells.'][Math.floor(Math.random()*4)])),
cmd('sciencehelp',async({reply})=>reply('📘 Active recall + spaced repetition + worked examples + error review.')),
cmd('periodic',async({m,reply})=>richReply(m,tableHtml('Periodic Quick Reference',['Symbol','Element','Mass'],Object.entries(E).map(([k,v])=>[k.toUpperCase(),v[0],String(v[1])])),{fallback:Object.entries(E).map(([k,v])=>`${k}: ${v[0]} ${v[1]}`).join('\n')}))
);
module.exports=out;
