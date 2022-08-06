import{d as u,u as m,r as g,o as f,c as h,a as $,b as j,e as i,f as y,g as D}from"./vendor.75eb7f42.js";const P=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function c(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerpolicy&&(n.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?n.credentials="include":e.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(e){if(e.ep)return;e.ep=!0;const n=c(e);fetch(e.href,n)}};P();const _="modulepreload",l={},v="/manage/",t=function(s,c){return!c||c.length===0?s():Promise.all(c.map(o=>{if(o=`${v}${o}`,o in l)return;l[o]=!0;const e=o.endsWith(".css"),n=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${n}`))return;const r=document.createElement("link");if(r.rel=e?"stylesheet":_,e||(r.as="script",r.crossOrigin=""),r.href=o,document.head.appendChild(r),e)return new Promise((p,d)=>{r.addEventListener("load",p),r.addEventListener("error",d)})})).then(()=>s())},S=u({setup(a){return m().beforeEach((c,o)=>{c.meta.referer=o.fullPath}),(c,o)=>{const e=g("router-view");return f(),h(e)}}}),I=[{path:"/",redirect:"/home"},{path:"/home",name:"home",component:()=>t(()=>import("./Index.e9440d4c.js"),["assets/Index.e9440d4c.js","assets/Index.7c288b01.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/Icon.62b057e1.js","assets/Icon.c55ecbea.css","assets/plugin-vue_export-helper.5a098b48.js","assets/User.8145e7fc.js","assets/User.54007434.css"])},{path:"/project/create",name:"createProject",component:()=>t(()=>import("./Create.bc3df873.js"),["assets/Create.bc3df873.js","assets/Create.f3c6257e.css","assets/vendor.75eb7f42.js","assets/Header.c4625430.js","assets/Header.e3b0b19b.css","assets/plugin-vue_export-helper.5a098b48.js","assets/project.7d7b5969.js"])},{path:"/project/:id/setting",name:"projectSetting",component:()=>t(()=>import("./Setting.f8932347.js"),["assets/Setting.f8932347.js","assets/Setting.f66be593.css","assets/vendor.75eb7f42.js","assets/User.8145e7fc.js","assets/User.54007434.css","assets/project.7d7b5969.js","assets/plugin-vue_export-helper.5a098b48.js","assets/Header.c4625430.js","assets/Header.e3b0b19b.css"]),redirect:a=>`/project/${a.params.id}/setting/info`,children:[{path:"info",name:"projectInfoSetting",component:()=>t(()=>import("./Info.ebbc7350.js"),["assets/Info.ebbc7350.js","assets/Info.c8276e61.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/plugin-vue_export-helper.5a098b48.js"])},{path:"group",name:"projectGroupSetting",component:()=>t(()=>import("./Group.2d74e42f.js"),["assets/Group.2d74e42f.js","assets/Group.67d07e7e.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/plugin-vue_export-helper.5a098b48.js"])},{path:"member",name:"projectMemberSetting",component:()=>t(()=>import("./Member.e49c88f4.js"),["assets/Member.e49c88f4.js","assets/Member.a21b4ec6.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/plugin-vue_export-helper.5a098b48.js"])},{path:"monitor",name:"projectMonitorSetting",component:()=>t(()=>import("./Monitor.ef2f57bf.js"),["assets/Monitor.ef2f57bf.js","assets/Monitor.cccabd55.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/plugin-vue_export-helper.5a098b48.js"])},{path:"advance",name:"projectAdvanceSetting",component:()=>t(()=>import("./Advance.d7635558.js"),["assets/Advance.d7635558.js","assets/Advance.d89566a4.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/plugin-vue_export-helper.5a098b48.js"])}]},{path:"/icons/:id",name:"icons",component:()=>t(()=>import("./Index.e0f39caa.js"),["assets/Index.e0f39caa.js","assets/Index.4d52c500.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/Icon.62b057e1.js","assets/Icon.c55ecbea.css","assets/plugin-vue_export-helper.5a098b48.js","assets/Header.c4625430.js","assets/Header.e3b0b19b.css","assets/User.8145e7fc.js","assets/User.54007434.css"])},{path:"/icons/:id/create",name:"iconsCreate",component:()=>t(()=>import("./Create.5ef235ce.js"),["assets/Create.5ef235ce.js","assets/Create.cd4331dc.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/Header.c4625430.js","assets/Header.e3b0b19b.css","assets/plugin-vue_export-helper.5a098b48.js","assets/User.8145e7fc.js","assets/User.54007434.css"])},{path:"/icons/:id/use",name:"iconsUse",component:()=>t(()=>import("./Use.22bd3ae4.js"),["assets/Use.22bd3ae4.js","assets/Use.08437753.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/Header.c4625430.js","assets/Header.e3b0b19b.css","assets/plugin-vue_export-helper.5a098b48.js","assets/User.8145e7fc.js","assets/User.54007434.css"])},{path:"/project/:id/invite",name:"projectInvite",component:()=>t(()=>import("./Invite.4dede180.js"),["assets/Invite.4dede180.js","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js"])},{path:"/analyse/icon/:projectId/:id",name:"analyseIcon",component:()=>t(()=>import("./Icon.ad9d2a68.js"),["assets/Icon.ad9d2a68.js","assets/Icon.a3f15334.css","assets/User.8145e7fc.js","assets/User.54007434.css","assets/vendor.75eb7f42.js","assets/project.7d7b5969.js","assets/plugin-vue_export-helper.5a098b48.js","assets/Icon.62b057e1.js","assets/Icon.c55ecbea.css","assets/Header.c4625430.js","assets/Header.e3b0b19b.css"])}],C=$({history:j("/manage/"),routes:I,scrollBehavior(a,s,c){return c||{top:0}}}),b="zh-cn",L="zh",G="\u4E2D\u6587",A="en-us",F="en",N="English",E="\u7ACB\u5373\u4F7F\u7528",k="\u767B\u5F55",T="\u6388\u6743",O="\u65B0\u5EFA\u9879\u76EE",w="\u6B22\u8FCE\u4F7F\u7528iconLake\uFF0C\u5FEB\u53BB\u521B\u5EFA\u4F60\u7684\u9879\u76EE\u5427\uFF01",R="\u56FE\u6807\u6E90",V="\u56FE\u6807\u5206\u7EC4",B="\u9879\u76EE\u4FE1\u606F",U="\u9879\u76EE\u6210\u5458",x="\u76D1\u63A7",W="\u9AD8\u7EA7",M="\u53CD\u9988",z="\u9000\u51FA\u767B\u5F55",q="\u8BBE\u7F6E",J="\u540C\u6B65",H="\u540C\u6B65\u5B8C\u6210",K="\u6279\u91CF\u64CD\u4F5C",Q="\u9000\u51FA\u6279\u91CF\u64CD\u4F5C",X="\u6279\u91CF\u5220\u9664",Y="\u6279\u91CF\u5206\u7EC4",Z="\u8BBE\u7F6E{n}\u4E2A\u56FE\u6807\u7684\u5206\u7EC4\u4E3A\uFF1A",ee="\u6279\u91CF\u5206\u7EC4\u6210\u529F",oe="\u540D\u79F0",ne="\u7C7B\u578B",te="\u539F\u540D",ce="\u6E90",re="\u5206\u7EC4",se="\u6DFB\u52A0\u5206\u7EC4",ae="\u65B0\u5EFA\u5206\u7EC4",ie="\u672A\u5206\u7EC4",le="\u786E\u5B9A\u5220\u9664\u5206\u7EC4",pe="\u6807\u7B7E",de="\u63CF\u8FF0",ue="\u5728\u7EBF\u94FE\u63A5",me="\u4FDD\u5B58",ge="\u4FDD\u5B58\u6210\u529F",fe="\u4FDD\u5B58\u5E76\u540C\u6B65",he="\u786E\u5B9A",$e="\u53D6\u6D88",je="\u5220\u9664\u6210\u529F",ye="\u8BF7\u586B\u5199\u9879\u76EE\u540D\u79F0\u548C\u63CF\u8FF0",De="\u9879\u76EE\u540D\u79F0",Pe="\u9879\u76EE\u63CF\u8FF0",_e="\u7ACB\u5373\u521B\u5EFA",ve="\u6B63\u5728\u521B\u5EFA\u9879\u76EE",Se="\u9879\u76EE\u521B\u5EFA\u5B8C\u6210",Ie="\u65B0\u589E\u56FE\u6807\u6E90",Ce="\u5220\u9664\u6E90\u5C06\u5220\u9664\u5173\u8054\u7684\u6240\u6709\u56FE\u6807\uFF0C\u662F\u5426\u5220\u9664\uFF1F",be="\u590D\u5236",Le="\u590D\u5236\u6210\u529F",Ge="\u9080\u8BF7\u94FE\u63A5",Ae="\u786E\u5B9A\u79FB\u9664",Fe="\u7BA1\u7406\u5458",Ne="\u5728\u9875\u9762\u4E0A\u5F15\u5165\u4EE5\u4E0BJS\u6587\u4EF6\u5373\u53EF\u4F7F\u7528\u76D1\u63A7",Ee="\u56FE\u6807\u6293\u53D6\u51FD\u6570",ke="\u6E05\u7A7A\u5B8C\u6210",Te="\u6E05\u7A7A\u9879\u76EE",Oe="\u5220\u9664\u9879\u76EE",we="\u6E05\u7A7A\u6216\u5220\u9664\u9879\u76EE\u5C06\u5BFC\u81F4\u9879\u76EE\u7684\u6240\u6709\u6570\u636E\u6C38\u4E45\u6027\u4E22\u5931\uFF0C\u8BF7\u8C28\u614E\u64CD\u4F5C\uFF01",Re="\u4E3A\u9632\u6B62\u64CD\u4F5C\u9519\u8BEF\uFF0C\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0",Ve="\u586B\u5199\u9879\u76EE\u540D\u79F0",Be="\u9875\u9762\u5F15\u7528\u6570\u91CF",Ue="\u5F15\u7528\u6B21\u6570",xe="\u641C\u7D22",We="\u786E\u5B9A\u5220\u9664{n}\u4E2A\u56FE\u6807\u5417\uFF1F",Me="\u66F4\u65B0\u65F6\u95F4",ze="\u7EDF\u8BA1\u5468\u671F",qe="\u8FD130\u5929",Je="\u88AB\u5F15\u7528\u9875\u9762\u5730\u5740",He="\u8FD4\u56DE",Ke="\u6DFB\u52A0\u56FE\u6807",Qe="\u56FE\u6807\u6837\u5F0F\u524D\u7F00",Xe="\u6807\u8BC6",Ye="\u83B7\u53D6\u4EE3\u7801",Ze="\u91CD\u65B0\u751F\u6210",eo="\u56FE\u6807\u6709\u66F4\u65B0",oo="\u6B63\u5728\u751F\u6210...",no="\u751F\u6210\u5B8C\u6210",to="\u52A0\u8F7D\u4E2D...",co="\u4EE5{type}\u7684\u65B9\u5F0F\u4F7F\u7528\u56FE\u6807",ro="\u5F15\u5165{type}",so="\u663E\u793A\u56FE\u6807",ao="\u7EC4\u4EF6",io="\u7EC4\u4EF6\u6587\u4EF6",lo="Vue\u7EC4\u4EF6",po=" \uFF1A",uo="\u4E0A\u4F20svg",mo="\u5BFC\u5165iconfont",go="\u9009\u62E9{type}\u6587\u4EF6",fo="\u6587\u4EF6\u65E0\u6CD5\u89E3\u6790",ho="\u6587\u4EF6\u52A0\u8F7D\u5931\u8D25",$o="\u8BF7\u9009\u62E9{type}\u6587\u4EF6",jo="\u6CE8\uFF1A\u53EA\u4FDD\u7559\u6700\u8FD1{n}\u6B21\u751F\u6210\u7684\u6587\u4EF6\u3002",yo="\u5168\u9009";var Do={locale:b,lang:L,language:G,otherLocale:A,otherLang:F,otherLanguage:N,useImmediately:E,login:k,auth:T,newProject:O,welcomeAndGuide:w,iconSource:R,iconGroup:V,projectInfo:B,projectMember:U,monitor:x,advance:W,feedback:M,logout:z,setting:q,sync:J,syncDone:H,batchOperation:K,cancelBatchOperation:Q,batchDelete:X,batchGroup:Y,batchSetGroup:Z,batchGroupDone:ee,name:oe,type:ne,oriName:te,source:ce,group:re,addGroup:se,newGroup:ae,ungrouped:ie,delGroupConfirm:le,tag:pe,desc:de,onlineLink:ue,save:me,saveDone:ge,saveAndSync:fe,confirm:he,cancel:$e,delete:"\u5220\u9664",deleteDone:je,fillProjectNameAndDescription:ye,projectName:De,projectDescription:Pe,createNow:_e,creatingProject:ve,creatingProjectDone:Se,addIconSource:Ie,delSourceConfirm:Ce,copy:be,copyDone:Le,inviteLink:Ge,removeConfirm:Ae,admin:Fe,monitorUsingGuide:Ne,iconFindFunction:Ee,cleanDone:ke,cleanProject:Te,deleteProject:Oe,delProjectWarning:we,inputForSafe:Re,fillProjectName:Ve,pageRefererCount:Be,refererCount:Ue,search:xe,batchDeleteConfirm:We,updateTime:Me,statPeriod:ze,last30d:qe,refererPageLink:Je,back:He,createIcons:Ke,class:"CSS\u6837\u5F0F\u540D",prefix:Qe,code:Xe,useCode:Ye,regenerate:Ze,upgradable:eo,generating:oo,generateDone:no,loading:to,useWithType:co,includeType:ro,displayIcon:so,component:ao,componentFile:io,vueComponent:lo,colon:po,uploadSVG:uo,importIconfont:mo,selectIconFile:go,fileCouldNotBeParsed:fo,fileLoadFailed:ho,pleaseSelectFile:$o,generationNote:jo,selectAll:yo};const Po="en-us",_o="en",vo="English",So="zh-cn",Io="zh",Co="\u4E2D\u6587",bo="START",Lo="Login",Go="Auth",Ao="New Project",Fo="Welcome to iconLake, let's make your first project.",No="Icon Sources",Eo="Icon Groups",ko="Information",To="Members",Oo="Monitor",wo="Advance",Ro="Feedback",Vo="Logout",Bo="Setting",Uo="Sync",xo="Sync Done",Wo="Batch Operation",Mo="Exit Batch Operation",zo="Batch Delete",qo="Batch Group",Jo="Set the group of {n} icons as:",Ho="Batch Group Done",Ko="Name",Qo="Type",Xo="Origin",Yo="Source",Zo="Group",en="Add Group",on="New Group",nn="Ungrouped",tn="Do you want to delete group",cn="Tag",rn="Description",sn="Online Link",an="Save",ln="Save Done",pn="Save & Sync",dn="Confirm",un="Cancel",mn="Delete Done",gn="Please fill in the project name and description",fn="Project Name",hn="Project Description",$n="CREATE",jn="Project is creating",yn="Project creation is done",Dn="Add Icon Source",Pn="Deleting the source will cause the icon to not be displayed. Do you want to delete it?",_n="Copy",vn="Copy Done",Sn="Invitation Link",In="Do you want to remove ",Cn="Administrator",bn="Use monitoring by importing the following JS files on the page",Ln="Function of finding out icons",Gn="Clean Done",An="Clean Project",Fn="Delete Project",Nn="Cleaning or deleting the project will delete all related icons. Please be careful!",En="To prevent incorrect operation, please enter the project name",kn="Fill in the project name",Tn="References",On="Reference Count",wn="Search",Rn="Do you want to delete {n} icons?",Vn="Update Time",Bn="Stat Period",Un="Last 30 days",xn="Referenced Page Links",Wn="Back",Mn="Add Icons",zn="Icon Class Prefix",qn="Code",Jn="Get Code",Hn="Regenerate",Kn="Icons have been updated",Qn="Generating...",Xn="Generate Done",Yn="Loading...",Zn="Use Icons As {type}",et="Include {type}",ot="Display Icon",nt="Component",tt="Component File",ct="Vue Component",rt=" : ",st="Upload SVG",at="Import Iconfont",it="Select {type} File",lt="File Could Not Be Parsed",pt="File Load Failed",dt="Please Select {type} File",ut="Note: only the last {n} generated files are retained.",mt="Select All";var gt={locale:Po,lang:_o,language:vo,otherLocale:So,otherLang:Io,otherLanguage:Co,useImmediately:bo,login:Lo,auth:Go,newProject:Ao,welcomeAndGuide:Fo,iconSource:No,iconGroup:Eo,projectInfo:ko,projectMember:To,monitor:Oo,advance:wo,feedback:Ro,logout:Vo,setting:Bo,sync:Uo,syncDone:xo,batchOperation:Wo,cancelBatchOperation:Mo,batchDelete:zo,batchGroup:qo,batchSetGroup:Jo,batchGroupDone:Ho,name:Ko,type:Qo,oriName:Xo,source:Yo,group:Zo,addGroup:en,newGroup:on,ungrouped:nn,delGroupConfirm:tn,tag:cn,desc:rn,onlineLink:sn,save:an,saveDone:ln,saveAndSync:pn,confirm:dn,cancel:un,delete:"Delete",deleteDone:mn,fillProjectNameAndDescription:gn,projectName:fn,projectDescription:hn,createNow:$n,creatingProject:jn,creatingProjectDone:yn,addIconSource:Dn,delSourceConfirm:Pn,copy:_n,copyDone:vn,inviteLink:Sn,removeConfirm:In,admin:Cn,monitorUsingGuide:bn,iconFindFunction:Ln,cleanDone:Gn,cleanProject:An,deleteProject:Fn,delProjectWarning:Nn,inputForSafe:En,fillProjectName:kn,pageRefererCount:Tn,refererCount:On,search:wn,batchDeleteConfirm:Rn,updateTime:Vn,statPeriod:Bn,last30d:Un,refererPageLink:xn,back:Wn,createIcons:Mn,class:"CSS Class",prefix:zn,code:qn,useCode:Jn,regenerate:Hn,upgradable:Kn,generating:Qn,generateDone:Xn,loading:Yn,useWithType:Zn,includeType:et,displayIcon:ot,component:nt,componentFile:tt,vueComponent:ct,colon:rt,uploadSVG:st,importIconfont:at,selectIconFile:it,fileCouldNotBeParsed:lt,fileLoadFailed:pt,pleaseSelectFile:dt,generationNote:ut,selectAll:mt};function ft(a){return/^(zh-cn|en-us)$/.test(a)}const ht=ft(i.get("locale"))?i.get("locale"):"zh-cn",$t={"zh-cn":Do,"en-us":gt},jt=y({locale:ht,fallbackLocale:"zh-cn",messages:$t});D(S).use(C).use(jt).mount("#app");export{ht as l,$t as m,C as r};
