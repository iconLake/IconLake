import{U as g}from"./User.93426633.js";import{I as j}from"./Icon.c22ecd78.js";import{H as x}from"./Header.6270a960.js";import{d as k,h as y,E as V,i as w,x as v,o as i,j as d,k as u,l as e,m as s,t as o,F as h,n as F,q as L,s as S}from"./vendor.feadc916.js";import{v as T,w as B}from"./project.897b3eb4.js";import{f as H}from"./request.deddff46.js";import{_ as P}from"./plugin-vue_export-helper.5a098b48.js";import"./index.56bfeb65.js";const U=n=>(L("data-v-4b41dc40"),n=n(),S(),n),q={class:"analyse"},C={class:"flex stretch"},E={class:"flex column info"},N={class:"label"},$={class:"value"},A={class:"label"},D={class:"value"},O={class:"m-top"},R={class:"label"},z={class:"value"},G={class:"title"},J={class:"list"},K=["href"],M={class:"num"},Q=U(()=>s("div",{class:"footer"},null,-1)),W=k({setup(n){const{t:a}=y(),_=V(),l=_.params.projectId,p=_.params.id,c=w({info:{},source:{}}),f=v([]),m=v("--");async function I(){const t=await T(l,p);Object.assign(c,t)}async function b(){const t=await B(l,p);f.value=t.pages,m.value=H(t.updateTime)}return I(),b(),(t,X)=>(i(),d(h,null,[u(x,{back:`/icons/${e(l)}`},null,8,["back"]),u(g),s("div",q,[s("div",C,[u(j,{info:e(c).info,source:e(c).source},null,8,["info","source"]),s("div",E,[s("div",null,[s("span",N,o(e(a)("name")),1),s("span",$,o(e(c).info.name),1)]),s("div",null,[s("div",null,[s("span",A,o(e(a)("updateTime")),1),s("span",D,o(m.value),1)]),s("div",O,[s("span",R,o(e(a)("statPeriod")),1),s("span",z,o(e(a)("last30d")),1)])])])]),s("div",G,o(e(a)("refererPageLink")),1),s("div",J,[(i(!0),d(h,null,F(f.value,r=>(i(),d("div",{class:"item flex",key:r.url},[s("a",{href:r.url,target:"_blank",rel:"noopener noreferrer"},o(r.url),9,K),s("div",null,[s("span",null,o(e(a)("refererCount"))+"\uFF1A",1),s("span",M,o(r.count),1)])]))),128))])]),Q],64))}});var cs=P(W,[["__scopeId","data-v-4b41dc40"]]);export{cs as default};
