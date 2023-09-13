export default class DefaultTemplate extends HTMLElement{static get observedAttributes(){return["info","nfts","pagination"]}constructor(){super(),this.attachShadow({mode:"open"});var e=document.createDocumentFragment(),t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./default-template-project.css"),e.appendChild(t);let n=document.createElement("div");n.className="info",e.appendChild(n),(n=document.createElement("div")).className="nfts",e.appendChild(n),null!=(t=this.shadowRoot)&&t.appendChild(e)}attributeChangedCallback(e,t,n){if(this.shadowRoot)switch(e){case"info":this.renderInfo(this.shadowRoot,n?JSON.parse(n):null);break;case"nfts":this.renderNfts(this.shadowRoot,n?JSON.parse(n):null)}}renderInfo(e,t){var n,a,d,l=null==(l=this.shadowRoot)?void 0:l.querySelector(".info");l&&(l.innerHTML="",(d=document.createElement("div")).style.backgroundImage=`url(${null==t?void 0:t.uri})`,d.className="cover",l.appendChild(d),(n=document.createElement("div")).className="content",d.appendChild(n),(d=document.createElement("h1")).innerText=null!=(a=null==t?void 0:t.name)?a:"",n.appendChild(d),null!=t&&t.description&&((a=document.createElement("h2")).innerText=t.description,n.appendChild(a)),(d=document.createElement("h3")).innerText=null!=t&&t.data.author?"Created by "+(null==t?void 0:t.data.author):"",n.appendChild(d),e.appendChild(l))}renderNfts(e,t){var n=null==(n=this.shadowRoot)?void 0:n.querySelector(".nfts");if(n){n.innerHTML="";const a=document.createElement("div");a.className="nfts-container",n.appendChild(a),t.forEach(e=>{this.renderNft(a,e)}),e.appendChild(n)}}renderNft(e,t){var n=document.createElement("a"),a=(n.href=`/exhibition/${encodeURIComponent(t.class_id)}/`+encodeURIComponent(t.id),n.className="nft",document.createElement("div")),a=(a.className="nft-img",a.style.backgroundImage=`url(${t.uri})`,n.appendChild(a),document.createElement("div"));a.innerText=t.data.name,a.className="nft-name",n.appendChild(a),e.appendChild(n)}}