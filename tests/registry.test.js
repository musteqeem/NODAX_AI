const test=require('node:test');
const assert=require('node:assert/strict');
const {CommandRegistry}=require('../src/core/commandRegistry');

test('NODAX VPRO loads exactly 500 commands with no module errors',()=>{
 const r=new CommandRegistry();const count=r.load();
 assert.equal(count,500,`loaded ${count}`);
 assert.equal(r.errors.length,0,JSON.stringify(r.errors));
 assert.equal(r.commands.filter(x=>x.category==='Defense').length,20);
 assert.equal(r.commands.filter(x=>x.category==='Science').length,20);
 assert.ok(r.commands.filter(x=>x.category==='Games').length>=100);
});

test('all commands follow the contract',()=>{
 const r=new CommandRegistry();r.load();
 for(const c of r.commands){
  assert.match(c.name,/^[a-z0-9][a-z0-9-]*$/);
  assert.ok(Array.isArray(c.alias));
  assert.ok(c.category&&c.desc&&c.usage);
  assert.equal(typeof c.execute,'function');
 }
});

test('critical permissions are present',()=>{
 const r=new CommandRegistry();r.load();
 for(const name of ['antilink','antiinvite','antiflood','antiscam','antiphishing'])assert.equal(r.resolve(name).adminOnly,true);
 for(const name of ['reload','setvar','setbotname','setnewsletter'])assert.equal(r.resolve(name).ownerOnly,true);
 assert.equal(r.resolve('promote').botAdmin,true);
});

test('rich game commands are registered',()=>{
 const r=new CommandRegistry();r.load();
 for(const name of ['snake','chess','tictactoe','memory','2048','checkers','sudoku','wordsearch'])assert.equal(r.resolve(name).category,'Games');
});

test('duplicate aliases/names cannot silently overwrite',()=>{
 const r=new CommandRegistry();
 r.add({name:'x',execute:async()=>{}});assert.throws(()=>r.add({name:'x',execute:async()=>{}}),/Duplicate command/);
});
