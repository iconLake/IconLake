import{d as f,u as h,B as x,E as b,n as d,c as y,b as e,t as s,e as n,D as i,y as j,z as k,o as w}from"./index.40cf615b.js";import{i as A,k as P,m as g,t as B}from"./project.df85cb82.js";import{_ as D}from"./_plugin-vue_export-helper.cdc0426e.js";const C={class:"advance"},I={class:"warn"},N={class:"name"},V=i("]\xA0\u3002"),E=["placeholder"],R={class:"flex center"},S=["disabled"],T=["disabled"],$=f({__name:"Advance",setup(z){const{t:a}=h(),u=x(),r=b(),c=u.params.id,t=d(""),o=d({});async function _(){o.value=await A(c,"name desc")}_();async function p(){await P(c,t.value),r.push("/home")}async function v(){await g(c,t.value),B.success(a("cleanDone"))}return(F,l)=>(w(),y("div",C,[e("div",I,[e("p",null,s(n(a)("delProjectWarning")),1),e("p",null,[i(s(n(a)("inputForSafe"))+"\xA0[",1),e("span",N,s(o.value.name),1),V])]),e("p",null,[j(e("input",{type:"text","onUpdate:modelValue":l[0]||(l[0]=m=>t.value=m),placeholder:n(a)("fillProjectName")},null,8,E),[[k,t.value]])]),e("div",R,[e("button",{class:"btn",disabled:t.value!==o.value.name,onClick:v},s(n(a)("cleanProject")),9,S),e("button",{class:"btn",disabled:t.value!==o.value.name,onClick:p},s(n(a)("deleteProject")),9,T)])]))}});const q=D($,[["__scopeId","data-v-7947f9a8"]]);export{q as default};
