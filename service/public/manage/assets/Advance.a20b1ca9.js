import{d as f,h as b,E as h,u as j,x as d,o as x,j as y,m as e,t as s,l as o,D as r,B as g,C as k}from"./vendor.feadc916.js";import{i as w,k as P,m as A}from"./project.897b3eb4.js";import{t as B}from"./request.deddff46.js";import{_ as C}from"./plugin-vue_export-helper.5a098b48.js";import"./index.56bfeb65.js";const D={class:"advance"},I={class:"warn"},N={class:"name"},V=r("]\xA0\u3002"),E=["placeholder"],R={class:"flex center"},S=["disabled"],T=["disabled"],$=f({setup(q){const{t}=b(),i=h(),u=j(),c=i.params.id,a=d(""),n=d({});async function _(){n.value=await w(c,"name desc")}_();async function p(){await P(c,a.value),u.push("/home")}async function v(){await A(c,a.value),B.success(t("cleanDone"))}return(F,l)=>(x(),y("div",D,[e("div",I,[e("p",null,s(o(t)("delProjectWarning")),1),e("p",null,[r(s(o(t)("inputForSafe"))+"\xA0[",1),e("span",N,s(n.value.name),1),V])]),e("p",null,[g(e("input",{type:"text","onUpdate:modelValue":l[0]||(l[0]=m=>a.value=m),placeholder:o(t)("fillProjectName")},null,8,E),[[k,a.value]])]),e("div",R,[e("button",{class:"btn",disabled:a.value!==n.value.name,onClick:v},s(o(t)("cleanProject")),9,S),e("button",{class:"btn",disabled:a.value!==n.value.name,onClick:p},s(o(t)("deleteProject")),9,T)])]))}});var H=C($,[["__scopeId","data-v-1bccf85a"]]);export{H as default};
