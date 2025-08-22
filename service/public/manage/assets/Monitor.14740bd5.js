import{d as g,u as _,E as x,m as y,p as D,o as B,c as C,b as n,q as S,t as i,e as l,B as A,C as F,i as k,k as b,_ as w}from"./index.c3ac6b9b.js";import{p as M,h as c}from"./project.3e053923.js";import{t as a,i as O}from"./cache.05004cf3.js";import"./@iconlake/client.0b258216.js";import"./extension.dbd15d4c.js";const j={class:"monitor"},N={class:"function section"},R={class:"flex"},$={class:"operate flex center"},I=g({__name:"Monitor",setup(U){const{t:e}=_(),p=k(),t=x().params.id,o=y({isOn:!1,spider:""}),u=D(()=>`${location.origin}/visit/monitor/${t}.js`);async function d(){M.info(t,"monitor").onUpdate(async r=>{o.value=r.monitor})}B(()=>{d().finally(()=>{p.end()})});async function m(){o.value.isOn=!o.value.isOn,await c(t,{isOn:o.value.isOn}),a(e("saveDone"))}function f(){O(u.value),a(e("copyDone"))}async function v(){await c(t,{spider:o.value.spider}),a(e("saveDone"))}return(r,s)=>(b(),C("div",j,[n("div",null,[n("div",{class:S(["switch",{off:!o.value.isOn}]),onClick:m},null,2)]),n("p",null,i(l(e)("monitorUsingGuide")),1),n("div",{class:"file flex section",onClick:f},[n("span",null,i(u.value),1),s[1]||(s[1]=n("i",{class:"iconfont icon-copy"},null,-1))]),n("p",null,i(l(e)("iconFindFunction")),1),n("div",N,[n("div",null,[s[3]||(s[3]=n("p",null,"funcation spider() {",-1)),s[4]||(s[4]=n("p",null,"const list=[]",-1)),n("p",R,[A(n("textarea",{"onUpdate:modelValue":s[0]||(s[0]=E=>o.value.spider=E),class:"m-right",placeholder:"\u4E0D\u586B\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6293\u53D6\u65B9\u6CD5"},null,512),[[F,o.value.spider]]),s[2]||(s[2]=n("textarea",{readonly:""},`/** 
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
})`,-1))]),s[5]||(s[5]=n("p",null,"return list;",-1)),s[6]||(s[6]=n("p",null,"}",-1))]),n("div",$,[n("button",{class:"btn",onClick:v},i(l(e)("save")),1)])])]))}});const J=w(I,[["__scopeId","data-v-e4157a4b"]]);export{J as default};
