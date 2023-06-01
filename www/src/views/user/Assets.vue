<script setup lang="ts">
import { getBalance, mintDrop } from '@/apis/blockchain';
import { info } from '@/apis/user';
import { confirmDrop, getLocalDrop } from '@/utils/global';
import { ref, onBeforeUnmount } from 'vue';
import UserVue from '../../components/User.vue'
import { formatDropAmount } from '@/utils'

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
  const data = await confirmDrop(localDropAmount.value)
  console.log(data)
  if (data.code === 0) {
    getAssets()
    getDrop()
  }
}

getDrop()
getAssets()
</script>

<template>
  <UserVue />
  <p>
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
</template>
