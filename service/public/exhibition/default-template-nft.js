export default class DefaultTemplate extends HTMLElement{static get observedAttributes(){return["info"]}constructor(){super(),this.attachShadow({mode:"open"});var e=document.createDocumentFragment(),t=document.createElement("link"),t=(t.setAttribute("rel","stylesheet"),t.setAttribute("href","/exhibition/default-template-nft.css"),e.appendChild(t),document.createElement("div"));t.className="info",e.appendChild(t),null!=(t=this.shadowRoot)&&t.appendChild(e)}attributeChangedCallback(e,t,n){this.shadowRoot&&"info"===e&&this.renderInfo(this.shadowRoot,n?JSON.parse(n):null)}renderInfo(e,t){var n,a,d=null==(d=this.shadowRoot)?void 0:d.querySelector(".info");d&&(d.innerHTML="",(n=new Image).src=null!=(a=null==t?void 0:t.uri)?a:"",d.appendChild(n),(a=document.createElement("h1")).innerText=null!=(n=null==t?void 0:t.data.name)?n:"",d.appendChild(a),null!=t&&t.data.description&&((n=document.createElement("h2")).innerText=t.data.description,d.appendChild(n)),(a=document.createElement("h3")).innerText=null!=t&&t.data.author?"Created by "+(null==t?void 0:t.data.author):"",d.appendChild(a),e.appendChild(d))}}