import{d as E,u as x,B as y,n as D,v as S,c as g,b as n,s as B,t as c,e as a,y as F,z as C,o as w,p as b,j as A}from"./index.77f205ff.js";import{i as j,j as p,t as u,f as k}from"./project.b53e4df9.js";import{_ as I}from"./_plugin-vue_export-helper.cdc0426e.js";const o=t=>(b("data-v-bf50dcd6"),t=t(),A(),t),O={class:"monitor"},M=o(()=>n("i",{class:"iconfont icon-copy"},null,-1)),N={class:"function section"},R=o(()=>n("p",null,"funcation spider\uFF08\uFF09{",-1)),$=o(()=>n("p",null,"const list=[]",-1)),z={class:"flex"},U=o(()=>n("textarea",{readonly:""},`
/** 
 * \u6CE8\uFF1A\u4EE5\u4E0B\u4EE3\u7801\u4E3A\u9ED8\u8BA4\u6293\u53D6\u65B9\u6CD5\u3002
 *
 * list\u5143\u7D20\u7684\u6570\u636E\u7C7B\u578B\u4E3A\uFF1A
 *   elem: Element
 *   code: String
 *   prefix: String
 *   class: String
 */
const className = 'iconlake'
const prefix = 'icon-'
const iconReg = new RegExp(\`\${prefix}(\\\\S+)\`, 'i')
document.body.querySelectorAll(\`.\${className}\`).forEach(elem => {
  const m = elem.className.match(iconReg)
  const code = m ? m[1] : null
  if (code) {
    list.push({
      elem,
      code,
      prefix,
      class: className
    })
  }
})`,-1)),V=o(()=>n("p",null,"return list;",-1)),q=o(()=>n("p",null,"}",-1)),G={class:"operate flex center"},J=E({__name:"Monitor",setup(t){const{t:e}=x(),i=y().params.id,s=D({isOn:!1,spider:""}),l=S(()=>`${location.origin}/visit/monitor/${i}.js`);async function _(){const r=await j(i,"monitor");s.value=r.monitor}_();async function m(){s.value.isOn=!s.value.isOn,await p(i,{isOn:s.value.isOn}),u(e("saveDone"))}function f(){k(l.value),u(e("copyDone"))}async function v(){await p(i,{spider:s.value.spider}),u(e("saveDone"))}return(r,d)=>(w(),g("div",O,[n("div",null,[n("div",{class:B(["switch",{off:!s.value.isOn}]),onClick:m},null,2)]),n("p",null,c(a(e)("monitorUsingGuide")),1),n("div",{class:"file flex section",onClick:f},[n("span",null,c(a(l)),1),M]),n("p",null,c(a(e)("iconFindFunction")),1),n("div",N,[n("div",null,[R,$,n("p",z,[F(n("textarea",{class:"m-right",placeholder:"\u4E0D\u586B\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6293\u53D6\u65B9\u6CD5","onUpdate:modelValue":d[0]||(d[0]=h=>s.value.spider=h)},null,512),[[C,s.value.spider]]),U]),V,q]),n("div",G,[n("button",{class:"btn",onClick:v},c(a(e)("save")),1)])])]))}});const L=I(J,[["__scopeId","data-v-bf50dcd6"]]);export{L as default};
