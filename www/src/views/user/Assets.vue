<script setup lang="ts">
import { getBalance, getDropInfo, initDrop, mintDrop, signMsg, getNftClass, verifyUriHash, getInfo, getNFTs } from '@/apis/blockchain'
import type { BlockchainInfo } from '@/apis/blockchain'
import { UserInfo, info, loginByBlockchain } from '@/apis/user'
import { ref, onBeforeUnmount, reactive, computed, onMounted } from 'vue'
import UserVue from '@/components/User.vue'
import { formatDropAmount, formatLakeAmount, toast, copy } from '@/utils'
import HeaderVue from '@/components/Header.vue'
import LoadingVue from '@/components/Loading.vue'
import { getSignMsg } from '@/utils/blockchain'
import { DROP_DENOM_MINI, LAKE_DENOM_MINI, LAKE_DENOM, DROP_DENOM, MINT_DROP_AMOUNT_MAX, MINT_DROP_AMOUNT_MIN } from '@/utils/const'
import type { IconlakeiconClass } from '@iconlake/client/types/iconlake.icon/rest'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type ClassInfo = IconlakeiconClass & {
  url?: string
}

const tokenSrc = {
  lake: {
    logo: '/imgs/lake-circle.svg',
    bg: 'url(/imgs/token-lake-bg.png)',
  },
  drop: {
    logo: '/imgs/drop.svg',
    bg: 'url(/imgs/token-drop-bg.png)',
  },
  droping: {
    bg: 'url(/imgs/token-droping-bg.png)',
  },
}

const isKeplrAvailable = !!window.keplr
const comfirmedDropAmount = ref(0)
const lakeAmount = ref(0)
const isLAKEAmountLoaded = ref(false)
const lastMintTime = ref(-1)
const dropingAmount = ref(0)
const userInfo = ref<UserInfo>()
const isConfirming = ref(false)
const isIniting = ref(false)
const isBinding = ref(false)
const classes = reactive<ClassInfo[]>([])
const blockchainInfo = ref<BlockchainInfo>()

const dropingTimer = setInterval(() => {
  if (lastMintTime.value <= 0 || isConfirming.value) {
    return
  }
  const time = Math.floor((Date.now() - lastMintTime.value) / 1000)
  dropingAmount.value = time > MINT_DROP_AMOUNT_MAX ? MINT_DROP_AMOUNT_MAX : time
}, 1000)

const canInitDROP = computed(() => blockchainInfo.value?.config?.backendService.initDROP || lakeAmount.value > 0)
const isLoaded = computed(() => !!userInfo.value && !!blockchainInfo.value && isLAKEAmountLoaded.value)

const shareMsg = computed(() => `${t('helpToInitMintingDROP')} ${location.origin}/manage/user/assets/drop/init?addr=${userInfo.value?.blockchain?.id}`)

async function getAssets() {
  const uInfo = userInfo.value
  if (uInfo?.blockchain) {
    getBalance(uInfo.blockchain.id, LAKE_DENOM_MINI).then(balance => {
      if (balance?.amount) {
        lakeAmount.value = +balance?.amount
      }
    }).finally(() => {
      isLAKEAmountLoaded.value = true
    })
    getBalance(uInfo.blockchain.id, DROP_DENOM_MINI).then(balance => {
      if (balance?.amount) {
        comfirmedDropAmount.value = +balance?.amount
      }
    })
    getDropInfo(uInfo.blockchain.id).then(dropInfo => {
      if (dropInfo.info?.last_mint_time) {
        lastMintTime.value = +dropInfo.info?.last_mint_time
      } else {
        lastMintTime.value = 0
      }
    }).catch(() => {
      lastMintTime.value = 0
    })
  } else {
    isLAKEAmountLoaded.value = true
  }
}

onBeforeUnmount(() => {
  clearInterval(dropingTimer)
})

async function confirmAssets() {
  if (isConfirming.value) {
    return
  }
  userInfo.value = await info()
  if (!userInfo.value.blockchain) {
    toast(t('bindBlockchainAccount'))
    return
  }
  if (dropingAmount.value < MINT_DROP_AMOUNT_MIN) {
    toast(t('atLeast1DROP'))
    return
  }
  isConfirming.value = true
  const data = await mintDrop(userInfo.value.blockchain.id, `${dropingAmount.value}`).catch((err) => {
    console.error(err)
    toast(err.message ?? t('fail'))
  })
  if (data) {
    if (data.code === 0) {
      getAssets()
    } else {
      toast(data?.rawLog ?? t('fail'))
    }
  }
  isConfirming.value = false
}

