<script setup lang="ts">
import { getBalance, getDropInfo, initDrop, mintDrop, signMsg, getNftClass } from '@/apis/blockchain'
import { UserInfo, info, loginByBlockchain } from '@/apis/user'
import { list as getProjectList } from '@/apis/project'
import { ref, onBeforeUnmount, reactive } from 'vue'
import UserVue from '@/components/User.vue'
import { formatDropAmount, formatLakeAmount, toast } from '@/utils'
import HeaderVue from '@/components/Header.vue'
import LoadingVue from '@/components/Loading.vue'
import { getSignMsg } from '@/utils/blockchain'
import { DROP_DENOM_MINI, LAKE_DENOM_MINI, LAKE_DENOM, DROP_DENOM, MINT_DROP_AMOUNT_MAX, MINT_DROP_AMOUNT_MIN } from '@/utils/const'
import type { V1Beta1Class } from '@iconlake/client/types/cosmos.nft.v1beta1/rest'

const isKeplrAvailable = !!window.keplr
const comfirmedDropAmount = ref(0)
const lakeAmount = ref(0)
const lastMintTime = ref(-1)
const dropingAmount = ref(0)
const userInfo = ref<UserInfo>()
const isConfirming = ref(false)
const isIniting = ref(false)
const classes = reactive<V1Beta1Class[]>([])

const dropingTimer = setInterval(() => {
  if (lastMintTime.value <= 0 || isConfirming.value) {
    return
  }
  const time = Math.floor((Date.now() - lastMintTime.value) / 1000)
  dropingAmount.value = time > MINT_DROP_AMOUNT_MAX ? MINT_DROP_AMOUNT_MAX : time
}, 1000)

async function getAssets() {
  const uInfo = await info()
  userInfo.value = uInfo
  if (uInfo.blockchain) {
    getBalance(uInfo.blockchain.id, LAKE_DENOM_MINI).then(balance => {
      if (balance?.amount) {
        lakeAmount.value = +balance?.amount
      }
    })
    getBalance(uInfo.blockchain.id, DROP_DENOM_MINI).then(balance => {
      if (balance?.amount) {
        comfirmedDropAmount.value = +balance?.amount
      }
    })
    getDropInfo(uInfo.blockchain.id).then(dropInfo => {
      if (dropInfo.info?.lastMintTime) {
        lastMintTime.value = +dropInfo.info?.lastMintTime
      } else {
        lastMintTime.value = 0
      }
    }).catch(() => {
      lastMintTime.value = 0
    })
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
    toast('请先绑定你的区块链账户')
    return
  }
  if (dropingAmount.value < MINT_DROP_AMOUNT_MIN) {
    toast('最少确认1DROP，以防账户余额过低无法再确认新的DROP')
    return
  }
  isConfirming.value = true
  const data = await mintDrop(userInfo.value.blockchain.id, `${dropingAmount.value}`).catch(console.error)
  if (data && data.code === 0) {
    getAssets()
  } else {
    toast(data?.rawLog ?? 'Failed')
  }
  isConfirming.value = false
}

async function bindBlockchain() {
  const msg = await getSignMsg()
  const signRes = await signMsg(msg)
  if (!signRes) {
    return
  }
  const res = await loginByBlockchain({
    msg,
    sig: signRes.signature,
    pubkey: signRes.pub_key
  })
  if (res.userId && res.userId !== (await info())._id) {
    toast('此地址已绑定其他账号，即将为你切换账号')
    setTimeout(() => {
      location.reload()
    }, 2000)
  } else {
    toast('绑定成功')
  }
}

async function initDropAccount() {
  if (userInfo.value?.blockchain?.id) {
    isIniting.value = true
    await initDrop()
    toast("完成")
    isIniting.value = false
    getAssets()
  }
}

async function getNftClasses() {
  const {list} = await getProjectList('_id')
  list.forEach(async e => {
    const info = await getNftClass(e._id)
    if (info && info.class) {
      classes.push(info.class)
    }
  })
}

getAssets()
getNftClasses()
</script>

<template>
  <HeaderVue
    :back="true"
  >
    <span>我的链上地址：{{ userInfo?.blockchain?.id }}</span>
  </HeaderVue>
  <UserVue />
  <div class="token flex center">
    <div class="item lake">
      <div class="logo flex center">
        <img
          src="/imgs/lake-circle.svg"
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
          src="/imgs/drop.svg"
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
          src="/imgs/drop.svg"
          alt="LAKE"
        >
      </div>
      <div class="amount">
        <div class="label">
          待确认资产
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
        <span v-else>确认资产</span>
      </div>
    </div>
  </div>
  <div class="operate flex center">
    <a
      v-if="!isKeplrAvailable"
      href="https://www.keplr.app/download"
      target="_blank"
    >
      <button
        type="submit"
        class="btn"
      >
        安装Keplr钱包
      </button>
    </a>
    <button
      v-else-if="!userInfo?.blockchain?.id"
      type="submit"
      class="btn"
      @click="bindBlockchain"
    >
      绑定区块链账户
    </button>
    <button
      v-else-if="!lastMintTime"
      type="submit"
      class="btn"
      @click="initDropAccount"
    >
      初始化账户
    </button>
  </div>
  <div class="list">
    <div
      v-for="item in classes"
      :key="item.id"
      class="item"
    >
      {{ item.name }}
    </div>
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
    background: url(/imgs/token-lake-bg.png) center/contain no-repeat;
  }
  .drop {
    background: url(/imgs/token-drop-bg.png) center/contain no-repeat;
  }
  .droping {
    background: url(/imgs/token-droping-bg.png) center/contain no-repeat;
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
</style>