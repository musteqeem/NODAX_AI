const {gameHtml,richReply}=require('./richHtml');
const store=new Map();
const WORDS=['atom','planet','oxygen','gravity','neutron','electron','galaxy','mitosis','energy','vector','enzyme','orbit'];
const questions=[
 ['Physics','What force attracts masses?','gravity'],['Chemistry','What is H2O?','water'],['Biology','What carries genetic information?','dna'],
 ['Astronomy','What star is at the centre of our solar system?','sun'],['Math','What is 12 × 8?','96'],['Earth','What layer is below the crust?','mantle']
];
const norm=x=>String(x||'').toLowerCase().trim();
function key(m,name){return `${m.chat}:${m.sender}:${name}`}
function get(m,name){const k=key(m,name);let s=store.get(k);if(!s){s={score:0,round:0,word:null,question:null,created:Date.now()};store.set(k,s)}return s}
function challenge(name,m){
 const s=get(m,name);
 if(name==='quiz'||name==='sciencequiz'){s.question=questions[Math.floor(Math.random()*questions.length)];s.round++;return {s,question:s.question[1],answer:s.question[2]}}
 if(name==='word'||name==='hangman'){s.word=WORDS[Math.floor(Math.random()*WORDS.length)];s.round++;return {s,question:'Guess the hidden science word.',answer:s.word}}
 if(name==='number'){s.target=1+Math.floor(Math.random()*20);s.round++;return {s,question:'Guess a number from 1–20.',answer:s.target}}
 return {s};
}
async function play(name,sock,m,args){
 const s=get(m,name),guess=norm(args.join(' '));
 if(!guess){const c=challenge(name,m);return richReply(sock,m,gameHtml(name,c.question||'Choose an action.',[['Round',s.round],['Score',s.score],['How to play',`.${name} <answer>`]]),{fallback:`🎮 ${name}: ${c.question||'Use the command with an answer.'}`})}
 let answer=s.answer;
 if(name==='rps'){const bot=['rock','paper','scissors'][Math.floor(Math.random()*3)],win=(guess==='rock'&&bot==='scissors')||(guess==='paper'&&bot==='rock')||(guess==='scissors'&&bot==='paper');if(guess===bot)s.score+=1;else if(win)s.score+=2;return richReply(sock,m,gameHtml('Rock Paper Scissors',`You: ${guess}\nBot: ${bot}`,[['Score',s.score],['Result',guess===bot?'DRAW':win?'WIN':'TRY AGAIN']]),{fallback:`You: ${guess} | Bot: ${bot}`})}
 if(name==='math'){const a=2+Math.floor(Math.random()*18),b=2+Math.floor(Math.random()*18);answer=String(a*b);s.question=`What is ${a} × ${b}?`;if(!guess){s.answer=answer;return richReply(sock,m,gameHtml('Math Rush',s.question,[['Score',s.score],['Answer format','.math <number>']]),{fallback:s.question})}}
 const ok=guess===norm(answer);
 if(ok)s.score+=10;
 s.round++;
 const next=challenge(name,m);
 return richReply(sock,m,gameHtml(name,ok?'✅ Correct!':'❌ Not this time.',[['Score',s.score],['Round',s.round],['Next',next.question||'Use the command again']]),{fallback:`${ok?'✅ Correct':'❌ Incorrect'} • Score ${s.score}`});
}
module.exports={play};
