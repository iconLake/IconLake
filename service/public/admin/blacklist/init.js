var __awaiter=this&&this.__awaiter||function(t,a,l,d){return new(l=l||Promise)(function(o,e){function n(t){try{i(d.next(t))}catch(t){e(t)}}function r(t){try{i(d.throw(t))}catch(t){e(t)}}function i(t){var e;t.done?o(t.value):((e=t.value)instanceof l?e:new l(function(t){t(e)})).then(n,r)}i((d=d.apply(t,a||[])).next())})};(()=>{const n=document.createElement("div");n.style.position="fixed",n.style.left="0",n.style.right="0",n.style.bottom="0",n.style.zIndex="999",n.style.display="flex",n.style.justifyContent="center",n.style.alignItems="center",n.style.gap="1rem",n.style.backgroundColor="rgba(0,0,0,0.5)",n.style.color="#fff",n.style.padding="1rem",document.body.appendChild(n);var t=(t,e)=>{const o=document.createElement("button");o.innerText=t,o.onclick=()=>__awaiter(this,void 0,void 0,function*(){o.disabled=!0,yield e(),o.disabled=!1}),n.appendChild(o)},e=()=>{var t=document.createElement("div");t.style.width="1rem",t.style.height="1rem",n.appendChild(t)};const o=()=>{var t,e;let o={};try{o=JSON.parse(null!=(e=null==(t=document.querySelector("iconlake-nft"))?void 0:t.getAttribute("info"))?e:"{}")}catch(t){console.error(t),alert("无法解析信息")}return o};t("封禁作者",()=>__awaiter(this,void 0,void 0,function*(){var t=prompt("作者账户地址:",null!=(t=null==(t=o().data)?void 0:t.author)?t:"");t&&((t=yield fetch("/api/admin/blacklist/add",{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8"},body:JSON.stringify({address:t})}).then(t=>t.json())).error?alert(t.error):location.reload())})),t("解封作者",()=>__awaiter(this,void 0,void 0,function*(){var t=prompt("作者账户地址:",null!=(t=null==(t=o().data)?void 0:t.author)?t:"");t&&((t=yield fetch("/api/admin/blacklist/del",{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8"},body:JSON.stringify({address:t})}).then(t=>t.json())).error?alert(t.error):location.reload())})),e(),t("封禁项目",()=>__awaiter(this,void 0,void 0,function*(){var t=prompt("项目ID:",null!=(t=o().classId)?t:"");t&&((t=yield fetch("/api/admin/blacklist/add",{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8"},body:JSON.stringify({projectId:t})}).then(t=>t.json())).error?alert(t.error):location.reload())})),t("解封项目",()=>__awaiter(this,void 0,void 0,function*(){var t=prompt("项目ID:",null!=(t=o().classId)?t:"");t&&((t=yield fetch("/api/admin/blacklist/del",{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8"},body:JSON.stringify({projectId:t})}).then(t=>t.json())).error?alert(t.error):location.reload())})),e(),t("封禁NFT",()=>__awaiter(this,void 0,void 0,function*(){var t,e=prompt("项目ID:",null!=(e=o().classId)?e:"");e&&(t=prompt("NFT ID:",null!=(t=o().id)?t:""))&&((e=yield fetch("/api/admin/blacklist/add",{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8"},body:JSON.stringify({projectId:e,nftId:t})}).then(t=>t.json())).error?alert(e.error):location.reload())})),t("解封NFT",()=>__awaiter(this,void 0,void 0,function*(){var t,e=prompt("项目ID:",null!=(e=o().classId)?e:"");e&&(t=prompt("NFT ID:",null!=(t=o().id)?t:""))&&((e=yield fetch("/api/admin/blacklist/del",{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8"},body:JSON.stringify({projectId:e,nftId:t})}).then(t=>t.json())).error?alert(e.error):location.reload())}))})();