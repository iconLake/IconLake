export default class DefaultTemplate extends HTMLElement{static get observedAttributes(){return["info","nfts","pagination"]}constructor(){super(),this.attachShadow({mode:"open"});var e=document.createDocumentFragment(),t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","/exhibition/default-template-project.css"),e.appendChild(t);let n=document.createElement("div");n.className="info",e.appendChild(n),(n=document.createElement("div")).className="nfts",e.appendChild(n),null!=(t=this.shadowRoot)&&t.appendChild(e)}attributeChangedCallback(e,t,n){if(this.shadowRoot)switch(e){case"info":this.renderInfo(this.shadowRoot,n?JSON.parse(n):null);break;case"nfts":this.renderNfts(this.shadowRoot,n?JSON.parse(n):null)}}renderInfo(e,t){var n,a=null==(a=this.shadowRoot)?void 0:a.querySelector(".info");a&&(a.innerHTML="",(n=document.createElement("div")).style.backgroundImage=`url(${null==t?void 0:t.uri})`,n.className="cover",a.appendChild(n),(a=document.createElement("div")).className="content",n.appendChild(a),(n=document.createElement("h1")).innerText=(null==t?void 0:t.name)||"尚未设置链上信息",a.appendChild(n),null!=t&&t.description&&((n=document.createElement("h2")).innerText=t.description,a.appendChild(n)),(n=document.createElement("h3")).innerText=null!=t&&t.data.author?"Created by "+(null==t?void 0:t.data.author):"",a.appendChild(n))}renderNfts(e,t){var n=null==(n=this.shadowRoot)?void 0:n.querySelector(".nfts");if(n){n.innerHTML="";const a=document.createElement("div");a.className="nfts-container",n.appendChild(a),t.forEach(e=>{this.renderNft(a,e)})}}renderNft(e,t){var n=document.createElement("a"),a=(n.href=`/exhibition/${encodeURIComponent(t.classId)}/`+encodeURIComponent(t.id),n.className="nft",document.createElement("div"));a.className="nft-cover",n.appendChild(a);let d=document.createElement("div");d.className="nft-img",d.style.backgroundImage=`url(${t.uri})`,a.appendChild(d),(d=document.createElement("div")).innerText=t.data.name,d.className="nft-name",n.appendChild(d),e.appendChild(n)}}