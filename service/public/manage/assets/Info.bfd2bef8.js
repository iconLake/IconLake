import{d as c,h as m,E as f,x as v,o as _,j as x,m as a,t as n,l,B as i,C as u,A as j}from"./vendor.feadc916.js";import{i as b,a as y}from"./project.5df9f40d.js";import{t as g}from"./request.a1189ab9.js";import{_ as I}from"./plugin-vue_export-helper.5a098b48.js";import"./index.042c82b6.js";const w={class:"flex center"},B=["disabled"],h=c({setup(k){const{t:s}=m(),r=f().params.id,e=v({});async function d(){e.value=await b(r,"name desc")}async function p(){await y(r,e.value),g(s("saveDone")),setTimeout(()=>{location.reload()},1e3)}return d(),(D,t)=>(_(),x("form",{class:"info",onSubmit:t[2]||(t[2]=j(()=>{},["prevent"]))},[a("p",null,n(l(s)("name")),1),i(a("input",{type:"text",class:"input",maxlength:"15","onUpdate:modelValue":t[0]||(t[0]=o=>e.value.name=o)},null,512),[[u,e.value.name]]),a("p",null,n(l(s)("desc")),1),i(a("textarea",{rows:"10",class:"input",maxlength:"300","onUpdate:modelValue":t[1]||(t[1]=o=>e.value.desc=o)},null,512),[[u,e.value.desc]]),a("div",w,[a("button",{type:"submit",class:"btn",disabled:!e.value.name,onClick:p},n(l(s)("save")),9,B)])],32))}});var U=I(h,[["__scopeId","data-v-a748c3a0"]]);export{U as default};
