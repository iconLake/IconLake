import{d as g,u as b,B as w,n as x,v as I,c as u,a as s,e,b as t,w as a,F as k,h as p,o as m,t as o,f as S,p as j,j as y}from"./index.69a584ce.js";import{U as V}from"./User.2e14b782.js";import{H as B}from"./Header.520b9820.js";import{i as C}from"./project.24401e07.js";import{_ as N}from"./_plugin-vue_export-helper.cdc0426e.js";const n=l=>(j("data-v-bee67935"),l=l(),y(),l),$={class:"flex start main"},E={class:"menu"},F=n(()=>t("i",{class:"iconfont icon-info"},null,-1)),H=n(()=>t("i",{class:"iconfont icon-group"},null,-1)),U=n(()=>t("i",{class:"iconfont icon-member"},null,-1)),D=n(()=>t("i",{class:"iconfont icon-monitor"},null,-1)),G=n(()=>t("i",{class:"iconfont icon-setting"},null,-1)),M={class:"content grow"},P={class:"grow"},R={class:"flex"},q={class:"title"},z={key:0,class:"iconfont icon-edit"},A={class:"desc"},J=n(()=>t("div",{class:"icon"},null,-1)),K=n(()=>t("div",{class:"footer"},null,-1)),L=g({__name:"Setting",setup(l){const{t:i}=b(),r=w(),d=r.params.id,_=x({name:"",desc:""}),f=I(()=>/\/info$/i.test(r.path));async function v(){_.value=await C(d,"name desc")}return v(),(O,Q)=>{const c=p("router-link"),h=p("router-view");return m(),u(k,null,[s(B,{back:`/icons/${e(d)}`},null,8,["back"]),s(V),t("div",$,[t("div",E,[s(c,{class:"item","active-class":"active",to:"./info"},{default:a(()=>[F,t("span",null,o(e(i)("projectInfo")),1)]),_:1}),s(c,{class:"item","active-class":"active",to:"./group"},{default:a(()=>[H,t("span",null,o(e(i)("iconGroup")),1)]),_:1}),s(c,{class:"item","active-class":"active",to:"./member"},{default:a(()=>[U,t("span",null,o(e(i)("projectMember")),1)]),_:1}),s(c,{class:"item","active-class":"active",to:"./monitor"},{default:a(()=>[D,t("span",null,o(e(i)("monitor")),1)]),_:1}),s(c,{class:"item","active-class":"active",to:"./advance"},{default:a(()=>[G,t("span",null,o(e(i)("advance")),1)]),_:1})]),t("div",M,[s(c,{to:"./info",class:"flex info"},{default:a(()=>[t("div",P,[t("div",R,[t("div",q,o(_.value.name),1),e(f)?S("",!0):(m(),u("i",z))]),t("div",A,o(_.value.desc),1)]),J]),_:1}),s(h)])]),K],64)}}});const tt=N(L,[["__scopeId","data-v-bee67935"]]);export{tt as default};
