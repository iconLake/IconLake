import{d as x,h as E,E as y,x as S,z as g,o as j,j as B,m as e,y as D,t as a,l as c,B as F,C,q as b,s as w}from"./vendor.feadc916.js";import{i as A,j as d}from"./project.5df9f40d.js";import{d as k,t as p}from"./request.a1189ab9.js";import{_ as I}from"./plugin-vue_export-helper.5a098b48.js";import"./index.042c82b6.js";const n=t=>(b("data-v-5fdbac14"),t=t(),w(),t),N={class:"monitor"},O=n(()=>e("i",{class:"iconfont icon-copy"},null,-1)),R={class:"function section"},M=n(()=>e("p",null,"funcation spider\uFF08\uFF09{",-1)),q=n(()=>e("p",null,"const list=[]",-1)),$={class:"flex"},z=n(()=>e("textarea",{readonly:""},`
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
})`,-1)),U=n(()=>e("p",null,"return list;",-1)),V=n(()=>e("p",null,"}",-1)),G={class:"operate flex center"},J=x({setup(t){const{t:o}=E(),i=y().params.id,s=S({isOn:!1,spider:""}),u=g(()=>`https://iconlake.com/visit/monitor/${i}.js`);async function m(){const l=await A(i,"monitor");s.value=l.monitor}m();function _(){s.value.isOn=!s.value.isOn,d(i,{isOn:s.value.isOn})}function f(){k(u.value),p(o("copyDone"))}async function v(){await d(i,{spider:s.value.spider}),p(o("saveDone"))}return(l,r)=>(j(),B("div",N,[e("div",null,[e("div",{class:D(["switch",{off:!s.value.isOn}]),onClick:_},null,2)]),e("p",null,a(c(o)("monitorUsingGuide")),1),e("div",{class:"file flex section",onClick:f},[e("span",null,a(c(u)),1),O]),e("p",null,a(c(o)("iconFindFunction")),1),e("div",R,[e("div",null,[M,q,e("p",$,[F(e("textarea",{class:"m-right",placeholder:"\u4E0D\u586B\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6293\u53D6\u65B9\u6CD5","onUpdate:modelValue":r[0]||(r[0]=h=>s.value.spider=h)},null,512),[[C,s.value.spider]]),z]),U,V]),e("div",G,[e("button",{class:"btn",onClick:v},a(c(o)("save")),1)])])]))}});var W=I(J,[["__scopeId","data-v-5fdbac14"]]);export{W as default};
