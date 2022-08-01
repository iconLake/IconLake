import{d as x,h as E,C as y,v as S,y as g,o as B,j as D,m as e,x as F,t as a,l as c,A as j,B as C,q as A,s as w}from"./vendor.75eb7f42.js";import{i as b,j as p,f as k,t as d}from"./project.90d58fa9.js";import{_ as I}from"./plugin-vue_export-helper.5a098b48.js";import"./index.f69bfaca.js";const s=t=>(A("data-v-f8506210"),t=t(),w(),t),N={class:"monitor"},O=s(()=>e("i",{class:"iconfont icon-copy"},null,-1)),R={class:"function section"},M=s(()=>e("p",null,"funcation spider\uFF08\uFF09{",-1)),$=s(()=>e("p",null,"const list=[]",-1)),q={class:"flex"},U=s(()=>e("textarea",{readonly:""},`
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
})`,-1)),V=s(()=>e("p",null,"return list;",-1)),z=s(()=>e("p",null,"}",-1)),G={class:"operate flex center"},J=x({setup(t){const{t:o}=E(),i=y().params.id,n=S({isOn:!1,spider:""}),u=g(()=>`https://iconlake.com/visit/monitor/${i}.js`);async function _(){const l=await b(i,"monitor");n.value=l.monitor}_();function f(){n.value.isOn=!n.value.isOn,p(i,{isOn:n.value.isOn})}function m(){k(u.value),d(o("copyDone"))}async function v(){await p(i,{spider:n.value.spider}),d(o("saveDone"))}return(l,r)=>(B(),D("div",N,[e("div",null,[e("div",{class:F(["switch",{off:!n.value.isOn}]),onClick:f},null,2)]),e("p",null,a(c(o)("monitorUsingGuide")),1),e("div",{class:"file flex section",onClick:m},[e("span",null,a(c(u)),1),O]),e("p",null,a(c(o)("iconFindFunction")),1),e("div",R,[e("div",null,[M,$,e("p",q,[j(e("textarea",{class:"m-right",placeholder:"\u4E0D\u586B\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6293\u53D6\u65B9\u6CD5","onUpdate:modelValue":r[0]||(r[0]=h=>n.value.spider=h)},null,512),[[C,n.value.spider]]),U]),V,z]),e("div",G,[e("button",{class:"btn",onClick:v},a(c(o)("save")),1)])])]))}});var Q=I(J,[["__scopeId","data-v-f8506210"]]);export{Q as default};