async function bindBlockchain() {
  isBinding.value = true
  const catchCall = () => {
    isBinding.value = false
  }
  const msg = await getSignMsg().catch(catchCall)
  if (!msg) {
    return
  }
  const signRes = await signMsg(msg).catch(catchCall)
  if (!signRes) {
    return
  }
  const res = await loginByBlockchain({
    msg,
    sig: signRes.signature,
    pubkey: signRes.pub_key
  }).catch(catchCall)
  if (!res) {
    return
  }
  if (res.userId && res.userId !== (await info())._id) {
    toast(t('alreadyBoundAndSwitch'))
    setTimeout(() => {
      location.reload()
    }, 2000)
  } else {
    toast(t('boundAndLoadAssets'))
    userInfo.value = await info(true)
    await getAssets()
    isBinding.value = false
  }
}

async function initDropAccount() {
  if (userInfo.value?.blockchain?.id && !isIniting.value) {
    isIniting.value = true
    const res = await initDrop(
      userInfo.value?.blockchain?.id,
      userInfo.value?.blockchain?.id,
      !!blockchainInfo.value?.config.backendService.initDROP,
    ).catch((err) => {
      console.error(err)
      toast(err.message ?? t('fail'))
    })
    if (res) {
      toast(t('alreadyMinting'))
      getAssets()
    }
    isIniting.value = false
  }
}

async function getNftClasses() {
  if (!userInfo.value?.blockchain?.id) {
    return
  }
  const { nfts } = await getNFTs({
    owner: userInfo.value?.blockchain?.id,
  })
  if (!nfts) {
    return
  }
  const classIds: {
    [key: string]: number
  } = {}
  nfts.forEach((e) => {
    if (e.class_id) {
      if (!classIds[e.class_id]) {
        classIds[e.class_id] = 0
        getNftClass(e.class_id).then(async (info) => {
          if (info && info.class) {
            classes.push(info.class)
            const i = classes.length - 1
            const verify = await verifyUriHash(info.class.uri, info.class.uri_hash).catch(() => {})
            if (verify) {
              classes[i].url = info.class.uri
            }
          }
        })
      }
      classIds[e.class_id] += 1
    }
  })
}

async function getBlockchainInfo() {
  blockchainInfo.value = await getInfo()
}

function copyShareMsg() {
  copy(shareMsg.value)
  toast(t('copyDone'))
}

getBlockchainInfo()
onMounted(async () => {
  userInfo.value = await info()
  getAssets()
  getNftClasses()
})
</script>

