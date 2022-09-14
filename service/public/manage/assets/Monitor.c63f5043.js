import{d as E,u as x,B as y,n as S,v as g,c as B,b as n,s as D,t as a,e as c,y as F,z as C,o as w,p as A,j}from"./index.36adfcd8.js";import{i as I,j as d,f as N,t as p}from"./project.56d81f18.js";import{_ as O}from"./_plugin-vue_export-helper.cdc0426e.js";const e=t=>(A("data-v-5a4d468e"),t=t(),j(),t),k={class:"monitor"},M=e(()=>n("i",{class:"iconfont icon-copy"},null,-1)),R={class:"function section"},b=e(()=>n("p",null,"funcation spider\uFF08\uFF09{",-1)),$=e(()=>n("p",null,"const list=[]",-1)),z={class:"flex"},U=e(()=>n("textarea",{readonly:""},`
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
})`,-1)),V=e(()=>n("p",null,"return list;",-1)),q=e(()=>n("p",null,"}",-1)),G={class:"operate flex center"},J=E({__name:"Monitor",setup(t){const{t:o}=x(),i=y().params.id,s=S({isOn:!1,spider:""}),u=g(()=>`${location.origin}/visit/monitor/${i}.js`);async function _(){const l=await I(i,"monitor");s.value=l.monitor}_();function m(){s.value.isOn=!s.value.isOn,d(i,{isOn:s.value.isOn})}function f(){N(u.value),p(o("copyDone"))}async function v(){await d(i,{spider:s.value.spider}),p(o("saveDone"))}return(l,r)=>(w(),B("div",k,[n("div",null,[n("div",{class:D(["switch",{off:!s.value.isOn}]),onClick:m},null,2)]),n("p",null,a(c(o)("monitorUsingGuide")),1),n("div",{class:"file flex section",onClick:f},[n("span",null,a(c(u)),1),M]),n("p",null,a(c(o)("iconFindFunction")),1),n("div",R,[n("div",null,[b,$,n("p",z,[F(n("textarea",{class:"m-right",placeholder:"\u4E0D\u586B\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6293\u53D6\u65B9\u6CD5","onUpdate:modelValue":r[0]||(r[0]=h=>s.value.spider=h)},null,512),[[C,s.value.spider]]),U]),V,q]),n("div",G,[n("button",{class:"btn",onClick:v},a(c(o)("save")),1)])])]))}});const L=O(J,[["__scopeId","data-v-5a4d468e"]]);export{L as default};
