<script setup lang="ts">
import { getBalance, mintDrop } from '@/apis/blockchain';
import { info } from '@/apis/user';
import { getLocalDrop } from '@/utils/global';
import { ref, onBeforeUnmount } from 'vue';
import UserVue from '../../components/User.vue'
import { formatDropAmount } from '@/utils'

const localDropAmount = ref(0)
const comfirmedDropAmount = ref(0)

let timer: string | number | NodeJS.Timeout | undefined

async function getDrop() {
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
  const data = await mintDrop(userInfo.blockchain?.id, localDropAmount.value)
  console.log(data)
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
