import{d as x,h as E,C as g,v as y,y as S,o as B,j as D,m as n,x as F,t as a,l as c,A as j,B as C,q as A,s as b}from"./vendor.75eb7f42.js";import{i as w,j as d,f as I,t as p}from"./project.9735a3fd.js";import{_ as N}from"./plugin-vue_export-helper.5a098b48.js";import"./index.ad3f1c83.js";const s=t=>(A("data-v-5267b243"),t=t(),b(),t),O={class:"monitor"},k=s(()=>n("i",{class:"iconfont icon-copy"},null,-1)),R={class:"function section"},M=s(()=>n("p",null,"funcation spider\uFF08\uFF09{",-1)),$=s(()=>n("p",null,"const list=[]",-1)),q={class:"flex"},U=s(()=>n("textarea",{readonly:""},`
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
})`,-1)),V=s(()=>n("p",null,"return list;",-1)),z=s(()=>n("p",null,"}",-1)),G={class:"operate flex center"},J=x({setup(t){const{t:o}=E(),i=g().params.id,e=y({isOn:!1,spider:""}),u=S(()=>`${location.origin}/visit/monitor/${i}.js`);async function _(){const l=await w(i,"monitor");e.value=l.monitor}_();function m(){e.value.isOn=!e.value.isOn,d(i,{isOn:e.value.isOn})}function f(){I(u.value),p(o("copyDone"))}async function v(){await d(i,{spider:e.value.spider}),p(o("saveDone"))}return(l,r)=>(B(),D("div",O,[n("div",null,[n("div",{class:F(["switch",{off:!e.value.isOn}]),onClick:m},null,2)]),n("p",null,a(c(o)("monitorUsingGuide")),1),n("div",{class:"file flex section",onClick:f},[n("span",null,a(c(u)),1),k]),n("p",null,a(c(o)("iconFindFunction")),1),n("div",R,[n("div",null,[M,$,n("p",q,[j(n("textarea",{class:"m-right",placeholder:"\u4E0D\u586B\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6293\u53D6\u65B9\u6CD5","onUpdate:modelValue":r[0]||(r[0]=h=>e.value.spider=h)},null,512),[[C,e.value.spider]]),U]),V,z]),n("div",G,[n("button",{class:"btn",onClick:v},a(c(o)("save")),1)])])]))}});var Q=N(J,[["__scopeId","data-v-5267b243"]]);export{Q as default};
