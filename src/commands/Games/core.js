module.exports=[
{
 name:'quiz',category:'Games',desc:'Rich HTML quiz challenge',usage:'.quiz [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('quiz',sock,m,ctx.args)
},
{
 name:'sciencequiz',category:'Games',desc:'Rich HTML sciencequiz challenge',usage:'.sciencequiz [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('sciencequiz',sock,m,ctx.args)
},
{
 name:'math',category:'Games',desc:'Rich HTML math challenge',usage:'.math [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('math',sock,m,ctx.args)
},
{
 name:'word',category:'Games',desc:'Rich HTML word challenge',usage:'.word [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('word',sock,m,ctx.args)
},
{
 name:'typing',category:'Games',desc:'Rich HTML typing challenge',usage:'.typing [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('typing',sock,m,ctx.args)
},
{
 name:'reaction',category:'Games',desc:'Rich HTML reaction challenge',usage:'.reaction [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('reaction',sock,m,ctx.args)
},
{
 name:'number',category:'Games',desc:'Rich HTML number challenge',usage:'.number [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('number',sock,m,ctx.args)
},
{
 name:'rps',category:'Games',desc:'Rich HTML rps challenge',usage:'.rps [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('rps',sock,m,ctx.args)
},
{
 name:'hangman',category:'Games',desc:'Rich HTML hangman challenge',usage:'.hangman [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('hangman',sock,m,ctx.args)
},
{
 name:'memory',category:'Games',desc:'Rich HTML memory challenge',usage:'.memory [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('memory',sock,m,ctx.args)
},
{
 name:'trivia',category:'Games',desc:'Rich HTML trivia challenge',usage:'.trivia [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('trivia',sock,m,ctx.args)
},
{
 name:'capital',category:'Games',desc:'Rich HTML capital challenge',usage:'.capital [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('capital',sock,m,ctx.args)
},
{
 name:'elementgame',category:'Games',desc:'Rich HTML elementgame challenge',usage:'.elementgame [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('elementgame',sock,m,ctx.args)
},
{
 name:'anagram',category:'Games',desc:'Rich HTML anagram challenge',usage:'.anagram [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('anagram',sock,m,ctx.args)
},
{
 name:'oddone',category:'Games',desc:'Rich HTML oddone challenge',usage:'.oddone [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('oddone',sock,m,ctx.args)
},
{
 name:'sequence',category:'Games',desc:'Rich HTML sequence challenge',usage:'.sequence [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('sequence',sock,m,ctx.args)
},
{
 name:'truefalse',category:'Games',desc:'Rich HTML truefalse challenge',usage:'.truefalse [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('truefalse',sock,m,ctx.args)
},
{
 name:'equationgame',category:'Games',desc:'Rich HTML equationgame challenge',usage:'.equationgame [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('equationgame',sock,m,ctx.args)
},
{
 name:'fractiongame',category:'Games',desc:'Rich HTML fractiongame challenge',usage:'.fractiongame [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('fractiongame',sock,m,ctx.args)
},
{
 name:'percentgame',category:'Games',desc:'Rich HTML percentgame challenge',usage:'.percentgame [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('percentgame',sock,m,ctx.args)
},
{
 name:'speedmath',category:'Games',desc:'Rich HTML speedmath challenge',usage:'.speedmath [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('speedmath',sock,m,ctx.args)
},
{
 name:'vocab',category:'Games',desc:'Rich HTML vocab challenge',usage:'.vocab [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('vocab',sock,m,ctx.args)
},
{
 name:'spelling',category:'Games',desc:'Rich HTML spelling challenge',usage:'.spelling [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('spelling',sock,m,ctx.args)
},
{
 name:'synonym',category:'Games',desc:'Rich HTML synonym challenge',usage:'.synonym [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('synonym',sock,m,ctx.args)
},
{
 name:'antonym',category:'Games',desc:'Rich HTML antonym challenge',usage:'.antonym [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('antonym',sock,m,ctx.args)
},
{
 name:'pattern',category:'Games',desc:'Rich HTML pattern challenge',usage:'.pattern [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('pattern',sock,m,ctx.args)
},
{
 name:'logic',category:'Games',desc:'Rich HTML logic challenge',usage:'.logic [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('logic',sock,m,ctx.args)
},
{
 name:'riddle',category:'Games',desc:'Rich HTML riddle challenge',usage:'.riddle [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('riddle',sock,m,ctx.args)
},
{
 name:'geographygame',category:'Games',desc:'Rich HTML geography challenge',usage:'.geographygame [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('geographygame',sock,m,ctx.args)
},
{
 name:'biology',category:'Games',desc:'Rich HTML biology challenge',usage:'.biology [answer]',
 execute:async(sock,m,ctx)=>require('../../core/gameEngine').play('biology',sock,m,ctx.args)
}
];
