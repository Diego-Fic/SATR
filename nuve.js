/*
*/
/*
 MIT
*/
var Url=require("url"),spawn=require("child_process").spawn,fs=require("fs"),XMLHttpRequest=function(){var b=this,t=require("http"),u=require("https"),h={},n,c,d={},r={"User-Agent":"node.js",Accept:"*/*"},k=!1,p=!1,q=r;this.UNSENT=0;this.OPENED=1;this.HEADERS_RECEIVED=2;this.LOADING=3;this.DONE=4;this.readyState=this.UNSENT;this.onreadystatechange=null;this.responseXML=this.responseText="";this.statusText=this.status=null;var l=function(a){b.readyState=a;if("function"===typeof b.onreadystatechange)b.onreadystatechange();
if("readystatechange"in h){a=h.readystatechange.length;for(var f=0;f<a;f++)h.readystatechange[f].call(b)}};this.open=function(a,b,e,c,g){d={method:a,url:b.toString(),async:"boolean"!==typeof e?!0:e,user:c||null,password:g||null};this.abort();l(this.OPENED)};this.setRequestHeader=function(a,b){if(this.readyState!==this.OPENED)throw"NVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN";if(k)throw"INVALID_STATE_ERR: send flag is true";q[a]=b};this.getResponseHeader=function(a){return this.readyState>
this.OPENED&&c.headers[a]&&!p?c.headers[a]:null};this.getAllResponseHeaders=function(){if(this.readyState<this.HEADERS_RECEIVED||p)return"";var a="",b;for(b in c.headers)a+=b+": "+c.headers[b]+"\r\n";return a.substr(0,a.length-2)};this.send=function(a){if(this.readyState!==this.OPENED)throw"INVALID_STATE_ERR: connection must be opened before send() is called";if(k)throw"INVALID_STATE_ERR: send has already been called";var f=!1,e=Url.parse(d.url),m;switch(e.protocol){case "https:":f=!0;case "http:":m=
e.hostname;break;case void 0:case "":m="localhost";break;default:throw"Protocol not supported.";}var g=e.port||(f?443:80),e=e.pathname+(e.search?e.search:"");this.setRequestHeader("Host",m);if(d.user){"undefined"===typeof d.password&&(d.password="");var h=new Buffer(d.user+":"+d.password);q.Authorization="Basic "+h.toString("base64")}"GET"===d.method||"HEAD"===d.method?a=null:a&&(this.setRequestHeader("Content-Length",Buffer.byteLength(a)),q["Content-Type"]||this.setRequestHeader("Content-Type","text/plain;charset\x3dUTF-8"));
m={host:m,port:g,path:e,method:d.method,headers:q};p=!1;if(!d.hasOwnProperty("async")||d.async){f=f?u.request:t.request;k=!0;if("function"===typeof b.onreadystatechange)b.onreadystatechange();n=f(m,function(a){c=a;c.setEncoding("utf8");l(b.HEADERS_RECEIVED);b.status=c.statusCode;c.on("data",function(a){a&&(b.responseText+=a);k&&l(b.LOADING)});c.on("end",function(){k&&(l(b.DONE),k=!1)});c.on("error",function(a){b.handleError(a)})}).on("error",function(a){b.handleError(a)});a&&n.write(a);n.end()}else{g=
".node-xmlhttprequest-sync-"+process.pid;fs.writeFileSync(g,"","utf8");a="var http \x3d require('http'), https \x3d require('https'), fs \x3d require('fs');var doRequest \x3d http"+(f?"s":"")+".request;var options \x3d "+JSON.stringify(m)+";var responseText \x3d '';var req \x3d doRequest(options, function(response) {response.setEncoding('utf8');response.on('data', function(chunk) {responseText +\x3d chunk;});response.on('end', function() {fs.writeFileSync('"+g+"', 'NODE-XMLHTTPREQUEST-STATUS:' + response.statusCode + ',' + responseText, 'utf8');});response.on('error', function(error) {fs.writeFileSync('"+
g+"', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');});}).on('error', function(error) {fs.writeFileSync('"+g+"', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');});"+(a?"req.write('"+a.replace(/'/g,"\\'")+"');":"")+"req.end();";for(syncProc=spawn(process.argv[0],["-e",a]);""==(b.responseText=fs.readFileSync(g,"utf8")););syncProc.stdin.end();fs.unlinkSync(g);b.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)?(a=b.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/,""),
b.handleError(a)):(b.status=b.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/,"$1"),b.responseText=b.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/,"$1"),l(b.DONE))}};this.handleError=function(a){this.status=503;this.statusText=a;this.responseText=a.stack;p=!0;l(this.DONE)};this.abort=function(){n&&(n.abort(),n=null);q=r;this.responseXML=this.responseText="";p=!0;this.readyState===this.UNSENT||this.readyState===this.OPENED&&!k||this.readyState===this.DONE||(k=!1,l(this.DONE));
this.readyState=this.UNSENT};this.addEventListener=function(a,b){a in h||(h[a]=[]);h[a].push(b)}};
var CryptoJS=CryptoJS||function(c,g){var m={},l=m.lib={},b=l.Base=function(){function e(){}return{extend:function(t){e.prototype=this;var a=new e;t&&a.mixIn(t);a.$super=this;return a},create:function(){var e=this.extend();e.init.apply(e,arguments);return e},init:function(){},mixIn:function(e){for(var a in e)e.hasOwnProperty(a)&&(this[a]=e[a]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.$super.extend(this)}}}(),h=l.WordArray=b.extend({init:function(e,a){e=
this.words=e||[];this.sigBytes=a!=g?a:4*e.length},toString:function(e){return(e||d).stringify(this)},concat:function(e){var a=this.words,b=e.words,d=this.sigBytes;e=e.sigBytes;this.clamp();if(d%4)for(var h=0;h<e;h++)a[d+h>>>2]|=(b[h>>>2]>>>24-h%4*8&255)<<24-(d+h)%4*8;else if(65535<b.length)for(h=0;h<e;h+=4)a[d+h>>>2]=b[h>>>2];else a.push.apply(a,b);this.sigBytes+=e;return this},clamp:function(){var e=this.words,a=this.sigBytes;e[a>>>2]&=4294967295<<32-a%4*8;e.length=c.ceil(a/4)},clone:function(){var e=
b.clone.call(this);e.words=this.words.slice(0);return e},random:function(e){for(var a=[],b=0;b<e;b+=4)a.push(4294967296*c.random()|0);return h.create(a,e)}}),f=m.enc={},d=f.Hex={stringify:function(e){var a=e.words;e=e.sigBytes;for(var h=[],b=0;b<e;b++){var d=a[b>>>2]>>>24-b%4*8&255;h.push((d>>>4).toString(16));h.push((d&15).toString(16))}return h.join("")},parse:function(e){for(var a=e.length,b=[],d=0;d<a;d+=2)b[d>>>3]|=parseInt(e.substr(d,2),16)<<24-d%8*4;return h.create(b,a/2)}},k=f.Latin1={stringify:function(a){var e=
a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(e[d>>>2]>>>24-d%4*8&255));return b.join("")},parse:function(a){for(var e=a.length,b=[],d=0;d<e;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-d%4*8;return h.create(b,e)}},a=f.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(t){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},n=l.BufferedBlockAlgorithm=b.extend({reset:function(){this._data=
h.create();this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=a.parse(e));this._data.concat(e);this._nDataBytes+=e.sigBytes},_process:function(a){var d=this._data,e=d.words,b=d.sigBytes,f=this.blockSize,n=b/(4*f),n=a?c.ceil(n):c.max((n|0)-this._minBufferSize,0);a=n*f;b=c.min(4*a,b);if(a){for(var k=0;k<a;k+=f)this._doProcessBlock(e,k);k=e.splice(0,a);d.sigBytes-=b}return h.create(k,b)},clone:function(){var a=b.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=
n.extend({init:function(){this.reset()},reset:function(){n.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=n.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(d,b){return a.create(b).finalize(d)}},_createHmacHelper:function(a){return function(d,b){return r.HMAC.create(a,b).finalize(d)}}});var r=
m.algo={};return m}(Math);
(function(){var c=CryptoJS,g=c.lib,m=g.WordArray,g=g.Hasher,l=[],b=c.algo.SHA1=g.extend({_doReset:function(){this._hash=m.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(b,f){for(var d=this._hash.words,h=d[0],a=d[1],n=d[2],m=d[3],e=d[4],c=0;80>c;c++){if(16>c)l[c]=b[f+c]|0;else{var g=l[c-3]^l[c-8]^l[c-14]^l[c-16];l[c]=g<<1|g>>>31}g=(h<<5|h>>>27)+e+l[c];g=20>c?g+((a&n|~a&m)+1518500249):40>c?g+((a^n^m)+1859775393):60>c?g+((a&n|a&m|n&m)-1894007588):g+((a^n^m)-
899497514);e=m;m=n;n=a<<30|a>>>2;a=h;h=g}d[0]=d[0]+h|0;d[1]=d[1]+a|0;d[2]=d[2]+n|0;d[3]=d[3]+m|0;d[4]=d[4]+e|0},_doFinalize:function(){var b=this._data,f=b.words,d=8*this._nDataBytes,c=8*b.sigBytes;f[c>>>5]|=128<<24-c%32;f[(c+64>>>9<<4)+15]=d;b.sigBytes=4*f.length;this._process()}});c.SHA1=g._createHelper(b);c.HmacSHA1=g._createHmacHelper(b)})();
(function(){var c=CryptoJS,g=c.enc.Utf8;c.algo.HMAC=c.lib.Base.extend({init:function(c,l){c=this._hasher=c.create();"string"==typeof l&&(l=g.parse(l));var b=c.blockSize,h=4*b;l.sigBytes>h&&(l=c.finalize(l));c=this._oKey=l.clone();l=this._iKey=l.clone();for(var f=c.words,d=l.words,k=0;k<b;k++)f[k]^=1549556828,d[k]^=909522486;c.sigBytes=l.sigBytes=h;this.reset()},reset:function(){var c=this._hasher;c.reset();c.update(this._iKey)},update:function(c){this._hasher.update(c);return this},finalize:function(c){var g=
this._hasher;c=g.finalize(c);g.reset();return g.finalize(this._oKey.clone().concat(c))}})})();var N=N||{};N.authors=["aalonsog@dit.upm.es","prodriguez@dit.upm.es","jcervino@dit.upm.es"];N.version=.1;N=N||{};
N.Base64=function(){var c,g,m,l,b,h,f,d,k;c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");g=[];for(b=0;b<c.length;b+=1)g[c[b]]=b;h=function(a){m=a;l=0};f=function(){var a;if(!m||l>=m.length)return-1;a=m.charCodeAt(l)&255;l+=1;return a};d=function(){if(!m)return-1;for(;;){if(l>=m.length)return-1;var a=m.charAt(l);l+=1;if(g[a])return g[a];if("A"===a)return 0}};k=function(a){a=a.toString(16);1===a.length&&(a="0"+a);return unescape("%"+a)};return{encodeBase64:function(a){var b,d,
e;h(a);a="";b=Array(3);d=0;for(e=!1;!e&&-1!==(b[0]=f());)b[1]=f(),b[2]=f(),a+=c[b[0]>>2],-1!==b[1]?(a+=c[b[0]<<4&48|b[1]>>4],-1!==b[2]?(a+=c[b[1]<<2&60|b[2]>>6],a+=c[b[2]&63]):(a+=c[b[1]<<2&60],a+="\x3d",e=!0)):(a+=c[b[0]<<4&48],a+="\x3d",a+="\x3d",e=!0),d+=4,76<=d&&(a+="\n",d=0);return a},decodeBase64:function(a){var b,c;h(a);a="";b=Array(4);for(c=!1;!c&&-1!==(b[0]=d())&&-1!==(b[1]=d());)b[2]=d(),b[3]=d(),a+=k(b[0]<<2&255|b[1]>>4),-1!==b[2]?(a+=k(b[1]<<4&255|b[2]>>2),-1!==b[3]?a+=k(b[2]<<6&255|b[3]):
c=!0):c=!0;return a}}}(N);N=N||{};
N.API=function(c){var g,m,l;g=function(b,h,f,d,g,a,n,r){var e,k,u,v,q,p;void 0===a?(e=c.API.params.service,k=c.API.params.key,g=c.API.params.url+g):(e=a.service,k=a.key,g=a.url+g);""===e||""===k?console.log("ServiceID and Key are required!!"):(a=(new Date).getTime(),u=Math.floor(99999*Math.random()),v=a+","+u,q="MAuth realm\x3dhttp://marte3.dit.upm.es,mauth_signature_method\x3dHMAC_SHA1",n&&r&&(n=l(n),q=q+",mauth_username\x3d"+n+",mauth_role\x3d"+r,v+=","+n+","+r),n=m(v,k),q+=",mauth_serviceid\x3d",q+=
e,q+=",mauth_cnonce\x3d",q+=u,q+=",mauth_timestamp\x3d",q+=a,q+=",mauth_signature\x3d",q+=n,p=new XMLHttpRequest,p.onreadystatechange=function(){if(4===p.readyState)switch(p.status){case 100:case 200:case 201:case 202:case 203:case 204:case 205:b(p.responseText);break;default:void 0!==h&&h(p.status+" Error"+p.responseText,p.status)}},p.open(f,g,!0),p.setRequestHeader("Authorization",q),void 0!==d?(p.setRequestHeader("Content-Type","application/json"),p.send(JSON.stringify(d))):p.send())};m=function(b,
h){b=CryptoJS.HmacSHA1(b,h).toString(CryptoJS.enc.Hex);return c.Base64.encodeBase64(b)};l=function(b){b=b.toLowerCase();var c={a:"[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]",ae:"\u00e6",c:"\u00e7",e:"[\u00e8\u00e9\u00ea\u00eb]",i:"[\u00ec\u00ed\u00ee\u00ef]",n:"\u00f1",o:"[\u00f2\u00f3\u00f4\u00f5\u00f6]",oe:"\u0153",u:"[\u00f9\u00fa\u00fb\u0171\u00fc]",y:"[\u00fd\u00ff]"},f;for(f in c)b=b.replace(new RegExp(c[f],"g"),f);return b};return{params:{service:void 0,key:void 0,url:void 0},init:function(b,h,
f){c.API.params.service=b;c.API.params.key=h;c.API.params.url=f},createRoom:function(b,c,f,d,k){d||(d={});g(function(a){a=JSON.parse(a);c(a)},f,"POST",{name:b,options:d},"rooms",k)},getRooms:function(b,c,f){g(b,c,"GET",void 0,"rooms",f)},getRoom:function(b,c,f,d){g(c,f,"GET",void 0,"rooms/"+b,d)},updateRoom:function(b,c,f,d,k,a){g(f,d,"PUT",{name:c,options:k},"rooms/"+b,a)},patchRoom:function(b,c,f,d,k,a){g(f,d,"PATCH",{name:c,options:k},"rooms/"+b,a)},deleteRoom:function(b,c,f,d){g(c,f,"DELETE",
void 0,"rooms/"+b,d)},createToken:function(b,c,f,d,k,a){g(d,k,"POST",void 0,"rooms/"+b+"/tokens",a,c,f)},createService:function(b,c,f,d,k){g(f,d,"POST",{name:b,key:c},"services/",k)},getServices:function(b,c,f){g(b,c,"GET",void 0,"services/",f)},getService:function(b,c,f,d){g(c,f,"GET",void 0,"services/"+b,d)},deleteService:function(b,c,f,d){g(c,f,"DELETE",void 0,"services/"+b,d)},getUsers:function(b,c,f,d){g(c,f,"GET",void 0,"rooms/"+b+"/users/",d)},getUser:function(b,c,f,d,k){g(f,d,"GET",void 0,
"rooms/"+b+"/users/"+c,k)},deleteUser:function(b,c,f,d,k){g(f,d,"DELETE",void 0,"rooms/"+b+"/users/"+c,k)}}}(N);
module.exports = N;