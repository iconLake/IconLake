var __awaiter=this&&this.__awaiter||function(e,c,r,d){return new(r=r||Promise)(function(n,i){function t(e){try{a(d.next(e))}catch(e){i(e)}}function o(e){try{a(d.throw(e))}catch(e){i(e)}}function a(e){var i;e.done?n(e.value):((i=e.value)instanceof r?i:new r(function(e){e(i)})).then(t,o)}a((d=d.apply(e,c||[])).next())})};__awaiter(void 0,void 0,void 0,function*(){var i=window.iconlakeAPI;if(i){var n=document.querySelector("iconlake-exhibition");if(n){var t=yield i.project.getInfo();if(t){t=yield fetch(`/api/blacklist/verify/project?address=${t.data.author}&projectId=`+i.project.id).then(e=>e.json()).catch(console.error);if(!t.error){if(t.block.projectId){if(!(yield fetch("/api/admin/info/verify").then(e=>e.json()).then(e=>e.isAdmin)))return n.innerHTML='<h1 class="blocked">This project has been blocked.</h1>',void(i.loading.isShow=!1);var o=document.createElement("div");let e="项目";t.block.address&&(e="作者"),o.innerText="封:"+e,o.className="blocked-admin",document.body.appendChild(o)}let e="/themes/default/components/exhibition-640cdf73.js";t=new URL(location.href);t.searchParams.has("theme")&&(o=t.searchParams.get("theme"))&&(e=o),import(e).then(e=>{customElements.define("iconlake-exhibition",e.default)})}}else n.innerHTML='<h1 class="blocked">This project has not been published to the chain.</h1>',i.loading.isShow=!1}}else console.error("window.iconlakeAPI is not defined")}),"#admin"===location.hash&&fetch("/api/admin/info/verify").then(e=>e.json()).then(e=>{e.isAdmin&&((e=document.createElement("script")).src="/admin/blacklist/init.js",document.body.appendChild(e))});