<script setup lang="ts">
import { getBalance, signMsg } from '@/apis/blockchain';
import { info, loginByBlockchain } from '@/apis/user';
import { confirmDrop, getLocalDrop } from '@/utils/global';
import { ref, onBeforeUnmount } from 'vue';
import UserVue from '../../components/User.vue'
import { formatDropAmount } from '@/utils'
import HeaderVue from '@/components/Header.vue';
import { getSignMsg } from '@/utils/blockchain';

const localDropAmount = ref(0)
const comfirmedDropAmount = ref(0)

let timer: string | number | NodeJS.Timeout | undefined

async function getDrop() {
  clearInterval(timer)
  localDropAmount.value = await getLocalDrop()
  timer = setInterval(() => {
    localDropAmount.value++
  }, 1000)
}

async function getAssets() {
  const userInfo = await info()
  if (userInfo.blockchain) {
    const balance = await getBalance(userInfo.blockchain.id)
    if (balance?.amount) {
      comfirmedDropAmount.value = +balance?.amount
    }
  }
}

onBeforeUnmount(() => {
  clearInterval(timer)
})

async function confirmAssets() {
  const userInfo = await info()
  if (!userInfo.blockchain) return
  const data = await confirmDrop(+(prompt('Mint Drop', '10') ?? 0))
  console.log(data)
  if (data && data.code === 0) {
    getAssets()
    getDrop()
  }
}

async function bindBlockchain() {
  const msg = getSignMsg()
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
    alert('已为你切换账号')
    location.reload()
  } else {
    alert('绑定成功')
  }
}

getDrop()
getAssets()
</script>

<template>
  <HeaderVue
    :back="true"
  />
  <UserVue />
  <div class="assets">
    <h3>
      我的资产
    </h3>
    <p style="margin-top:50px">
      已确认资产：{{ formatDropAmount(comfirmedDropAmount) }}
    </p>
    <p>
      待确认资产：{{ formatDropAmount(localDropAmount) }}
    </p>
    <button
      type="submit"
      class="btn"
      @click="confirmAssets"
    >
      确认资产
    </button>
    <p style="margin-top:50px">
      如果还没有绑定区块链账户，需要先绑定
    </p>
    <button
      type="submit"
      class="btn"
      @click="bindBlockchain"
    >
      绑定区块链账户
    </button>
    <p style="margin-top:50px">
      如果还没有安装Keplr钱包，需要先安装
    </p>
    <a
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
  </div>
</template>

<style lang="scss" scoped>
.assets {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>