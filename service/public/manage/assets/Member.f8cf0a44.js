import{d as k,h as b,C as j,v as u,y as F,o,j as i,m as e,t as p,l as v,E as M,F as B,p as L,q as D,s as V,n as h}from"./vendor.75eb7f42.js";import{i as $,g as z,u as S,f as E,t as H,b as N,h as q}from"./project.972f377c.js";import{_ as A}from"./plugin-vue_export-helper.5a098b48.js";import"./index.ffae3db0.js";const g=a=>(D("data-v-d43298c6"),a=a(),V(),a),P={class:"member"},R={class:"invite flex start"},T=g(()=>e("div",{class:"m-right"},[e("svg",{t:"1640187477633",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"8789",width:"32",height:"32"},[e("path",{d:"M515.7888 690.3296L860.2624 486.4V162.7136c0-48.1792-37.9392-87.2448-84.6848-87.2448H256c-46.7968 0-84.6848 39.0656-84.6848 87.2448V486.4l344.4736 203.9296z",fill:"#FFE37B","p-id":"8790"}),e("path",{d:"M890.6752 454.7584l-363.3664 228.3008c-7.0656 4.4032-16.0256 4.4032-23.04 0L140.9024 454.7584c-17.8688-11.264-40.192 2.8672-40.192 25.4464v319.7952c0 84.8384 62.8736 153.6 140.4416 153.6h549.2736c77.568 0 140.4416-68.7616 140.4416-153.6V480.2048c0-22.528-22.3232-36.6592-40.192-25.4464zM661.8624 270.592H323.072c-28.2624 0-51.2-22.9376-51.2-51.2s22.9376-51.2 51.2-51.2h338.7392c28.2624 0 51.2 22.9376 51.2 51.2s-22.8864 51.2-51.1488 51.2z",fill:"#8C7BFD","p-id":"8791"}),e("path",{d:"M515.7888 449.536H323.072c-28.2624 0-51.2-22.9376-51.2-51.2s22.9376-51.2 51.2-51.2h192.7168c28.2624 0 51.2 22.9376 51.2 51.2s-22.9376 51.2-51.2 51.2z",fill:"#8C7BFD","p-id":"8792"})])],-1)),U=g(()=>e("i",{class:"iconfont icon-copy m-left"},null,-1)),G={class:"list"},J=["title"],K=["onClick"],O=k({setup(a){const{t:c}=b(),s=j().params.id,_=u(""),r=u(""),l=u([]),m=F(()=>`${location.origin}/manage/project/${s}/invite?code=${r.value}`);async function y(){const t=await $(s,"userId invite");_.value=t.userId,t.invite?+new Date(t.invite.expired)-Date.now()<60*1e3?f():r.value=t.invite.code:f()}y();async function w(){l.value=await z(s)}w();async function f(){const t=await S(s);r.value=t.code}function x(){E(m.value),H(c("copyDone"))}function C(t){const d=l.value[t];N(`${c("removeConfirm")}${d.user.name||""}\uFF1F`,()=>{q(s,d._id),l.value.splice(t,1)})}return(t,d)=>(o(),i("div",P,[e("div",R,[T,e("div",null,[e("p",null,p(v(c)("inviteLink")),1),e("p",{class:"c-main pointer",onClick:x},[M(p(v(m)),1),U])])]),e("div",G,[(o(!0),i(B,null,L(l.value,(n,I)=>(o(),i("div",{class:"item flex",key:n._id},[e("span",null,p(n.user.name||n.userId),1),e("div",null,[n.isAdmin?(o(),i("i",{key:0,class:"iconfont icon-admin c-danger",title:v(c)("admin")},null,8,J)):h("",!0),_.value!==n.userId?(o(),i("i",{key:1,class:"iconfont icon-delete c-danger m-left pointer",onClick:W=>C(I)},null,8,K)):h("",!0)])]))),128))])]))}});var te=A(O,[["__scopeId","data-v-d43298c6"]]);export{te as default};
