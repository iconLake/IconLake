import{d as k,u as S,B as $,n as B,c as _,b as a,t as L,e as b,F as y,g as z,o as v,x,y as E,z as V,p as j,j as D}from"./index.36adfcd8.js";import{i as H,a as N,b as U,d as A}from"./project.56d81f18.js";import{_ as R}from"./_plugin-vue_export-helper.cdc0426e.js";const T=c=>(j("data-v-134818af"),c=c(),D(),c),Y=T(()=>a("i",{class:"iconfont icon-plus m-left"},null,-1)),q={class:"list"},J=["data-i"],K=["onMousedown","onMouseup"],O=["onUpdate:modelValue","onChange"],P=["onClick"],Q=k({__name:"Group",setup(c){const{t:r}=S(),d=$().params.id,o=B([]);let i,p=0,l=!1,m=0;async function M(){const e=await H(d,"groups");o.value=e.groups.sort((t,n)=>n.num-t.num)}M();function w(){const e={_id:"",name:r("newGroup"),num:o.value.length,icons:[]};o.value.unshift(e),f(e)}function I(e){U(`${r("delGroupConfirm")}\uFF1A${o.value[e].name}\uFF1F`,async()=>{await A(d,o.value[e]._id),o.value.splice(e,1)})}function G(e){const t=e.target.parentNode;i=t,p=e.y,l=!0,t.style.zIndex="10",m=t.offsetHeight,t.classList.add("active")}function C(e){l&&(i.style.top=`${e.y-p}px`)}function h(e){if(l){l=!1,i.style.top="0",i.style.zIndex="0",i.classList.remove("active");const t=Math.floor((e.y-p)/m),n=+i.dataset.i,u=Math.max(0,n+t);Math.abs(t)>0&&(o.value.splice(u,0,...o.value.splice(n,1)),o.value.forEach((s,F)=>{const g=o.value.length-F-1;g!==s.num&&(s.num=g,f(s))}))}}async function f(e){const t=await N(d,e);e._id||(e._id=t._id)}return(e,t)=>(v(),_(y,null,[a("div",{class:"item flex center c-main pointer",onClick:w},[a("span",null,L(b(r)("addGroup")),1),Y]),a("div",q,[(v(!0),_(y,null,z(o.value,(n,u)=>(v(),_("div",{class:"item flex stretch","data-i":u},[a("div",{class:"drag iconfont icon-drag",onMousedown:x(G,["prevent"]),onMousemove:C,onMouseup:x(h,["prevent"]),onMouseleave:h},null,40,K),E(a("input",{class:"grow",type:"text","onUpdate:modelValue":s=>n.name=s,onChange:s=>f(n)},null,40,O),[[V,n.name]]),a("div",{class:"opt iconfont icon-delete c-danger",onClick:s=>I(u)},null,8,P)],8,J))),256))])],64))}});const te=R(Q,[["__scopeId","data-v-134818af"]]);export{te as default};
