import{d as E,u as x,B as y,n as S,v as g,c as B,b as n,s as D,t as c,e as a,y as F,z as b,o as C,p as w,j as A}from"./index.44bd5203.js";import{i as j,j as d,f as I,t as p}from"./project.10559182.js";import{_ as N}from"./_plugin-vue_export-helper.cdc0426e.js";const s=t=>(w("data-v-93eeb7b7"),t=t(),A(),t),O={class:"monitor"},k=s(()=>n("i",{class:"iconfont icon-copy"},null,-1)),M={class:"function section"},R=s(()=>n("p",null,"funcation spider\uFF08\uFF09{",-1)),$=s(()=>n("p",null,"const list=[]",-1)),z={class:"flex"},U=s(()=>n("textarea",{readonly:""},`
/** 
 * \u6CE8\uFF1A\u4EE5\u4E0B\u4EE3\u7801\u4E3A\u9ED8\u8BA4\u6293\u53D6\u65B9\u6CD5\u3002
 *
 * list\u5143\u7D20\u7684\u6570\u636E\u7C7B\u578B\u4E3A\uFF1A
 *   elem: Element
 *   code: String
 *   prefix: String
 *   className: String
 */
const className = 'iconfont'
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
      className
    })
  }
})`,-1)),V=s(()=>n("p",null,"return list;",-1)),q=s(()=>n("p",null,"}",-1)),G={class:"operate flex center"},J=E({__name:"Monitor",setup(t){const{t:o}=x(),i=y().params.id,e=S({isOn:!1,spider:""}),u=g(()=>`${location.origin}/visit/monitor/${i}.js`);async function _(){const l=await j(i,"monitor");e.value=l.monitor}_();function m(){e.value.isOn=!e.value.isOn,d(i,{isOn:e.value.isOn})}function f(){I(u.value),p(o("copyDone"))}async function v(){await d(i,{spider:e.value.spider}),p(o("saveDone"))}return(l,r)=>(C(),B("div",O,[n("div",null,[n("div",{class:D(["switch",{off:!e.value.isOn}]),onClick:m},null,2)]),n("p",null,c(a(o)("monitorUsingGuide")),1),n("div",{class:"file flex section",onClick:f},[n("span",null,c(a(u)),1),k]),n("p",null,c(a(o)("iconFindFunction")),1),n("div",M,[n("div",null,[R,$,n("p",z,[F(n("textarea",{class:"m-right",placeholder:"\u4E0D\u586B\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6293\u53D6\u65B9\u6CD5","onUpdate:modelValue":r[0]||(r[0]=h=>e.value.spider=h)},null,512),[[b,e.value.spider]]),U]),V,q]),n("div",G,[n("button",{class:"btn",onClick:v},c(a(o)("save")),1)])])]))}});const L=N(J,[["__scopeId","data-v-93eeb7b7"]]);export{L as default};
