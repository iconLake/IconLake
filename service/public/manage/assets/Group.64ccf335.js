import{d as G,h as b,E as k,x as S,o as v,j as _,m as a,t as $,l as B,F as x,n as E,q as L,s as V,A as y,B as q,C as z}from"./vendor.feadc916.js";import{c as A}from"./request.a1189ab9.js";import{i as D,b as H,d as N}from"./project.5df9f40d.js";import{_ as U}from"./plugin-vue_export-helper.5a098b48.js";import"./index.042c82b6.js";const R=c=>(L("data-v-a2eec39c"),c=c(),V(),c),T=R(()=>a("i",{class:"iconfont icon-plus m-left"},null,-1)),Y={class:"list"},J=["data-i"],K=["onMousedown","onMouseup"],O=["onUpdate:modelValue","onChange"],P=["onClick"],Q=G({setup(c){const{t:u}=b(),d=k().params.id,o=S([]);let i,p=0,l=!1,m=0;async function M(){const e=await D(d,"groups");o.value=e.groups.sort((t,s)=>s.num-t.num)}M();function w(){const e={_id:"",name:u("newGroup"),num:o.value.length,icons:[]};o.value.unshift(e),f(e)}function I(e){A(`${u("delGroupConfirm")}\uFF1A${o.value[e].name}\uFF1F`,async()=>{await N(d,o.value[e]._id),o.value.splice(e,1)})}function j(e){const t=e.target.parentNode;i=t,p=e.y,l=!0,t.style.zIndex="10",m=t.offsetHeight,t.classList.add("active")}function C(e){l&&(i.style.top=`${e.y-p}px`)}function h(e){if(l){l=!1,i.style.top="0",i.style.zIndex="0",i.classList.remove("active");const t=Math.floor((e.y-p)/m),s=+i.dataset.i,r=Math.max(0,s+t);Math.abs(t)>0&&(o.value.splice(r,0,...o.value.splice(s,1)),o.value.forEach((n,F)=>{const g=o.value.length-F-1;g!==n.num&&(n.num=g,f(n))}))}}async function f(e){const t=await H(d,e);e._id||(e._id=t._id)}return(e,t)=>(v(),_(x,null,[a("div",{class:"item flex center c-main pointer",onClick:w},[a("span",null,$(B(u)("addGroup")),1),T]),a("div",Y,[(v(!0),_(x,null,E(o.value,(s,r)=>(v(),_("div",{class:"item flex stretch","data-i":r,draggable:"true"},[a("div",{class:"drag iconfont icon-drag",onMousedown:y(j,["prevent"]),onMousemove:C,onMouseup:y(h,["prevent"]),onMouseleave:h},null,40,K),q(a("input",{class:"grow",type:"text","onUpdate:modelValue":n=>s.name=n,onChange:n=>f(s)},null,40,O),[[z,s.name]]),a("div",{class:"opt iconfont icon-delete c-danger",onClick:n=>I(r)},null,8,P)],8,J))),256))])],64))}});var se=U(Q,[["__scopeId","data-v-a2eec39c"]]);export{se as default};