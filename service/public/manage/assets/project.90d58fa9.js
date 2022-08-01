var Re=Object.defineProperty;var te=Object.getOwnPropertySymbols;var Ne=Object.prototype.hasOwnProperty,$e=Object.prototype.propertyIsEnumerable;var re=(t,e,r)=>e in t?Re(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,R=(t,e)=>{for(var r in e||(e={}))Ne.call(e,r)&&re(t,r,e[r]);if(te)for(var r of te(e))$e.call(e,r)&&re(t,r,e[r]);return t};import{m as ne,l as ae}from"./index.f69bfaca.js";var M={exports:{}},ie=function(e,r){return function(){for(var a=new Array(arguments.length),i=0;i<a.length;i++)a[i]=arguments[i];return e.apply(r,a)}},Ae=ie,S=Object.prototype.toString;function F(t){return S.call(t)==="[object Array]"}function H(t){return typeof t=="undefined"}function Ue(t){return t!==null&&!H(t)&&t.constructor!==null&&!H(t.constructor)&&typeof t.constructor.isBuffer=="function"&&t.constructor.isBuffer(t)}function Le(t){return S.call(t)==="[object ArrayBuffer]"}function De(t){return typeof FormData!="undefined"&&t instanceof FormData}function Be(t){var e;return typeof ArrayBuffer!="undefined"&&ArrayBuffer.isView?e=ArrayBuffer.isView(t):e=t&&t.buffer&&t.buffer instanceof ArrayBuffer,e}function je(t){return typeof t=="string"}function qe(t){return typeof t=="number"}function oe(t){return t!==null&&typeof t=="object"}function $(t){if(S.call(t)!=="[object Object]")return!1;var e=Object.getPrototypeOf(t);return e===null||e===Object.prototype}function Ie(t){return S.call(t)==="[object Date]"}function _e(t){return S.call(t)==="[object File]"}function ke(t){return S.call(t)==="[object Blob]"}function se(t){return S.call(t)==="[object Function]"}function Me(t){return oe(t)&&se(t.pipe)}function Fe(t){return typeof URLSearchParams!="undefined"&&t instanceof URLSearchParams}function He(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function Je(){return typeof navigator!="undefined"&&(navigator.product==="ReactNative"||navigator.product==="NativeScript"||navigator.product==="NS")?!1:typeof window!="undefined"&&typeof document!="undefined"}function J(t,e){if(!(t===null||typeof t=="undefined"))if(typeof t!="object"&&(t=[t]),F(t))for(var r=0,n=t.length;r<n;r++)e.call(null,t[r],r,t);else for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.call(null,t[a],a,t)}function z(){var t={};function e(a,i){$(t[i])&&$(a)?t[i]=z(t[i],a):$(a)?t[i]=z({},a):F(a)?t[i]=a.slice():t[i]=a}for(var r=0,n=arguments.length;r<n;r++)J(arguments[r],e);return t}function ze(t,e,r){return J(e,function(a,i){r&&typeof a=="function"?t[i]=Ae(a,r):t[i]=a}),t}function Ve(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}var v={isArray:F,isArrayBuffer:Le,isBuffer:Ue,isFormData:De,isArrayBufferView:Be,isString:je,isNumber:qe,isObject:oe,isPlainObject:$,isUndefined:H,isDate:Ie,isFile:_e,isBlob:ke,isFunction:se,isStream:Me,isURLSearchParams:Fe,isStandardBrowserEnv:Je,forEach:J,merge:z,extend:ze,trim:He,stripBOM:Ve},O=v;function ue(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var ce=function(e,r,n){if(!r)return e;var a;if(n)a=n(r);else if(O.isURLSearchParams(r))a=r.toString();else{var i=[];O.forEach(r,function(c,m){c===null||typeof c=="undefined"||(O.isArray(c)?m=m+"[]":c=[c],O.forEach(c,function(f){O.isDate(f)?f=f.toISOString():O.isObject(f)&&(f=JSON.stringify(f)),i.push(ue(m)+"="+ue(f))}))}),a=i.join("&")}if(a){var s=e.indexOf("#");s!==-1&&(e=e.slice(0,s)),e+=(e.indexOf("?")===-1?"?":"&")+a}return e},Ge=v;function A(){this.handlers=[]}A.prototype.use=function(e,r,n){return this.handlers.push({fulfilled:e,rejected:r,synchronous:n?n.synchronous:!1,runWhen:n?n.runWhen:null}),this.handlers.length-1};A.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)};A.prototype.forEach=function(e){Ge.forEach(this.handlers,function(n){n!==null&&e(n)})};var We=A,Xe=v,Ke=function(e,r){Xe.forEach(e,function(a,i){i!==r&&i.toUpperCase()===r.toUpperCase()&&(e[r]=a,delete e[i])})},fe=function(e,r,n,a,i){return e.config=r,n&&(e.code=n),e.request=a,e.response=i,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}},e},Ye=fe,le=function(e,r,n,a,i){var s=new Error(e);return Ye(s,r,n,a,i)},Qe=le,Ze=function(e,r,n){var a=n.config.validateStatus;!n.status||!a||a(n.status)?e(n):r(Qe("Request failed with status code "+n.status,n.config,null,n.request,n))},U=v,et=U.isStandardBrowserEnv()?function(){return{write:function(r,n,a,i,s,u){var c=[];c.push(r+"="+encodeURIComponent(n)),U.isNumber(a)&&c.push("expires="+new Date(a).toGMTString()),U.isString(i)&&c.push("path="+i),U.isString(s)&&c.push("domain="+s),u===!0&&c.push("secure"),document.cookie=c.join("; ")},read:function(r){var n=document.cookie.match(new RegExp("(^|;\\s*)("+r+")=([^;]*)"));return n?decodeURIComponent(n[3]):null},remove:function(r){this.write(r,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}(),tt=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)},rt=function(e,r){return r?e.replace(/\/+$/,"")+"/"+r.replace(/^\/+/,""):e},nt=tt,at=rt,it=function(e,r){return e&&!nt(r)?at(e,r):r},V=v,ot=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],st=function(e){var r={},n,a,i;return e&&V.forEach(e.split(`
`),function(u){if(i=u.indexOf(":"),n=V.trim(u.substr(0,i)).toLowerCase(),a=V.trim(u.substr(i+1)),n){if(r[n]&&ot.indexOf(n)>=0)return;n==="set-cookie"?r[n]=(r[n]?r[n]:[]).concat([a]):r[n]=r[n]?r[n]+", "+a:a}}),r},de=v,ut=de.isStandardBrowserEnv()?function(){var e=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a"),n;function a(i){var s=i;return e&&(r.setAttribute("href",s),s=r.href),r.setAttribute("href",s),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:r.pathname.charAt(0)==="/"?r.pathname:"/"+r.pathname}}return n=a(window.location.href),function(s){var u=de.isString(s)?a(s):s;return u.protocol===n.protocol&&u.host===n.host}}():function(){return function(){return!0}}();function G(t){this.message=t}G.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")};G.prototype.__CANCEL__=!0;var L=G,D=v,ct=Ze,ft=et,lt=ce,dt=it,ht=st,mt=ut,W=le,pt=j,vt=L,he=function(e){return new Promise(function(n,a){var i=e.data,s=e.headers,u=e.responseType,c;function m(){e.cancelToken&&e.cancelToken.unsubscribe(c),e.signal&&e.signal.removeEventListener("abort",c)}D.isFormData(i)&&delete s["Content-Type"];var o=new XMLHttpRequest;if(e.auth){var f=e.auth.username||"",p=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";s.Authorization="Basic "+btoa(f+":"+p)}var P=dt(e.baseURL,e.url);o.open(e.method.toUpperCase(),lt(P,e.params,e.paramsSerializer),!0),o.timeout=e.timeout;function Z(){if(!!o){var y="getAllResponseHeaders"in o?ht(o.getAllResponseHeaders()):null,C=!u||u==="text"||u==="json"?o.responseText:o.response,w={data:C,status:o.status,statusText:o.statusText,headers:y,config:e,request:o};ct(function(k){n(k),m()},function(k){a(k),m()},w),o=null}}if("onloadend"in o?o.onloadend=Z:o.onreadystatechange=function(){!o||o.readyState!==4||o.status===0&&!(o.responseURL&&o.responseURL.indexOf("file:")===0)||setTimeout(Z)},o.onabort=function(){!o||(a(W("Request aborted",e,"ECONNABORTED",o)),o=null)},o.onerror=function(){a(W("Network Error",e,null,o)),o=null},o.ontimeout=function(){var C=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded",w=e.transitional||pt.transitional;e.timeoutErrorMessage&&(C=e.timeoutErrorMessage),a(W(C,e,w.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",o)),o=null},D.isStandardBrowserEnv()){var ee=(e.withCredentials||mt(P))&&e.xsrfCookieName?ft.read(e.xsrfCookieName):void 0;ee&&(s[e.xsrfHeaderName]=ee)}"setRequestHeader"in o&&D.forEach(s,function(C,w){typeof i=="undefined"&&w.toLowerCase()==="content-type"?delete s[w]:o.setRequestHeader(w,C)}),D.isUndefined(e.withCredentials)||(o.withCredentials=!!e.withCredentials),u&&u!=="json"&&(o.responseType=e.responseType),typeof e.onDownloadProgress=="function"&&o.addEventListener("progress",e.onDownloadProgress),typeof e.onUploadProgress=="function"&&o.upload&&o.upload.addEventListener("progress",e.onUploadProgress),(e.cancelToken||e.signal)&&(c=function(y){!o||(a(!y||y&&y.type?new vt("canceled"):y),o.abort(),o=null)},e.cancelToken&&e.cancelToken.subscribe(c),e.signal&&(e.signal.aborted?c():e.signal.addEventListener("abort",c))),i||(i=null),o.send(i)})},h=v,me=Ke,bt=fe,yt={"Content-Type":"application/x-www-form-urlencoded"};function pe(t,e){!h.isUndefined(t)&&h.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e)}function Et(){var t;return(typeof XMLHttpRequest!="undefined"||typeof process!="undefined"&&Object.prototype.toString.call(process)==="[object process]")&&(t=he),t}function wt(t,e,r){if(h.isString(t))try{return(e||JSON.parse)(t),h.trim(t)}catch(n){if(n.name!=="SyntaxError")throw n}return(r||JSON.stringify)(t)}var B={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:Et(),transformRequest:[function(e,r){return me(r,"Accept"),me(r,"Content-Type"),h.isFormData(e)||h.isArrayBuffer(e)||h.isBuffer(e)||h.isStream(e)||h.isFile(e)||h.isBlob(e)?e:h.isArrayBufferView(e)?e.buffer:h.isURLSearchParams(e)?(pe(r,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):h.isObject(e)||r&&r["Content-Type"]==="application/json"?(pe(r,"application/json"),wt(e)):e}],transformResponse:[function(e){var r=this.transitional||B.transitional,n=r&&r.silentJSONParsing,a=r&&r.forcedJSONParsing,i=!n&&this.responseType==="json";if(i||a&&h.isString(e)&&e.length)try{return JSON.parse(e)}catch(s){if(i)throw s.name==="SyntaxError"?bt(s,this,"E_JSON_PARSE"):s}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};h.forEach(["delete","get","head"],function(e){B.headers[e]={}});h.forEach(["post","put","patch"],function(e){B.headers[e]=h.merge(yt)});var j=B,St=v,Tt=j,Ct=function(e,r,n){var a=this||Tt;return St.forEach(n,function(s){e=s.call(a,e,r)}),e},ve=function(e){return!!(e&&e.__CANCEL__)},be=v,X=Ct,Ot=ve,gt=j,xt=L;function K(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new xt("canceled")}var Pt=function(e){K(e),e.headers=e.headers||{},e.data=X.call(e,e.data,e.headers,e.transformRequest),e.headers=be.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),be.forEach(["delete","get","head","post","put","patch","common"],function(a){delete e.headers[a]});var r=e.adapter||gt.adapter;return r(e).then(function(a){return K(e),a.data=X.call(e,a.data,a.headers,e.transformResponse),a},function(a){return Ot(a)||(K(e),a&&a.response&&(a.response.data=X.call(e,a.response.data,a.response.headers,e.transformResponse))),Promise.reject(a)})},b=v,ye=function(e,r){r=r||{};var n={};function a(o,f){return b.isPlainObject(o)&&b.isPlainObject(f)?b.merge(o,f):b.isPlainObject(f)?b.merge({},f):b.isArray(f)?f.slice():f}function i(o){if(b.isUndefined(r[o])){if(!b.isUndefined(e[o]))return a(void 0,e[o])}else return a(e[o],r[o])}function s(o){if(!b.isUndefined(r[o]))return a(void 0,r[o])}function u(o){if(b.isUndefined(r[o])){if(!b.isUndefined(e[o]))return a(void 0,e[o])}else return a(void 0,r[o])}function c(o){if(o in r)return a(e[o],r[o]);if(o in e)return a(void 0,e[o])}var m={url:s,method:s,data:s,baseURL:u,transformRequest:u,transformResponse:u,paramsSerializer:u,timeout:u,timeoutMessage:u,withCredentials:u,adapter:u,responseType:u,xsrfCookieName:u,xsrfHeaderName:u,onUploadProgress:u,onDownloadProgress:u,decompress:u,maxContentLength:u,maxBodyLength:u,transport:u,httpAgent:u,httpsAgent:u,cancelToken:u,socketPath:u,responseEncoding:u,validateStatus:c};return b.forEach(Object.keys(e).concat(Object.keys(r)),function(f){var p=m[f]||i,P=p(f);b.isUndefined(P)&&p!==c||(n[f]=P)}),n},Ee={version:"0.24.0"},Rt=Ee.version,Y={};["object","boolean","number","function","string","symbol"].forEach(function(t,e){Y[t]=function(n){return typeof n===t||"a"+(e<1?"n ":" ")+t}});var we={};Y.transitional=function(e,r,n){function a(i,s){return"[Axios v"+Rt+"] Transitional option '"+i+"'"+s+(n?". "+n:"")}return function(i,s,u){if(e===!1)throw new Error(a(s," has been removed"+(r?" in "+r:"")));return r&&!we[s]&&(we[s]=!0,console.warn(a(s," has been deprecated since v"+r+" and will be removed in the near future"))),e?e(i,s,u):!0}};function Nt(t,e,r){if(typeof t!="object")throw new TypeError("options must be an object");for(var n=Object.keys(t),a=n.length;a-- >0;){var i=n[a],s=e[i];if(s){var u=t[i],c=u===void 0||s(u,i,t);if(c!==!0)throw new TypeError("option "+i+" must be "+c);continue}if(r!==!0)throw Error("Unknown option "+i)}}var $t={assertOptions:Nt,validators:Y},Se=v,At=ce,Te=We,Ce=Pt,q=ye,Oe=$t,g=Oe.validators;function N(t){this.defaults=t,this.interceptors={request:new Te,response:new Te}}N.prototype.request=function(e){typeof e=="string"?(e=arguments[1]||{},e.url=arguments[0]):e=e||{},e=q(this.defaults,e),e.method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var r=e.transitional;r!==void 0&&Oe.assertOptions(r,{silentJSONParsing:g.transitional(g.boolean),forcedJSONParsing:g.transitional(g.boolean),clarifyTimeoutError:g.transitional(g.boolean)},!1);var n=[],a=!0;this.interceptors.request.forEach(function(p){typeof p.runWhen=="function"&&p.runWhen(e)===!1||(a=a&&p.synchronous,n.unshift(p.fulfilled,p.rejected))});var i=[];this.interceptors.response.forEach(function(p){i.push(p.fulfilled,p.rejected)});var s;if(!a){var u=[Ce,void 0];for(Array.prototype.unshift.apply(u,n),u=u.concat(i),s=Promise.resolve(e);u.length;)s=s.then(u.shift(),u.shift());return s}for(var c=e;n.length;){var m=n.shift(),o=n.shift();try{c=m(c)}catch(f){o(f);break}}try{s=Ce(c)}catch(f){return Promise.reject(f)}for(;i.length;)s=s.then(i.shift(),i.shift());return s};N.prototype.getUri=function(e){return e=q(this.defaults,e),At(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")};Se.forEach(["delete","get","head","options"],function(e){N.prototype[e]=function(r,n){return this.request(q(n||{},{method:e,url:r,data:(n||{}).data}))}});Se.forEach(["post","put","patch"],function(e){N.prototype[e]=function(r,n,a){return this.request(q(a||{},{method:e,url:r,data:n}))}});var Ut=N,Lt=L;function x(t){if(typeof t!="function")throw new TypeError("executor must be a function.");var e;this.promise=new Promise(function(a){e=a});var r=this;this.promise.then(function(n){if(!!r._listeners){var a,i=r._listeners.length;for(a=0;a<i;a++)r._listeners[a](n);r._listeners=null}}),this.promise.then=function(n){var a,i=new Promise(function(s){r.subscribe(s),a=s}).then(n);return i.cancel=function(){r.unsubscribe(a)},i},t(function(a){r.reason||(r.reason=new Lt(a),e(r.reason))})}x.prototype.throwIfRequested=function(){if(this.reason)throw this.reason};x.prototype.subscribe=function(e){if(this.reason){e(this.reason);return}this._listeners?this._listeners.push(e):this._listeners=[e]};x.prototype.unsubscribe=function(e){if(!!this._listeners){var r=this._listeners.indexOf(e);r!==-1&&this._listeners.splice(r,1)}};x.source=function(){var e,r=new x(function(a){e=a});return{token:r,cancel:e}};var Dt=x,Bt=function(e){return function(n){return e.apply(null,n)}},jt=function(e){return typeof e=="object"&&e.isAxiosError===!0},ge=v,qt=ie,I=Ut,It=ye,_t=j;function xe(t){var e=new I(t),r=qt(I.prototype.request,e);return ge.extend(r,I.prototype,e),ge.extend(r,e),r.create=function(a){return xe(It(t,a))},r}var E=xe(_t);E.Axios=I;E.Cancel=L;E.CancelToken=Dt;E.isCancel=ve;E.VERSION=Ee.version;E.all=function(e){return Promise.all(e)};E.spread=Bt;E.isAxiosError=jt;M.exports=E;M.exports.default=E;var kt=M.exports;const _=document.createElement("div");_.className="toast-container";document.body.appendChild(_);function T(t,e){const r=document.createElement("div");r.className=`toast ${e}`,r.innerText=t,_.appendChild(r),setTimeout(()=>{_.removeChild(r)},3e3)}T.success=t=>{T(t,"success")};T.error=t=>{T(t,"error")};T.warn=t=>{T(t,"warn")};function Ht(t,e,r){const n=document.createElement("div");n.className="confirm-container";const a=document.createElement("div");a.className="confirm",n.appendChild(a);const i=document.createElement("div");i.className="confirm-body",typeof t=="string"?i.innerText=t:i.appendChild(t),a.appendChild(i);const s=document.createElement("div");s.className="confirm-footer";const u=document.createElement("div");u.className="confirm-btn confirm-ok",u.innerText=(r==null?void 0:r.confirmText)||ne[ae].confirm;const c=document.createElement("div");c.className="confirm-btn confirm-cancel",c.innerText=(r==null?void 0:r.cancelText)||ne[ae].cancel,s.appendChild(c),s.appendChild(u),a.appendChild(s),u.addEventListener("click",m=>{document.body.removeChild(n),e(m)}),c.addEventListener("click",m=>{document.body.removeChild(n),typeof(r==null?void 0:r.cancel)=="function"&&r.cancel(m)}),document.body.appendChild(n)}function Jt(t){typeof navigator.clipboard.writeText=="function"&&navigator.clipboard.writeText(t)}function zt(t){const e=new Date(t);return`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`}function Q(t){console.error(t),t.error&&T.error(t.error);const e={tokenExpired:!0,userNotLogin:!0};t.error in e&&(location.href=`/login?referer=${encodeURIComponent(location.href.replace(location.origin,""))}`)}function l(t){return new Promise((e,r)=>{kt(t).then(n=>{n.status===200&&!n.data.error?e(n.data):n.data.error?(Q(n.data),r(n.data)):(Q(n),r(n))}).catch(n=>{Q(n),r(n)})})}const d="/api/project/";function Vt(){return l({url:"/list",baseURL:d})}function Gt(t){return l({method:"POST",url:"/info/edit",baseURL:d,data:t})}function Wt(t,e){return l({method:"POST",url:"/del",baseURL:d,data:{_id:t,name:e}})}function Xt(t,e){return l({method:"POST",url:"/clean",baseURL:d,data:{_id:t,name:e}})}function Kt(t,e){return l({url:`/info/${t}`,params:{fields:e},baseURL:d})}function Yt(t,e){return l({method:"POST",url:"/info/edit",baseURL:d,data:R({_id:t},e)})}function Qt(t,e){return l({method:"POST",url:"/group/edit",baseURL:d,data:R({projectId:t},e)})}function Zt(t,e){return l({method:"POST",url:"/group/del",baseURL:d,data:{projectId:t,_id:e}})}function er(t,e){return l({method:"POST",url:"/monitor/edit",baseURL:d,data:R({_id:t},e)})}function tr(t){return l({method:"GET",url:"/member/list",baseURL:d,params:{_id:t}})}function rr(t,e){return l({method:"POST",url:"/member/del",baseURL:d,data:{projectId:t,_id:e}})}function nr(t){return l({method:"POST",url:"/invite/updateCode",baseURL:d,data:{_id:t}})}function ar(t,e){return l({method:"POST",url:"/invite/accept",baseURL:d,data:{_id:t,code:e}})}function ir(t,e){return l({method:"GET",url:"/icon/info",baseURL:d,params:{projectId:t,_id:e}})}function or(t,e){return l({method:"POST",url:"/icon/add",baseURL:d,data:{projectId:t,icons:e}})}function sr(t,e){return l({method:"POST",url:"/icon/del",baseURL:d,data:{projectId:t,_ids:e}})}function ur(t,e,r){return l({method:"POST",url:"/icon/edit",baseURL:d,data:R({projectId:t,_id:e},r)})}function cr(t,e,r){return l({method:"POST",url:"/icon/addTag",baseURL:d,data:{projectId:t,_id:e,tag:r}})}function fr(t,e,r){return l({method:"POST",url:"/icon/delTag",baseURL:d,data:{projectId:t,_id:e,tag:r}})}function lr(t,e){return l({method:"GET",url:"/icon/pages",baseURL:d,params:{projectId:t,_id:e}})}function dr(t,e,r){return l({method:"POST",url:"/icon/batchGroup",baseURL:d,data:{projectId:t,_ids:e,groupId:r}})}function hr(t,e){return l({method:"POST",url:"/icon/gen",baseURL:d,data:{projectId:t,type:e}})}export{zt as A,Qt as a,Ht as b,Gt as c,Zt as d,Yt as e,Jt as f,tr as g,rr as h,Kt as i,er as j,Wt as k,Vt as l,Xt as m,cr as n,fr as o,ur as p,l as q,sr as r,dr as s,T as t,nr as u,or as v,hr as w,ar as x,ir as y,lr as z};
