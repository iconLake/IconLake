import{d as F,u as k,B as S,n as $,c as f,b as a,t as B,e as L,F as y,g as z,o as v,x,y as E,z as V,p as j,j as D}from"./index.40cf615b.js";import{i as H,a as N,b as U,d as A}from"./project.df85cb82.js";import{_ as R}from"./_plugin-vue_export-helper.cdc0426e.js";const T=c=>(j("data-v-119db4bb"),c=c(),D(),c),Y=T(()=>a("i",{class:"iconfont icon-plus m-left"},null,-1)),q={class:"list"},J=["data-i"],K=["onMousedown","onMouseup"],O=["onUpdate:modelValue","onChange"],P=["onClick"],Q=F({__name:"Group",setup(c){const{t:d}=k(),r=S().params.id,o=$([]);let i,p=0,l=!1,m=0;async function M(){const e=await H(r,"groups");o.value=e.groups.sort((t,n)=>n.num-t.num)}M();function b(){const e={_id:"",name:d("newGroup"),num:o.value.length,icons:[]};o.value.unshift(e),_(e)}function w(e){U(`${d("delGroupConfirm")}\uFF1A${o.value[e].name}\uFF1F`,async()=>{await A(r,o.value[e]._id),o.value.splice(e,1)})}function I(e){const t=e.target.parentNode;i=t,p=e.y,l=!0,t.style.zIndex="10",m=t.offsetHeight,t.classList.add("active")}function G(e){l&&(i.style.top=`${e.y-p}px`)}function h(e){if(l){l=!1,i.style.top="0",i.style.zIndex="0",i.classList.remove("active");const t=Math.floor((e.y-p)/m),n=+i.dataset.i,u=Math.max(0,n+t);Math.abs(t)>0&&(o.value.splice(u,0,...o.value.splice(n,1)),o.value.forEach((s,C)=>{const g=o.value.length-C-1;g!==s.num&&(s.num=g,_(s))}))}}async function _(e){const t=await N(r,e);e._id||(e._id=t._id)}return(e,t)=>(v(),f(y,null,[a("div",{class:"item flex center c-main pointer",onClick:b},[a("span",null,B(L(d)("addGroup")),1),Y]),a("div",q,[(v(!0),f(y,null,z(o.value,(n,u)=>(v(),f("div",{class:"item flex stretch","data-i":u},[a("div",{class:"drag iconfont icon-drag",onMousedown:x(I,["prevent"]),onMousemove:G,onMouseup:x(h,["prevent"]),onMouseleave:h},null,40,K),E(a("input",{class:"grow",type:"text","onUpdate:modelValue":s=>n.name=s,onChange:s=>_(n)},null,40,O),[[V,n.name]]),a("div",{class:"opt iconfont icon-delete c-danger",onClick:s=>w(u)},null,8,P)],8,J))),256))])],64))}});const te=R(Q,[["__scopeId","data-v-119db4bb"]]);export{te as default};
