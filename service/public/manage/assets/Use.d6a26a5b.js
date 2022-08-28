import{d as D,u as V,B as N,r as B,v as u,M as E,c as d,a as C,w as L,b as t,s as m,e as s,f as g,t as a,F,o as p,p as J,j as W}from"./index.40cf615b.js";import{i as H,w as x,t as $,f as O}from"./project.df85cb82.js";import{H as z}from"./Header.3040b37b.js";import{U as A}from"./User.8b271f25.js";import{_ as M}from"./_plugin-vue_export-helper.cdc0426e.js";const l=_=>(J("data-v-c032098a"),_=_(),W(),_),P={class:"name"},R={class:"tab flex"},q=l(()=>t("span",null,"CSS",-1)),G=["title"],K=l(()=>t("span",null,"Javascript",-1)),Q=["title"],X={key:0,class:"content use-css"},Y={class:"t-center"},Z=["title"],ee=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),te=["title"],se=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),ne={class:"t-center operate"},oe={class:"help"},ie={key:1,class:"content use-js"},ae={class:"t-center"},ce=["title"],le=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),de=["title"],pe=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),re={class:"t-center operate"},ue={class:"help"},_e={key:2,class:"content use-vue"},fe={class:"t-center"},ve=["title"],me=l(()=>t("i",{class:"iconfont icon-copy"},null,-1)),ge=D({__name:"Use",setup(_){const{t:n}=V(),j=N(),e=B({_id:j.params.id,name:"",class:"",prefix:"",iconUpdateTime:"",file:{},activeTab:"css",src:"",generating:new Set}),h=u(()=>`<link rel="stylesheet" href="${e.src}">`),y=u(()=>`<i class="${e.class} ${e.prefix}home"></i>`),b=u(()=>`<script src="${e.src}"><\/script>`),T='<icon-svg name="home"></icon-svg>',w=u(()=>{var o,i;return!((o=e.file.css)!=null&&o.updateTime)||+new Date((i=e.file.css)==null?void 0:i.updateTime)<+new Date(e.iconUpdateTime)}),S=u(()=>{var o,i;return!((o=e.file.js)!=null&&o.updateTime)||+new Date((i=e.file.js)==null?void 0:i.updateTime)<+new Date(e.iconUpdateTime)});E(()=>{var i,c;const o=e.activeTab;if(o==="vue"){e.src=n("loading"),I();return}e.src=(i=e.file[o])!=null&&i.hash?`${e.file.domain}/src/${e._id}/${(c=e.file[o])==null?void 0:c.hash}/iconlake.${o}`:""});async function U(){const o=await H(e._id,"name file iconUpdateTime class prefix");Object.assign(e,o)}U();function f(o){return e.activeTab===o?"active":""}function v(o){e.activeTab=o}async function k(){const o=e.activeTab;if(o==="vue"||e.generating.has(o))return;e.generating.add(o),e.file[o]||(e.file[o]={updateTime:"",hash:""});const i=await x(e._id,o).finally(()=>{e.generating.delete(o)});Object.assign(e.file[o],i),$(n("generateDone"))}async function I(){e.src=(await x(e._id,"vue")).content||""}function r(o){O(o),$(n("copyDone"))}return(o,i)=>(p(),d(F,null,[C(z,{back:`/icons/${e._id}`},{default:L(()=>[t("div",P,a(e.name),1)]),_:1},8,["back"]),C(A),t("div",R,[t("div",{class:m(["item",f("css")]),onClick:i[0]||(i[0]=c=>v("css"))},[q,s(w)?(p(),d("span",{key:0,class:"alert",title:s(n)("upgradable")},null,8,G)):g("",!0)],2),t("div",{class:m(["item",f("js")]),onClick:i[1]||(i[1]=c=>v("js"))},[K,s(S)?(p(),d("span",{key:0,class:"alert",title:s(n)("upgradable")},null,8,Q)):g("",!0)],2),t("div",{class:m(["item",f("vue")]),onClick:i[2]||(i[2]=c=>v("vue"))},"Vue",2)]),e.activeTab==="css"?(p(),d("div",X,[t("h2",Y,a(s(n)("useWithType",{type:"CSS"})),1),t("p",null,a(s(n)("includeType",{type:"CSS"}))+a(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[3]||(i[3]=c=>r(s(h))),title:s(n)("copy")},[t("span",null,a(s(h)),1),ee],8,Z),t("p",null,a(s(n)("displayIcon"))+a(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[4]||(i[4]=c=>r(s(y))),title:s(n)("copy")},[t("span",null,a(s(y)),1),se],8,te),t("div",ne,[t("button",{class:"btn",onClick:k},a(s(n)(e.generating.has("css")?"generating":"regenerate")),1),t("div",oe,a(s(n)("generationNote",{n:e.file.maxLength})),1)])])):e.activeTab==="js"?(p(),d("div",ie,[t("h2",ae,a(s(n)("useWithType",{type:"Javascript"})),1),t("p",null,a(s(n)("includeType",{type:"Javascript"}))+a(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[5]||(i[5]=c=>r(s(b))),title:s(n)("copy")},[t("span",null,a(s(b)),1),le],8,ce),t("p",null,a(s(n)("displayIcon"))+a(s(n)("colon")),1),t("div",{class:"code flex",onClick:i[6]||(i[6]=c=>r(T)),title:s(n)("copy")},[t("span",null,a(T)),pe],8,de),t("div",re,[t("button",{class:"btn",onClick:k},a(s(n)(e.generating.has("js")?"generating":"regenerate")),1),t("div",ue,a(s(n)("generationNote",{n:e.file.maxLength})),1)])])):e.activeTab==="vue"?(p(),d("div",_e,[t("h2",fe,a(s(n)("useWithType",{type:s(n)("vueComponent")})),1),t("p",null,a(s(n)("componentFile"))+a(s(n)("colon")),1),t("div",{class:"code vue flex",onClick:i[7]||(i[7]=c=>r(e.src)),title:s(n)("copy")},[t("pre",null,a(e.src),1),me],8,ve)])):g("",!0)],64))}});const Ce=M(ge,[["__scopeId","data-v-c032098a"]]);export{Ce as default};
