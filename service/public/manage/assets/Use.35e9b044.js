import{d as D,h as V,C as N,i as E,y as u,M as L,o as r,j as d,k as C,l as e,w as B,m as t,x as m,n as g,t as a,F,q as H,s as J}from"./vendor.75eb7f42.js";import{i as W,w as x,t as j,f as O}from"./project.637ce5a4.js";import{H as q}from"./Header.c4625430.js";import{U as z}from"./User.4f362095.js";import{_ as A}from"./plugin-vue_export-helper.5a098b48.js";import"./index.f3ba9eaa.js";const l=_=>(H("data-v-531819aa"),_=_(),J(),_),M={class:"name"},P={class:"tab flex"},R=l(()=>t("span",null,"CSS",-1)),G=["title"],K=l(()=>t("span",null,"Javascript",-1)),Q=["title"],X={key:0,class:"content use-css"},Y={class:"t-center"},Z=["title"],ee=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),se=["title"],te=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),ne={class:"t-center operate"},oe={class:"help"},ie={key:1,class:"content use-js"},ae={class:"t-center"},ce=["title"],le=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),re=["title"],de=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),pe={class:"t-center operate"},ue={class:"help"},_e={key:2,class:"content use-vue"},ve={class:"t-center"},fe=["title"],me=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),ge=D({setup(_){const{t:n}=V(),$=N(),s=E({_id:$.params.id,name:"",class:"",prefix:"",iconUpdateTime:"",file:{},activeTab:"css",src:"",generating:new Set}),h=u(()=>`<link rel="stylesheet" href="${s.src}">`),y=u(()=>`<i class="${s.class} ${s.prefix}home"></i>`),b=u(()=>`<script src="${s.src}"><\/script>`),k='<icon-svg name="home"></icon-svg>',w=u(()=>{var o,i;return!((o=s.file.css)==null?void 0:o.updateTime)||+new Date((i=s.file.css)==null?void 0:i.updateTime)<+new Date(s.iconUpdateTime)}),S=u(()=>{var o,i;return!((o=s.file.js)==null?void 0:o.updateTime)||+new Date((i=s.file.js)==null?void 0:i.updateTime)<+new Date(s.iconUpdateTime)});L(()=>{var i,c;const o=s.activeTab;if(o==="vue"){s.src=n("loading"),I();return}s.src=((i=s.file[o])==null?void 0:i.hash)?`${s.file.domain}/src/${s._id}/${(c=s.file[o])==null?void 0:c.hash}/iconlake.${o}`:""});async function U(){const o=await W(s._id,"name file iconUpdateTime class prefix");Object.assign(s,o)}U();function v(o){return s.activeTab===o?"active":""}function f(o){s.activeTab=o}async function T(){const o=s.activeTab;if(o==="vue"||s.generating.has(o))return;s.generating.add(o),s.file[o]||(s.file[o]={updateTime:"",hash:""});const i=await x(s._id,o).finally(()=>{s.generating.delete(o)});Object.assign(s.file[o],i),j(n("generateDone"))}async function I(){s.src=(await x(s._id,"vue")).content||""}function p(o){O(o),j(n("copyDone"))}return(o,i)=>(r(),d(F,null,[C(q,{back:`/icons/${e(s)._id}`},{default:B(()=>[t("div",M,a(e(s).name),1)]),_:1},8,["back"]),C(z),t("div",P,[t("div",{class:m(["item",v("css")]),onClick:i[0]||(i[0]=c=>f("css"))},[R,e(w)?(r(),d("span",{key:0,class:"alert",title:e(n)("upgradable")},null,8,G)):g("",!0)],2),t("div",{class:m(["item",v("js")]),onClick:i[1]||(i[1]=c=>f("js"))},[K,e(S)?(r(),d("span",{key:0,class:"alert",title:e(n)("upgradable")},null,8,Q)):g("",!0)],2),t("div",{class:m(["item",v("vue")]),onClick:i[2]||(i[2]=c=>f("vue"))},"Vue",2)]),e(s).activeTab==="css"?(r(),d("div",X,[t("h2",Y,a(e(n)("useWithType",{type:"CSS"})),1),t("p",null,a(e(n)("includeType",{type:"CSS"}))+a(e(n)("colon")),1),t("div",{class:"code flex",onClick:i[3]||(i[3]=c=>p(e(h))),title:e(n)("copy")},[t("span",null,a(e(h)),1),ee],8,Z),t("p",null,a(e(n)("displayIcon"))+a(e(n)("colon")),1),t("div",{class:"code flex",onClick:i[4]||(i[4]=c=>p(e(y))),title:e(n)("copy")},[t("span",null,a(e(y)),1),te],8,se),t("div",ne,[t("button",{class:"btn",onClick:T},a(e(n)(e(s).generating.has("css")?"generating":"regenerate")),1),t("div",oe,a(e(n)("generationNote",{n:e(s).file.maxLength})),1)])])):e(s).activeTab==="js"?(r(),d("div",ie,[t("h2",ae,a(e(n)("useWithType",{type:"Javascript"})),1),t("p",null,a(e(n)("includeType",{type:"Javascript"}))+a(e(n)("colon")),1),t("div",{class:"code flex",onClick:i[5]||(i[5]=c=>p(e(b))),title:e(n)("copy")},[t("span",null,a(e(b)),1),le],8,ce),t("p",null,a(e(n)("displayIcon"))+a(e(n)("colon")),1),t("div",{class:"code flex",onClick:i[6]||(i[6]=c=>p(k)),title:e(n)("copy")},[t("span",null,a(k)),de],8,re),t("div",pe,[t("button",{class:"btn",onClick:T},a(e(n)(e(s).generating.has("js")?"generating":"regenerate")),1),t("div",ue,a(e(n)("generationNote",{n:e(s).file.maxLength})),1)])])):e(s).activeTab==="vue"?(r(),d("div",_e,[t("h2",ve,a(e(n)("useWithType",{type:e(n)("vueComponent")})),1),t("p",null,a(e(n)("componentFile"))+a(e(n)("colon")),1),t("div",{class:"code vue flex",onClick:i[7]||(i[7]=c=>p(e(s).src)),title:e(n)("copy")},[t("pre",null,a(e(s).src),1),me],8,fe)])):g("",!0)],64))}});var xe=A(ge,[["__scopeId","data-v-531819aa"]]);export{xe as default};
