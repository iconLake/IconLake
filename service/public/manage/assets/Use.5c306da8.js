import{d as V,u as N,B,r as E,v as u,M as F,c as r,a as $,w as L,b as t,s as m,e as s,f as y,t as c,F as W,o as d,p as J,j as R}from"./index.157c81db.js";import{i as H,w as g,t as x,f as O}from"./project.0a57ce33.js";import{H as z}from"./Header.bc1469d5.js";import{U as A}from"./User.619cb062.js";import{_ as M}from"./_plugin-vue_export-helper.cdc0426e.js";const l=_=>(J("data-v-17f3bc6e"),_=_(),R(),_),P={class:"name"},q={class:"tab flex"},G=l(()=>t("span",null,"CSS",-1)),K=["title"],Q=l(()=>t("span",null,"Javascript",-1)),X=["title"],Y={key:0,class:"content use-css"},Z={class:"t-center"},ee=["title"],te=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),se=["title"],ne=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),oe={class:"t-center operate"},ie={class:"help"},ce={key:1,class:"content use-js"},ae={class:"t-center"},le=["title"],re=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),de=["title"],pe=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),ue={class:"t-center operate"},_e={class:"help"},ve={key:2,class:"content use-vue"},fe={class:"t-center"},me=["title"],ye=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),ge={key:3,class:"content use-vue"},he={class:"t-center"},be=["title"],ke=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),Te=V({__name:"Use",setup(_){const{t:n}=N(),w=B(),e=E({_id:w.params.id,name:"",class:"",prefix:"",iconUpdateTime:"",file:{},activeTab:"css",src:"",generating:new Set}),h=u(()=>`<link rel="stylesheet" href="${e.src}">`),b=u(()=>`<i class="${e.class} ${e.prefix}home"></i>`),k=u(()=>`<script src="${e.src}"><\/script>`),T='<icon-svg name="home"></icon-svg>',j=u(()=>{var o,i;return!((o=e.file.css)!=null&&o.updateTime)||+new Date((i=e.file.css)==null?void 0:i.updateTime)<+new Date(e.iconUpdateTime)}),S=u(()=>{var o,i;return!((o=e.file.js)!=null&&o.updateTime)||+new Date((i=e.file.js)==null?void 0:i.updateTime)<+new Date(e.iconUpdateTime)});F(()=>{var i,a;const o=e.activeTab;if(o==="vue"||o==="react"){e.src=n("loading"),o==="vue"&&I(),o==="react"&&D();return}e.src=(i=e.file[o])!=null&&i.hash?`${e.file.domain}/src/${e._id}/${(a=e.file[o])==null?void 0:a.hash}/iconlake.${o}`:""});async function U(){const o=await H(e._id,"name file iconUpdateTime class prefix");Object.assign(e,o)}U();function v(o){return e.activeTab===o?"active":""}function f(o){e.activeTab=o}async function C(){const o=e.activeTab;if(o==="vue"||o==="react"||e.generating.has(o))return;e.generating.add(o),e.file[o]||(e.file[o]={updateTime:"",hash:""});const i=await g(e._id,o).finally(()=>{e.generating.delete(o)});Object.assign(e.file[o],i),x(n("generateDone"))}async function I(){e.src=(await g(e._id,"vue")).content||""}async function D(){e.src=(await g(e._id,"react")).content||""}function p(o){O(o),x(n("copyDone"))}return(o,i)=>(d(),r(W,null,[$(z,{back:`/icons/${e._id}`},{default:L(()=>[t("div",P,c(e.name),1)]),_:1},8,["back"]),$(A),t("div",q,[t("div",{class:m(["item",v("css")]),onClick:i[0]||(i[0]=a=>f("css"))},[G,s(j)?(d(),r("span",{key:0,class:"alert",title:s(n)("upgradable")},null,8,K)):y("",!0)],2),t("div",{class:m(["item",v("js")]),onClick:i[1]||(i[1]=a=>f("js"))},[Q,s(S)?(d(),r("span",{key:0,class:"alert",title:s(n)("upgradable")},null,8,X)):y("",!0)],2),t("div",{class:m(["item",v("vue")]),onClick:i[2]||(i[2]=a=>f("vue"))},"Vue",2),t("div",{class:m(["item",v("react")]),onClick:i[3]||(i[3]=a=>f("react"))},"React",2)]),e.activeTab==="css"?(d(),r("div",Y,[t("h2",Z,c(s(n)("useWithType",{type:"CSS"})),1),t("p",null,c(s(n)("includeType",{type:"CSS"}))+c(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[4]||(i[4]=a=>p(s(h))),title:s(n)("copy")},[t("span",null,c(s(h)),1),te],8,ee),t("p",null,c(s(n)("displayIcon"))+c(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[5]||(i[5]=a=>p(s(b))),title:s(n)("copy")},[t("span",null,c(s(b)),1),ne],8,se),t("div",oe,[t("button",{class:"btn",onClick:C},c(s(n)(e.generating.has("css")?"generating":"regenerate")),1),t("div",ie,c(s(n)("generationNote",{n:e.file.maxLength})),1)])])):e.activeTab==="js"?(d(),r("div",ce,[t("h2",ae,c(s(n)("useWithType",{type:"Javascript"})),1),t("p",null,c(s(n)("includeType",{type:"Javascript"}))+c(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[6]||(i[6]=a=>p(s(k))),title:s(n)("copy")},[t("span",null,c(s(k)),1),re],8,le),t("p",null,c(s(n)("displayIcon"))+c(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[7]||(i[7]=a=>p(T)),title:s(n)("copy")},[t("span",null,c(T)),pe],8,de),t("div",ue,[t("button",{class:"btn",onClick:C},c(s(n)(e.generating.has("js")?"generating":"regenerate")),1),t("div",_e,c(s(n)("generationNote",{n:e.file.maxLength})),1)])])):e.activeTab==="vue"?(d(),r("div",ve,[t("h2",fe,c(s(n)("useWithType",{type:s(n)("vueComponent")})),1),t("p",null,c(s(n)("componentFile"))+c(s(n)("colon")),1),t("div",{class:"code vue flex",onClick:i[8]||(i[8]=a=>p(e.src)),title:s(n)("copy")},[t("pre",null,c(e.src),1),ye],8,me)])):e.activeTab==="react"?(d(),r("div",ge,[t("h2",he,c(s(n)("useWithType",{type:s(n)("reactComponent")})),1),t("p",null,c(s(n)("componentFile"))+c(s(n)("colon")),1),t("div",{class:"code vue flex",onClick:i[9]||(i[9]=a=>p(e.src)),title:s(n)("copy")},[t("pre",null,c(e.src),1),ke],8,be)])):y("",!0)],64))}});const Se=M(Te,[["__scopeId","data-v-17f3bc6e"]]);export{Se as default};
