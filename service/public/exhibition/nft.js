var __awaiter=this&&this.__awaiter||function(t,a,f,s){return new(f=f||Promise)(function(e,n){function o(t){try{c(s.next(t))}catch(t){n(t)}}function i(t){try{c(s.throw(t))}catch(t){n(t)}}function c(t){var n;t.done?e(t.value):((n=t.value)instanceof f?n:new f(function(t){t(n)})).then(o,i)}c((s=s.apply(t,a||[])).next())})};__awaiter(this,void 0,void 0,function*(){var t=!/test|localhost|127\.0\.0\.1/i.test(location.href)?"https://lcd.iconlake.com":"https://lcd.testnet.iconlake.com",n=location.pathname.split("/"),e=n[2];if(e){n=n[3];if(n){const o=document.querySelector("iconlake-nft");fetch(t+`/cosmos/nft/v1beta1/nfts/${e}/`+n).then(t=>t.json()).then(t=>{null!==o&&void 0!==o&&o.setAttribute("info",JSON.stringify(t.nft))}).catch(console.error),import("./default-template-nft.js").then(t=>{customElements.define("iconlake-nft",t.default)})}}});