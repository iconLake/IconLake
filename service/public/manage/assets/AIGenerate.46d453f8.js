import{d as tn,u as sn,m as o,p as z,o as an,I as on,c as y,b as n,t as r,B as A,C as T,v as V,e as d,l as U,F as R,f as I,w as l,a as _,H as rn,j as ln,k as f,_ as cn}from"./index.c3ac6b9b.js";import{L as dn}from"./Loading.7dd0339b.js";import{q,u as vn,i as un,t as pn}from"./cache.05004cf3.js";import{e as P}from"./extension.dbd15d4c.js";import{b as fn}from"./blockchain.62e14144.js";const hn=`<script setup>
import { onMounted, ref } from 'vue';

const info = ref({})
const nfts = ref([])
const isNoTicket = ref(false)
const authParams = iconlakeAPI.auth.getSearchParams()

async function getClassInfo() {
  info.value = await iconlakeAPI.class.getInfo(iconlakeAPI.class.id)
}

async function getNfts() {
  const res = await iconlakeAPI.class.getNfts(iconlakeAPI.class.id)
  if (res.nfts) {
    nfts.value = res.nfts
  } else if (res.error === 'noTicket') {
    isNoTicket.value = true
  }
}

function scrollToNfts() {
  document.querySelector('.list').scrollIntoView({ behavior: 'smooth' })
}

function loadShare() {
  iconlakeAPI.share.load(document.querySelector('.share'), {
    classId: info.value.id
  })
}

onMounted(() => {
  getClassInfo().then(() => {
    iconlakeAPI.loading.isShow = false
    loadShare()
  })
  getNfts()
})
<\/script>

<template>
  <div v-if="info.uri || info.name" class="class" @click="scrollToNfts">
    <div class="cover" :style="\`background-image: url(\${info.uri})\`"></div>
    <div class="title">{{ info.name }}</div>
    <div class="desc">{{ info.description }}</div>
    <div class="author">Created by <a :href="\`/exhibition/creator/\${info.data?.author}\`">{{ info.data?.author }}</a> <span class="share"></span></div>
  </div>
  <div class="list" v-if="nfts.length">
    <a v-for="nft in nfts" class="item" :href="\`/exhibition/\${info.id}/\${nft.id}\${authParams ? '?' + authParams : ''}\`">
      <div class="cover" :style="\`background-image: url(\${nft.uri})\`"></div>
      <p class="title">{{ nft.data?.name }}</p>
    </a>
  </div>
  <div class="no-ticket" v-if="isNoTicket">
    <h1>\u4E91\u95E8\u534A\u63A9\uFF0C\u91D1\u94A5\u672A\u81F3\uFF0C\u6682\u9694\u84EC\u83B1\u70DF\u971E\u3002</h1>
  </div>
</template>

<style lang="scss" scoped>
.class {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-family: sans-serif;
  line-height: 1.8;
  padding: 0 80px;

  .cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
  }

  .title {
    font-size: 50px;
    font-weight: bold;
    position: relative;
  }

  .desc {
    font-size: 18px;
    margin-bottom: 40px;
    position: relative;
  }

  .author {
    font-size: 12px;
    position: absolute;
    left: 0;
    bottom: 20px;
    right: 0;
    text-align: center;

    a {
      color: #fff;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .share {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    cursor: pointer;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  font-family: sans-serif;
}

.item {
  width: 12.5vw;
  text-align: center;
  color: #000;
  margin-bottom: 30px;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  .cover {
    width: 8vw;
    height: 8vw;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0 auto;
  }

  .title {
    margin: 0;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
  }
}

.no-ticket {
  text-align: center;
  padding: 100px 0;
}
</style>

<style lang="scss">
.st-inline-share-buttons {
  .st-btn {
    background-color: transparent !important;
  }
}
</style>`,mn=`<script setup>
import { onMounted, ref } from 'vue';

const info = ref({})
const verifyStatus = ref(2)
const isNoTicket = ref(false)
const authParams = iconlakeAPI.auth.getSearchParams()

async function getNftInfo() {
  const res = await iconlakeAPI.nft.getInfo(iconlakeAPI.nft.id)
  if (res.error === 'noTicket') {
    isNoTicket.value = true
  }
  else {
    info.value = res
  }
}

function loadShare() {
  iconlakeAPI.share.load(document.querySelector('.share'), {
    nftId: info.value.id
  })
}

async function verifyFile() {
  verifyStatus.value = await iconlakeAPI.verifyHash(info.value.uri, info.value.uriHash)
}

onMounted(() => {
  getNftInfo().then(() => {
    iconlakeAPI.loading.isShow = false
    verifyFile()
    loadShare()
  })
})
<\/script>

<template>
  <div class="nft" v-if="info.uri">
    <div class="cover">
      <img :src="info.uri" />
    </div>
    <div class="info">
      <div class="item">
        <div>\u4F5C\u54C1\u540D\uFF1A</div>
        <div>{{info.data?.name}}</div>
      </div>
      <div class="item">
        <div>\u7B80\u3000\u4ECB\uFF1A</div>
        <div>{{info.data?.description}}</div>
      </div>
      <div class="item">
        <div>\u521B\u4F5C\u8005\uFF1A</div>
        <a :href="\`/exhibition/creator/\${info.data?.author}\`">{{info.data?.author}}&nbsp;
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="9" height="9"
            fill="currentColor">
            <path
              d="M644.87517299 510.17438549l-367.65643436 355.41154361c-21.67800946 20.95381845-21.67800946 54.92445525 0 75.84450789 21.67917341 20.95381845 56.78732743 20.95381845 78.46650084 0L762.59355307 548.07801059c21.67800946-20.95381845 21.67800946-54.92445525 0-75.84450787l-406.90714966-393.31633267c-10.83842219-10.47632669-25.04515129-15.69702571-39.25071531-15.6970257-14.20556402 0-28.41229198 5.22069902-39.21578552 15.73428338-21.67800946 20.95381845-21.67800946 54.88952547 0 75.84450788L644.87517299 510.17438549z">
            </path>
          </svg>
        </a>
      </div>
      <div class="item">
        <div>\u65F6\u3000\u95F4\uFF1A</div>
        <div>{{new Date(+info.data?.createTime).toLocaleString()}}</div>
      </div>
      <div class="item">
        <div>\u7CFB\u3000\u5217\uFF1A</div>
        <a :href="\`/exhibition/\${info.classId}\${authParams ? '?'+ authParams : ''}\`">{{info.classId}}&nbsp;
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="9" height="9"
            fill="currentColor">
            <path
              d="M644.87517299 510.17438549l-367.65643436 355.41154361c-21.67800946 20.95381845-21.67800946 54.92445525 0 75.84450789 21.67917341 20.95381845 56.78732743 20.95381845 78.46650084 0L762.59355307 548.07801059c21.67800946-20.95381845 21.67800946-54.92445525 0-75.84450787l-406.90714966-393.31633267c-10.83842219-10.47632669-25.04515129-15.69702571-39.25071531-15.6970257-14.20556402 0-28.41229198 5.22069902-39.21578552 15.73428338-21.67800946 20.95381845-21.67800946 54.88952547 0 75.84450788L644.87517299 510.17438549z">
            </path>
          </svg>
        </a>
      </div>
      <div class="item">
        <div>\u7F16\u3000\u53F7\uFF1A</div>
        <div>{{info.id}}</div>
      </div>
      <div class="item">
        <div>\u54C8\u5E0C\u503C\uFF1A</div>
        <div>
          {{info.uriHash}}
          <span class="verify-result" v-if="verifyStatus === 2">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12"
              fill="currentColor">
              <path
                d="M515.698 969.127c-97.188 0-191.28-31.134-270.406-90.479C148.62 806.402 85.835 700.441 68.634 580.72s13.245-238.928 85.663-335.6C304.12 45.24 588.288 4.644 787.997 154.125c83.77 62.785 143.46 153.092 168.23 254.58 4.3 17.374-6.365 34.92-23.739 39.048-17.373 4.128-34.918-6.365-39.047-23.738-21.157-86.867-72.418-164.446-144.148-218.286-171.154-127.979-414.898-93.06-543.048 78.094-62.097 82.911-88.243 185.087-73.45 287.608s68.462 193.344 151.372 255.44c171.326 128.323 414.898 93.404 543.22-77.922 33.544-44.895 56.594-95.123 68.29-149.308 3.785-17.373 21.158-28.554 38.36-24.77 17.373 3.784 28.554 20.986 24.77 38.36-13.761 63.473-40.596 122.13-79.815 174.422-72.418 96.672-178.379 159.457-298.1 176.658-21.674 3.268-43.52 4.816-65.194 4.816z">
              </path>
            </svg>
            &nbsp;\u9A8C\u8BC1\u4E2D...
          </span>
          <span class="verify-result passed" v-if="verifyStatus === 1">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor"><path d="M529.066667 481.28V546.133333c40.96-3.413333 68.266667-20.48 68.266666-34.133333 0-6.826667-10.24-23.893333-68.266666-30.72z" fill="" p-id="18955"></path><path d="M512 238.933333c-122.88 0-221.866667 98.986667-221.866667 221.866667S389.12 682.666667 512 682.666667s221.866667-98.986667 221.866667-221.866667S634.88 238.933333 512 238.933333z m17.066667 341.333334v17.066666c0 10.24-6.826667 17.066667-17.066667 17.066667s-17.066667-6.826667-17.066667-17.066667V580.266667c-54.613333-3.413333-98.986667-27.306667-102.4-61.44 0-10.24 6.826667-17.066667 13.653334-20.48 10.24 0 17.066667 6.826667 20.48 13.653333 0 13.653333 27.306667 27.306667 68.266666 30.72v-68.266667c-34.133333-3.413333-102.4-17.066667-102.4-64.853333 0-34.133333 44.373333-61.44 102.4-68.266667v-17.066666c0-10.24 6.826667-17.066667 17.066667-17.066667s17.066667 6.826667 17.066667 17.066667v17.066666c54.613333 3.413333 98.986667 27.306667 102.4 61.44 0 10.24-6.826667 17.066667-13.653334 20.48-10.24 0-17.066667-6.826667-20.48-13.653333 0-13.653333-27.306667-27.306667-68.266666-30.72v68.266667c34.133333 3.413333 102.4 17.066667 102.4 64.853333 0 34.133333-44.373333 61.44-102.4 68.266667z"></path><path d="M426.666667 409.6c0 6.826667 10.24 23.893333 68.266666 30.72V375.466667c-40.96 3.413333-68.266667 20.48-68.266666 34.133333z"></path><path d="M959.146667 136.533333l-443.733334-136.533333h-10.24l-443.733333 136.533333c-6.826667 3.413333-10.24 10.24-10.24 17.066667v467.626667c0 187.733333 296.96 354.986667 457.386667 402.773333h6.826666c160.426667-47.786667 457.386667-215.04 457.386667-402.773333V153.6c0-6.826667-3.413333-13.653333-13.653333-17.066667zM512 716.8c-139.946667 0-256-116.053333-256-256S372.053333 204.8 512 204.8s256 116.053333 256 256S651.946667 716.8 512 716.8z"></path></svg>
            &nbsp;\u9A8C\u8BC1\u901A\u8FC7
          </span>
          <span class="verify-result error" v-if="verifyStatus === 0">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor"><path d="M942.656 769.376 602.112 159.584c-22.144-39.712-55.104-62.496-90.304-62.496-35.232 0-68.16 22.784-90.368 62.528L81.312 769.344c-22.016 39.456-24.256 79.456-6.112 110.4C93.344 910.624 129.664 928 174.88 928l674.24 0c45.184 0 81.536-17.376 99.648-48.256C966.944 848.8 964.672 808.832 942.656 769.376zM480 320c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288c0 17.696-14.336 32-32 32s-32-14.304-32-32L480 320zM512 832.128c-26.528 0-48-21.504-48-48s21.472-48 48-48 48 21.504 48 48S538.528 832.128 512 832.128z"></path></svg>
            &nbsp;\u9A8C\u8BC1\u5931\u8D25
          </span>
          <span class="verify-result error" v-if="verifyStatus === -1">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor"><path d="M942.656 769.376 602.112 159.584c-22.144-39.712-55.104-62.496-90.304-62.496-35.232 0-68.16 22.784-90.368 62.528L81.312 769.344c-22.016 39.456-24.256 79.456-6.112 110.4C93.344 910.624 129.664 928 174.88 928l674.24 0c45.184 0 81.536-17.376 99.648-48.256C966.944 848.8 964.672 808.832 942.656 769.376zM480 320c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288c0 17.696-14.336 32-32 32s-32-14.304-32-32L480 320zM512 832.128c-26.528 0-48-21.504-48-48s21.472-48 48-48 48 21.504 48 48S538.528 832.128 512 832.128z"></path></svg>
            &nbsp;\u65E0\u6CD5\u9A8C\u8BC1
          </span>
        </div>
      </div>
      <div class="item share"></div>
    </div>
  </div>
  <div class="no-ticket" v-if="isNoTicket">
    <h1>\u4E91\u95E8\u534A\u63A9\uFF0C\u91D1\u94A5\u672A\u81F3\uFF0C\u6682\u9694\u84EC\u83B1\u70DF\u971E\u3002</h1>
  </div>
</template>

<style lang="scss" scoped>
.nft {
  height: 100vh;
  display: flex;
  align-items: space-between;
  font-family: sans-serif;
  font-size: 12px;
}

.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  img {
    max-width: 80%;
    max-height: 80%;
  }
}

.info {
  width: 406px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 50px 0 30px;
  line-height: 1.6;
  background-color: #f1f1f1;
  color: #000;

  &>div {
    padding: 0 20px;
    margin: 3px 0;
  }

  .item {
    display: flex;

    :first-child {
      white-space: nowrap;
    }

    :last-child {
      word-break: break-all;
    }

    a {
      color: #000;
      text-decoration: none;
    }

    &.share {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      img {
        height: 32px;
      }

      .st-btn {
        cursor: pointer;
        line-height: 1;
      }
    }
  }

  .verify-result {
    position: relative;
    top: -1px;
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    vertical-align: middle;

    &.passed {
      color: #0DC638;
    }

    &.failed {
      color: #E6354F;
    }

    &.error {
      color: #E6BA35;
    }
  }
}

.no-ticket {
  text-align: center;
  padding: 100px 0;
}
</style>

<style lang="scss">
.st-inline-share-buttons {
  .st-btn {
    background-color: transparent !important;
    line-height: 1 !important;
    img {
      width: 24px !important;
      height: 24px !important;
    }
  }
}
</style>
`,gn=`<script setup>
import { onMounted, ref } from 'vue';

const info = ref({})
const verifyStatus = ref(2)

async function getCreatorInfo() {
  info.value = await iconlakeAPI.creator.getInfo(iconlakeAPI.creator.address)
}

function loadShare() {
  iconlakeAPI.share.config.color = 'gray'
  iconlakeAPI.share.load(document.querySelector('.share'), {
    creator: info.value.address
  })
}

async function verifyFile() {
  verifyStatus.value = await iconlakeAPI.verifyHash(info.value.avatar, info.value.avatarHash)
}

function isLink(url) {
  return url.startsWith('http://') || url.startsWith('https://')
}

onMounted(() => {
  getCreatorInfo().then(() => {
    iconlakeAPI.loading.isShow = false
    // verifyFile()
    loadShare()
  })
})
<\/script>

<template>
  <div class="creator" v-if="info.name">
    <div class="avatar" v-if="info.avatar">
      <img :src="info.avatar" />
    </div>
    <div class="info">
      <div class="item name">{{info.name}}</div>
      <div class="item addr">{{info.address}}</div>
      <div class="item desc" v-if="info.description">{{info.description}}</div>
      <div class="item media-list" v-if="info.medias && info.medias.length">
        <div class="media" v-for="media in info.medias" :key="media.name">
          <a v-if="isLink(media.content)" :href="media.content" target="_blank">{{media.name}}</a>
          <template v-else>
            <span class="media-name">{{ media.name }}: </span>
            <span>{{ media.content }}</span>
          </template>
        </div>
      </div>
      <div class="item share"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: rgba(255, 255, 255, .95);
    z-index: 1;
    display: block;
    transform: rotate(-30deg);
    transform-origin: top right;
  }
}

.info {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  padding: 50px;
  max-width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 15%;
  .name {
    font-size: 30px;
  }
  .desc {
    margin-top: 30px;
    white-space: pre-wrap;
    line-height: 1.4;
  }
  .addr {
    margin-top: 12px;
    font-size: 12px;
    color: #999;
  }
  .media-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 30px;
    a {
      color: #000;
    }
    .media-name {
      font-size: 10px;
      opacity: 0.6;
    }
  }
  .share {
    margin-top: 30px;
  }
}
</style>

<style lang="scss">
.st-inline-share-buttons {
  .st-btn {
    background-color: transparent !important;
    line-height: 1 !important;
    img {
      width: 24px !important;
      height: 24px !important;
    }
  }
}
</style>
`,wn="https://localhost.iconlake.com";async function yn(){var t;if((t=window.iconlake)!=null&&t.isDesktop)return!0;const a=await P.getExtensionInfo();return a==null?void 0:a.isDesktop}let B=0;function H(a){return`${wn}:${a||B}/desktop/api`}async function O(){let a=19090;for(;;){const t=await q({url:"/ping",method:"GET",baseURL:H(a)}).catch(()=>!1);if(t)return B=a,t;if(a+=1,a>19100)throw new Error("ping failed")}}async function bn(){return!!(B||await O().catch(()=>!1))}async function kn(a){return q({url:"/theme/build",method:"POST",baseURL:H(),data:a})}const G={isDesktop:yn,ping:O,isReady:bn,buildTheme:kn},xn={class:"aigenerate"},In={class:"aigenerate-title"},Cn={class:"aigenerate-input"},_n={class:"btn-wrap"},Sn={key:1},zn={class:"aigenerate-codes-wrap"},An={key:0,class:"aigenerate-desc"},Tn={href:"/download",target:"_blank",class:"link"},Pn=["href"],Bn=["href"],$n={key:1,class:"guide"},Ln=["href"],Nn=["href"],jn={key:2,class:"warning"},Dn={class:"c-danger"},Fn={href:"https://nodejs.org/",target:"_blank",class:"link"},Mn={class:"aigenerate-codes-wrap"},En={class:"aigenerate-preview-wrap"},Vn=["src"],Un={class:"aigenerate-footer"},Rn=["href"],Gn=tn({__name:"AIGenerate",props:{onFinish:{type:Function},onCancel:{type:Function},type:{},projectId:{},creatorId:{}},setup(a){const{t}=sn(),s=a,b=o(""),m=o(!1),g=o(!1),v=o(""),c=o(""),C=o(""),$=o(),u=o(!1),p=o(!1),k=o({version:""}),L=o(""),N=o(),j=o(),D=o(),W=z(()=>{switch(s.type){case"class":return t("aiGenerateExhibition");case"nft":return t("aiGenerateNft");case"creator":return t("aiGenerateCreator");default:return""}}),w=z(()=>{switch(s.type){case"class":return"exhibition";case"nft":return"nft";case"creator":return"creator";default:return""}}),F=z(()=>{switch(s.type){case"class":return`/exhibition/${s.projectId}?theme=${encodeURIComponent(C.value)}`;case"nft":return`/exhibition/${s.projectId}/${L.value}?theme=${encodeURIComponent(C.value)}`;case"creator":return`/exhibition/creator/${s.creatorId}?theme=${encodeURIComponent(C.value)}`;default:return""}}),J=async()=>{const i={class:hn,nft:mn,creator:gn}[s.type];b.value=`${i}

${t("redesignAndRequirement")}
1. 
2. `,rn(()=>{$.value.focus()})},K=async()=>{if(m.value)return;m.value=!0,v.value="Coding...",N.value.scrollIntoView({behavior:"smooth"});const i=setInterval(()=>{v.value.length>=100&&clearInterval(i),v.value+="."},1e3),e=await vn.generateTheme({prompt:b.value}).catch(()=>(m.value=!1,{codes:"Error"}));clearInterval(i),m.value=!1,v.value=e.codes,M()},Q=async()=>{if(g.value)return;g.value=!0,c.value="Building...",j.value.scrollIntoView({behavior:"smooth"});const i=setInterval(()=>{c.value.length>=100&&clearInterval(i),c.value+="."},1e3);let e;!u.value&&p.value?e=await G.buildTheme({codes:v.value,type:s.type==="class"?"exhibition":s.type}).catch(()=>(g.value=!1,{codes:"Error"})):e=await P.buildTheme({codes:v.value,type:s.type==="class"?"exhibition":s.type}).catch(()=>(g.value=!1,{codes:"Error"})),clearInterval(i),c.value=e.codes||"Error",g.value=!1,E()},X=async()=>{if(!c.value)return;const i=new Blob([c.value],{type:"text/javascript"});C.value=URL.createObjectURL(i),D.value.scrollIntoView({behavior:"smooth"})},Y=()=>{s.onFinish(c.value)},Z=async()=>{var e;const i=await fn({classId:s.projectId});return((e=i==null?void 0:i.nfts)==null?void 0:e[0].id)||""};function nn(){un(b.value),pn(t("copyDone"))}function M(){!m.value&&v.value&&v.value!=="Error"&&Q()}function E(){!g.value&&c.value&&c.value!=="Error"&&X()}async function S(){var i;if(!p.value&&!u.value)try{const e=await G.ping();p.value=!0,k.value.version=((i=e.nodejs)==null?void 0:i.version)||""}catch{p.value=!1,k.value.version=""}}async function en(){const i=await P.getExtensionInfo();u.value=!!i.isDesktop,u.value&&i.nodejs&&(k.value=i.nodejs),u.value||(S(),window.addEventListener("focus",S))}return an(async()=>{J(),en(),s.type==="nft"&&(L.value=await Z())}),on(()=>{u.value||window.removeEventListener("focus",S)}),(i,e)=>{const x=ln("i18n-t");return f(),y(R,null,[n("div",{class:"close",onClick:e[0]||(e[0]=(...h)=>s.onCancel&&s.onCancel(...h))},e[4]||(e[4]=[n("i",{class:"iconfont icon-close"},null,-1)])),n("div",xn,[n("div",In,r(W.value),1),n("div",Cn,[A(n("textarea",{ref_key:"promptInputDom",ref:$,"onUpdate:modelValue":e[1]||(e[1]=h=>b.value=h),class:"input-prompt"},null,512),[[T,b.value]]),n("div",_n,[n("span",{class:"msg",onClick:nn},[e[5]||(e[5]=n("i",{class:"iconfont icon-copy"},null,-1)),V(" "+r(d(t)("generateThemeByOthers")),1)]),n("button",{type:"submit",class:"btn",onClick:K},[m.value?(f(),U(dn,{key:0})):(f(),y("span",Sn,r(d(t)("generate")),1))])])]),n("div",{ref_key:"generatedCodesDom",ref:N,class:"aigenerate-title"},r(d(t)("generatedCodes")),513),n("div",zn,[A(n("textarea",{"onUpdate:modelValue":e[2]||(e[2]=h=>v.value=h),class:"aigenerate-codes",onBlur:M},null,544),[[T,v.value]])]),n("div",{ref_key:"compressedCodesDom",ref:j,class:"aigenerate-title"},r(d(t)("builtCodes")),513),u.value?I("",!0):(f(),y("div",An,[p.value&&k.value.version?(f(),y(R,{key:0},[V(r(d(t)("desktopIsOpenAndReady")),1)],64)):I("",!0),p.value?I("",!0):(f(),U(x,{key:1,keypath:"builtCodesDesc"},{desktop:l(()=>[n("a",Tn,r(d(t)("desktopVersion")),1)]),sbz:l(()=>[n("a",{href:`https://stackblitz.com/github/iconLake/Theme?file=src%2F${w.value}%2FApp.vue`,target:"_blank",class:"link"},"StackBlitz",8,Pn)]),csb:l(()=>[n("a",{href:`https://codesandbox.io/p/github/iconLake/Theme/master?file=%2Fsrc%2F${w.value}%2FApp.vue`,target:"_blank",class:"link"},"codeSandbox",8,Bn)]),_:1}))])),!u.value&&!p.value?(f(),y("div",$n,[n("p",null,r(d(t)("sbzBuildSteps")),1),n("p",null,[_(x,{keypath:"sbzBuildStep1"},{sbz:l(()=>[n("a",{href:`https://stackblitz.com/github/iconLake/Theme?file=src%2F${w.value}%2FApp.vue`,target:"_blank",class:"link"},e[6]||(e[6]=[n("b",null,"StackBlitz",-1)]),8,Ln)]),filename:l(()=>[n("a",{href:`https://stackblitz.com/github/iconLake/Theme?file=src%2F${w.value}%2FApp.vue`,target:"_blank",class:"link"},[n("b",null,"src/"+r(w.value)+"/App.vue",1)],8,Nn)]),command:l(()=>e[7]||(e[7]=[n("b",null,"Ctrl/Command + S",-1)])),save:l(()=>e[8]||(e[8]=[n("b",null,"Save",-1)])),_:1})]),n("p",null,[_(x,{keypath:"sbzBuildStep2"},{terminal:l(()=>e[9]||(e[9]=[n("b",null,"Terminal",-1)])),q:l(()=>e[10]||(e[10]=[n("b",null,"q + Enter",-1)])),command:l(()=>e[11]||(e[11]=[n("b",null,"Ctrl/Command + C",-1)])),build:l(()=>e[12]||(e[12]=[n("b",null,"pnpm run build",-1)])),_:1})]),n("p",null,[_(x,{keypath:"sbzBuildStep3"},{filename:l(()=>[n("b",null,"dist/assets/"+r(w.value)+"-xxxxxx.js",1)]),_:1})])])):I("",!0),!k.value.version&&(u.value||p.value)?(f(),y("div",jn,[n("p",Dn,[e[13]||(e[13]=n("i",{class:"iconfont icon-warn"},null,-1)),_(x,{keypath:"noNodejsAndGotoInstall"},{nodejs:l(()=>[n("a",Fn,r(d(t)("nodejsOfficialWebsite")),1)]),_:1})])])):I("",!0),n("div",Mn,[A(n("textarea",{"onUpdate:modelValue":e[3]||(e[3]=h=>c.value=h),class:"aigenerate-codes compressed",onBlur:E},null,544),[[T,c.value]])]),n("div",{ref_key:"previewDom",ref:D,class:"aigenerate-title"},r(d(t)("preview")),513),n("div",En,[n("iframe",{src:F.value,frameborder:"0",class:"aigenerate-preview"},null,8,Vn)]),n("div",Un,[n("a",{href:F.value,target:"_blank",class:"btn"},r(d(t)("previewInNewWindow")),9,Rn),n("button",{type:"submit",class:"btn",onClick:Y},r(d(t)("confirmUseThisTheme")),1)])])],64)}}});const Kn=cn(Gn,[["__scopeId","data-v-3e0e6628"]]);export{Kn as A};