<template>
  <HeaderVue
    :back="true"
  >
    <span>{{ t('myBlockchainAddress') }}{{ userInfo?.blockchain?.id }}</span>
  </HeaderVue>
  <UserVue />
  <div class="token flex center">
    <div class="item lake">
      <div class="logo flex center">
        <img
          :src="tokenSrc.lake.logo"
          alt="LAKE"
        >
      </div>
      <div class="amount">
        <span class="num">{{ formatLakeAmount(lakeAmount, false) }}</span>
        <span class="denom">{{ LAKE_DENOM }}</span>
      </div>
    </div>
    <div class="item drop">
      <div class="logo flex center">
        <img
          :src="tokenSrc.drop.logo"
          alt="LAKE"
        >
      </div>
      <div class="amount">
        <span class="num">{{ formatDropAmount(comfirmedDropAmount, false) }}</span>
        <span class="denom">{{ DROP_DENOM }}</span>
      </div>
    </div>
    <div class="item droping">
      <div class="logo flex center">
        <img
          :src="tokenSrc.drop.logo"
          alt="LAKE"
        >
      </div>
      <div class="amount">
        <div class="label">
          {{ t('assetsToConfirm') }}
        </div>
        <span class="num">{{ formatDropAmount(dropingAmount, false) }}</span>
        <span class="denom">DROP</span>
      </div>
      <div
        class="token-confirm flex center"
        @click="confirmAssets"
      >
        <LoadingVue
          v-if="isConfirming"
        />
        <span v-else>{{ t('confirmAssets') }}</span>
      </div>
    </div>
  </div>
  <div
    v-if="isLoaded"
    class="operate flex center"
  >
    <a
      v-if="!isKeplrAvailable"
      href="https://www.keplr.app/download"
      target="_blank"
    >
      <button
        type="submit"
        class="btn"
      >
        {{ t('installKeplr') }}
      </button>
    </a>
    <button
      v-else-if="!userInfo?.blockchain?.id"
      type="submit"
      class="btn"
      @click="bindBlockchain"
    >
      <LoadingVue v-if="isBinding" />
      <span v-else>{{ t('bindBlckchainAccount') }}</span>
    </button>
    <button
      v-else-if="!lastMintTime"
      type="submit"
      class="btn"
      :disabled="!canInitDROP"
      @click="initDropAccount"
    >
      <LoadingVue v-if="isIniting" />
      <span v-else>{{ t('mintDROP') }}</span>
    </button>
  </div>
  <div
    v-if="isLoaded && userInfo?.blockchain?.id && !canInitDROP"
    class="help-init"
  >
    <p>{{ t('notEnoughLAKEToInitMintingDROP') }}</p>
    <div
      class="example"
      @click="copyShareMsg"
    >
      <div class="iconfont icon-copy" />
      {{ shareMsg }}
    </div>
  </div>
  <div class="list flex start">
    <a
      v-for="item in classes"
      :key="item.id"
      class="item"
      :href="`/exhibition/${item.id ? encodeURIComponent(item.id) : ''}`"
      target="_blank"
    >
      <div class="item-cover">
        <div
          class="cover-img flex center"
          :style="{
            backgroundImage: item.url ? `url(${item.url})` : 'none'
          }"
        >
          <i
            v-if="!item.url"
            class="iconfont icon-info"
          />
        </div>
      </div>
      <div class="item-info">
        <div class="info-name">
          {{ item.name || t('noInfoInBlockchain') }}
        </div>
      </div>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.token {
  padding: 5rem 0;
  .item {
    width: 29.25rem;
    height: 15.5rem;
    position: relative;
    margin: 0 1rem;
  }
  .lake {
    background: v-bind('tokenSrc.lake.bg') center/contain no-repeat;
  }
  .drop {
    background: v-bind('tokenSrc.drop.bg') center/contain no-repeat;
  }
  .droping {
    background: v-bind('tokenSrc.droping.bg') center/contain no-repeat;
  }
  .logo {
    width: 2.813rem;
    height: 2.813rem;
    border-radius: 1.5rem;
    background-color: #fff;
    box-shadow: 0.075rem 0.369rem 0.413rem 0.025rem rgba($color: #000000, $alpha: 0.2);
    position: absolute;
    top: 2.25rem;
    left: 2.25rem;
    img {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
  .amount {
    color: #fff;
    font-size: 2.779rem;
    position: absolute;
    left: 2.25rem;
    right: 2.25rem;
    bottom: 5rem;
    text-align: center;
    .label {
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    .denom {
      font-size: 1rem;
      margin-left: 1rem;
    }
  }
  .token-confirm {
    height: 3rem;
    background-color: #fff;
    box-shadow: 0.075rem 0.369rem 0.413rem 0.025rem rgba(0, 0, 0, 0.2);
    border-radius: 1.737rem;
    position: absolute;
    right: 1rem;
    bottom: 1.125rem;
    font-size: 1rem;
    transform: scale(0.9);
    transform-origin: right bottom;
    cursor: pointer;
    color: #010101;
    padding: 0 1.5rem;
  }
}
.operate {
  margin: 0 0 5rem;
}
.help-init {
  p {
    text-align: center;
  }
  .example {
    background: #fff;
    width: 50rem;
    margin: 3rem auto;
    padding: 2rem 4rem 2rem 2rem;
    border-radius: 1.5rem;
    line-height: 2.2rem;
    position: relative;
    cursor: pointer;
    .icon-copy {
      position: absolute;
      right: 1.2rem;
      top: 1.2rem;
      color: var(--color-main);
    }
  }
}
.list {
  $item-width: 29.25rem;
  padding: 0 0 4rem;
  gap: 2rem;
  flex-wrap: wrap;
  width: $item-width * 4 + 2 * 3;
  margin: 0 auto;
  .item {
    width: 29.25rem;
    background-color: #fff;
    border-radius: 1rem;
    overflow: hidden;
    &-cover {
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
    }
    .cover-img {
      width: 100%;
      height: 100%;
      transition: var(--transition);
      background-position: center;
      background-size: contain;
      .iconfont {
        font-size: 12rem;
        color: #ddd;
      }
    }
    &:hover {
      .cover-img {
        transform: scale(1.2);
      }
    }
    &-info {
      padding: 2rem;
      line-height: 1.4;
      div {
        padding-top: 1.5rem;
        &:first-child {
          padding-top: 0;
        }
      }
    }
    .info {
      &-name {
        font-size: 1.3rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>