import{d as f,h as m,E as v,x as h,r as d,o as j,j as g,k as e,l as n,m as s,w as a,F as x,q as b,s as w,t as o}from"./vendor.feadc916.js";import{U as k}from"./User.c3d28662.js";import{H as I}from"./Header.6270a960.js";import{i as S}from"./project.5df9f40d.js";import{_ as y}from"./plugin-vue_export-helper.5a098b48.js";import"./request.a1189ab9.js";import"./index.042c82b6.js";const t=l=>(b("data-v-dc87447e"),l=l(),w(),l),V={class:"flex start main"},B={class:"menu"},C=t(()=>s("i",{class:"iconfont icon-source-fill"},null,-1)),H=t(()=>s("i",{class:"iconfont icon-group"},null,-1)),U=t(()=>s("i",{class:"iconfont icon-info"},null,-1)),$=t(()=>s("i",{class:"iconfont icon-member"},null,-1)),q=t(()=>s("i",{class:"iconfont icon-monitor"},null,-1)),E=t(()=>s("i",{class:"iconfont icon-setting"},null,-1)),F={class:"content grow"},N={class:"grow"},D={class:"flex"},G={class:"title"},M=t(()=>s("i",{class:"iconfont icon-edit"},null,-1)),P={class:"desc"},R=t(()=>s("div",{class:"icon"},null,-1)),z=t(()=>s("div",{class:"footer"},null,-1)),A=f({setup(l){const{t:i}=m(),_=v().params.id,r=h({});async function u(){r.value=await S(_,"name desc")}return u(),(K,L)=>{const c=d("router-link"),p=d("router-view");return j(),g(x,null,[e(I,{back:`/icons/${n(_)}`},null,8,["back"]),e(k),s("div",V,[s("div",B,[e(c,{class:"item","active-class":"active",to:"./source"},{default:a(()=>[C,s("span",null,o(n(i)("iconSource")),1)]),_:1}),e(c,{class:"item","active-class":"active",to:"./group"},{default:a(()=>[H,s("span",null,o(n(i)("iconGroup")),1)]),_:1}),e(c,{class:"item","active-class":"active",to:"./info"},{default:a(()=>[U,s("span",null,o(n(i)("projectInfo")),1)]),_:1}),e(c,{class:"item","active-class":"active",to:"./member"},{default:a(()=>[$,s("span",null,o(n(i)("projectMember")),1)]),_:1}),e(c,{class:"item","active-class":"active",to:"./monitor"},{default:a(()=>[q,s("span",null,o(n(i)("monitor")),1)]),_:1}),e(c,{class:"item","active-class":"active",to:"./advance"},{default:a(()=>[E,s("span",null,o(n(i)("advance")),1)]),_:1})]),s("div",F,[e(c,{to:"./info",class:"flex info"},{default:a(()=>[s("div",N,[s("div",D,[s("div",G,o(r.value.name),1),M]),s("div",P,o(r.value.desc),1)]),R]),_:1}),e(p)])]),z],64)}}});var ss=y(A,[["__scopeId","data-v-dc87447e"]]);export{ss as default};