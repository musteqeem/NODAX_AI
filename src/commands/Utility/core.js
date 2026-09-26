const {factory,handlers}=require('../../core/catalog');
const names=['ping','uptime','time','date','serverinfo','hash','echo','upper','lower','reverse','length','base64','unbase64','choose','help','categories','commands','botinfo','status','uuid','timestamp','binary','hex','urlencode','urldecode','slug','trim','dedupe','count','repeat','palindrome','average','min','max','sum','sqrt','power','factorial','prime','fibonacci','countrylist','lang'];
module.exports=factory('Utility',names,{});
