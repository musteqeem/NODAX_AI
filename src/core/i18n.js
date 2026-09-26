const locales={
 NG:{country:'Nigeria',lang:'English',code:'en',prefix:'₦'},US:{country:'United States',lang:'English',code:'en',prefix:'$'},
 GB:{country:'United Kingdom',lang:'English',code:'en',prefix:'£'},CA:{country:'Canada',lang:'English',code:'en',prefix:'$'},
 AU:{country:'Australia',lang:'English',code:'en',prefix:'$'},GH:{country:'Ghana',lang:'English',code:'en',prefix:'₵'},
 KE:{country:'Kenya',lang:'English',code:'en',prefix:'KSh'},ZA:{country:'South Africa',lang:'English',code:'en',prefix:'R'},
 FR:{country:'France',lang:'French',code:'fr',prefix:'€'},DE:{country:'Germany',lang:'German',code:'de',prefix:'€'},
 ES:{country:'Spain',lang:'Spanish',code:'es',prefix:'€'},IT:{country:'Italy',lang:'Italian',code:'it',prefix:'€'},
 PT:{country:'Portugal',lang:'Portuguese',code:'pt',prefix:'€'},BR:{country:'Brazil',lang:'Portuguese',code:'pt',prefix:'R$'},
 MX:{country:'Mexico',lang:'Spanish',code:'es',prefix:'$'},AR:{country:'Argentina',lang:'Spanish',code:'es',prefix:'$'},
 IN:{country:'India',lang:'Hindi',code:'hi',prefix:'₹'},PK:{country:'Pakistan',lang:'Urdu',code:'ur',prefix:'₨'},
 BD:{country:'Bangladesh',lang:'Bengali',code:'bn',prefix:'৳'},ID:{country:'Indonesia',lang:'Indonesian',code:'id',prefix:'Rp'},
 MY:{country:'Malaysia',lang:'Malay',code:'ms',prefix:'RM'},TR:{country:'Türkiye',lang:'Turkish',code:'tr',prefix:'₺'},
 SA:{country:'Saudi Arabia',lang:'Arabic',code:'ar',prefix:'﷼'},AE:{country:'United Arab Emirates',lang:'Arabic',code:'ar',prefix:'د.إ'},
 EG:{country:'Egypt',lang:'Arabic',code:'ar',prefix:'E£'},JP:{country:'Japan',lang:'Japanese',code:'ja',prefix:'¥'},
 KR:{country:'South Korea',lang:'Korean',code:'ko',prefix:'₩'},CN:{country:'China',lang:'Chinese',code:'zh',prefix:'¥'},
 RU:{country:'Russia',lang:'Russian',code:'ru',prefix:'₽'}
};
const words={
 en:{hello:'Hello',help:'Help',ready:'Ready',error:'Error',commands:'Commands',score:'Score',status:'Status'},
 fr:{hello:'Bonjour',help:'Aide',ready:'Prêt',error:'Erreur',commands:'Commandes',score:'Score',status:'Statut'},
 de:{hello:'Hallo',help:'Hilfe',ready:'Bereit',error:'Fehler',commands:'Befehle',score:'Punktestand',status:'Status'},
 es:{hello:'Hola',help:'Ayuda',ready:'Listo',error:'Error',commands:'Comandos',score:'Puntuación',status:'Estado'},
 it:{hello:'Ciao',help:'Aiuto',ready:'Pronto',error:'Errore',commands:'Comandi',score:'Punteggio',status:'Stato'},
 pt:{hello:'Olá',help:'Ajuda',ready:'Pronto',error:'Erro',commands:'Comandos',score:'Pontuação',status:'Estado'},
 hi:{hello:'नमस्ते',help:'मदद',ready:'तैयार',error:'त्रुटि',commands:'कमांड',score:'स्कोर',status:'स्थिति'},
 ur:{hello:'سلام',help:'مدد',ready:'تیار',error:'خرابی',commands:'کمانڈز',score:'اسکور',status:'حالت'},
 bn:{hello:'হ্যালো',help:'সহায়তা',ready:'প্রস্তুত',error:'ত্রুটি',commands:'কমান্ড',score:'স্কোর',status:'অবস্থা'},
 id:{hello:'Halo',help:'Bantuan',ready:'Siap',error:'Kesalahan',commands:'Perintah',score:'Skor',status:'Status'},
 ms:{hello:'Helo',help:'Bantuan',ready:'Sedia',error:'Ralat',commands:'Arahan',score:'Skor',status:'Status'},
 tr:{hello:'Merhaba',help:'Yardım',ready:'Hazır',error:'Hata',commands:'Komutlar',score:'Skor',status:'Durum'},
 ar:{hello:'مرحباً',help:'مساعدة',ready:'جاهز',error:'خطأ',commands:'الأوامر',score:'النقاط',status:'الحالة'},
 ja:{hello:'こんにちは',help:'ヘルプ',ready:'準備完了',error:'エラー',commands:'コマンド',score:'スコア',status:'状態'},
 ko:{hello:'안녕하세요',help:'도움말',ready:'준비됨',error:'오류',commands:'명령어',score:'점수',status:'상태'},
 zh:{hello:'你好',help:'帮助',ready:'就绪',error:'错误',commands:'命令',score:'分数',status:'状态'},
 ru:{hello:'Привет',help:'Помощь',ready:'Готово',error:'Ошибка',commands:'Команды',score:'Счёт',status:'Статус'}
};
function locale(country='NG'){return locales[String(country).toUpperCase()]||locales.NG}
function t(country,key,fallback=key){const l=locale(country);return words[l.code]?.[key]||words.en[key]||fallback}
module.exports={locales,locale,t,countries:Object.keys(locales)};
