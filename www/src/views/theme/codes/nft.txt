<script setup>
import { onMounted, ref } from 'vue';

const info = ref({})
const verifyStatus = ref(2)

async function getNftInfo() {
  info.value = await iconlakeAPI.nft.getInfo(iconlakeAPI.nft.id)
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
</script>

<template>
  <div class="nft" v-if="info.uri">
    <div class="cover">
      <img :src="info.uri" />
    </div>
    <div class="info">
      <div class="item">
        <div>作品名：</div>
        <div>{{info.data?.name}}</div>
      </div>
      <div class="item">
        <div>简　介：</div>
        <div>{{info.data?.description}}</div>
      </div>
      <div class="item">
        <div>创作者：</div>
        <a :href="`/exhibition/creator/${info.data?.author}`">{{info.data?.author}}&nbsp;
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="9" height="9"
            fill="currentColor">
            <path
              d="M644.87517299 510.17438549l-367.65643436 355.41154361c-21.67800946 20.95381845-21.67800946 54.92445525 0 75.84450789 21.67917341 20.95381845 56.78732743 20.95381845 78.46650084 0L762.59355307 548.07801059c21.67800946-20.95381845 21.67800946-54.92445525 0-75.84450787l-406.90714966-393.31633267c-10.83842219-10.47632669-25.04515129-15.69702571-39.25071531-15.6970257-14.20556402 0-28.41229198 5.22069902-39.21578552 15.73428338-21.67800946 20.95381845-21.67800946 54.88952547 0 75.84450788L644.87517299 510.17438549z">
            </path>
          </svg>
        </a>
      </div>
      <div class="item">
        <div>时　间：</div>
        <div>{{new Date(+info.data?.createTime).toLocaleString()}}</div>
      </div>
      <div class="item">
        <div>系　列：</div>
        <a :href="`/exhibition/${info.classId}`">{{info.classId}}&nbsp;
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="9" height="9"
            fill="currentColor">
            <path
              d="M644.87517299 510.17438549l-367.65643436 355.41154361c-21.67800946 20.95381845-21.67800946 54.92445525 0 75.84450789 21.67917341 20.95381845 56.78732743 20.95381845 78.46650084 0L762.59355307 548.07801059c21.67800946-20.95381845 21.67800946-54.92445525 0-75.84450787l-406.90714966-393.31633267c-10.83842219-10.47632669-25.04515129-15.69702571-39.25071531-15.6970257-14.20556402 0-28.41229198 5.22069902-39.21578552 15.73428338-21.67800946 20.95381845-21.67800946 54.88952547 0 75.84450788L644.87517299 510.17438549z">
            </path>
          </svg>
        </a>
      </div>
      <div class="item">
        <div>编　号：</div>
        <div>{{info.id}}</div>
      </div>
      <div class="item">
        <div>哈希值：</div>
        <div>
          {{info.uriHash}}
          <span class="verify-result" v-if="verifyStatus === 2">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12"
              fill="currentColor">
              <path
                d="M515.698 969.127c-97.188 0-191.28-31.134-270.406-90.479C148.62 806.402 85.835 700.441 68.634 580.72s13.245-238.928 85.663-335.6C304.12 45.24 588.288 4.644 787.997 154.125c83.77 62.785 143.46 153.092 168.23 254.58 4.3 17.374-6.365 34.92-23.739 39.048-17.373 4.128-34.918-6.365-39.047-23.738-21.157-86.867-72.418-164.446-144.148-218.286-171.154-127.979-414.898-93.06-543.048 78.094-62.097 82.911-88.243 185.087-73.45 287.608s68.462 193.344 151.372 255.44c171.326 128.323 414.898 93.404 543.22-77.922 33.544-44.895 56.594-95.123 68.29-149.308 3.785-17.373 21.158-28.554 38.36-24.77 17.373 3.784 28.554 20.986 24.77 38.36-13.761 63.473-40.596 122.13-79.815 174.422-72.418 96.672-178.379 159.457-298.1 176.658-21.674 3.268-43.52 4.816-65.194 4.816z">
              </path>
            </svg>
            &nbsp;验证中...
          </span>
          <span class="verify-result passed" v-if="verifyStatus === 1">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor"><path d="M529.066667 481.28V546.133333c40.96-3.413333 68.266667-20.48 68.266666-34.133333 0-6.826667-10.24-23.893333-68.266666-30.72z" fill="" p-id="18955"></path><path d="M512 238.933333c-122.88 0-221.866667 98.986667-221.866667 221.866667S389.12 682.666667 512 682.666667s221.866667-98.986667 221.866667-221.866667S634.88 238.933333 512 238.933333z m17.066667 341.333334v17.066666c0 10.24-6.826667 17.066667-17.066667 17.066667s-17.066667-6.826667-17.066667-17.066667V580.266667c-54.613333-3.413333-98.986667-27.306667-102.4-61.44 0-10.24 6.826667-17.066667 13.653334-20.48 10.24 0 17.066667 6.826667 20.48 13.653333 0 13.653333 27.306667 27.306667 68.266666 30.72v-68.266667c-34.133333-3.413333-102.4-17.066667-102.4-64.853333 0-34.133333 44.373333-61.44 102.4-68.266667v-17.066666c0-10.24 6.826667-17.066667 17.066667-17.066667s17.066667 6.826667 17.066667 17.066667v17.066666c54.613333 3.413333 98.986667 27.306667 102.4 61.44 0 10.24-6.826667 17.066667-13.653334 20.48-10.24 0-17.066667-6.826667-20.48-13.653333 0-13.653333-27.306667-27.306667-68.266666-30.72v68.266667c34.133333 3.413333 102.4 17.066667 102.4 64.853333 0 34.133333-44.373333 61.44-102.4 68.266667z"></path><path d="M426.666667 409.6c0 6.826667 10.24 23.893333 68.266666 30.72V375.466667c-40.96 3.413333-68.266667 20.48-68.266666 34.133333z"></path><path d="M959.146667 136.533333l-443.733334-136.533333h-10.24l-443.733333 136.533333c-6.826667 3.413333-10.24 10.24-10.24 17.066667v467.626667c0 187.733333 296.96 354.986667 457.386667 402.773333h6.826666c160.426667-47.786667 457.386667-215.04 457.386667-402.773333V153.6c0-6.826667-3.413333-13.653333-13.653333-17.066667zM512 716.8c-139.946667 0-256-116.053333-256-256S372.053333 204.8 512 204.8s256 116.053333 256 256S651.946667 716.8 512 716.8z"></path></svg>
            &nbsp;验证通过
          </span>
          <span class="verify-result error" v-if="verifyStatus === 0">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor"><path d="M942.656 769.376 602.112 159.584c-22.144-39.712-55.104-62.496-90.304-62.496-35.232 0-68.16 22.784-90.368 62.528L81.312 769.344c-22.016 39.456-24.256 79.456-6.112 110.4C93.344 910.624 129.664 928 174.88 928l674.24 0c45.184 0 81.536-17.376 99.648-48.256C966.944 848.8 964.672 808.832 942.656 769.376zM480 320c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288c0 17.696-14.336 32-32 32s-32-14.304-32-32L480 320zM512 832.128c-26.528 0-48-21.504-48-48s21.472-48 48-48 48 21.504 48 48S538.528 832.128 512 832.128z"></path></svg>
            &nbsp;验证失败
          </span>
          <span class="verify-result error" v-if="verifyStatus === -1">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor"><path d="M942.656 769.376 602.112 159.584c-22.144-39.712-55.104-62.496-90.304-62.496-35.232 0-68.16 22.784-90.368 62.528L81.312 769.344c-22.016 39.456-24.256 79.456-6.112 110.4C93.344 910.624 129.664 928 174.88 928l674.24 0c45.184 0 81.536-17.376 99.648-48.256C966.944 848.8 964.672 808.832 942.656 769.376zM480 320c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288c0 17.696-14.336 32-32 32s-32-14.304-32-32L480 320zM512 832.128c-26.528 0-48-21.504-48-48s21.472-48 48-48 48 21.504 48 48S538.528 832.128 512 832.128z"></path></svg>
            &nbsp;无法验证
          </span>
        </div>
      </div>
      <div class="item share"></div>
    </div>
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
