<script setup lang="ts">
import { useRoute } from 'vue-router'
import HeaderVue from '@/components/Header.vue'
import UserVue from '@/components/User.vue'
import LoadingVue from '@/components/Loading.vue'
import { computed, ref } from 'vue';
import { info } from '@/apis/user';
import { getBalance, getDropInfo, initDrop } from '@/apis/blockchain';
import { LAKE_DENOM_MINI } from '@/utils/const';
import { toast } from '@/utils';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const $route = useRoute()

const userInfo = ref()
const lakeAmount = ref(0)
const lastMintTime = ref(0)
const addr = ref('')
const isIniting = ref(false)

if (typeof $route.query.addr === 'string') {
  addr.value = $route.query.addr
}

const helpMsg = computed(() => {
  if (lastMintTime.value > 0) {
    return '此地址已被初始化'
  }
  if (!userInfo.value?.blockchain?.id || lakeAmount.value <= 0) {
    return '你没有足够的LAKE'
  }
  return ''
})

async function init() {
  if (isIniting.value) {
    return
  }
  isIniting.value = true
  await initDrop(
    userInfo.value?.blockchain?.id,
    addr.value,
    false,
  ).then(() => {
    toast(t('alreadyMinting'))
  }).catch(() => {
    toast(t('fail'))
  }).finally(() => {
    isIniting.value = false
  })
}

async function getInfo() {
  userInfo.value = await info()
  if (!userInfo.value.blockchain?.id) {
    return
  }
  getBalance(userInfo.value.blockchain.id, LAKE_DENOM_MINI).then(res => {
    if (res?.amount) {
      lakeAmount.value = +res?.amount
    }
  })
  getDropInfo(addr.value).then(dropInfo => {
    if (dropInfo.info?.last_mint_time) {
      lastMintTime.value = +dropInfo.info?.last_mint_time
    }
  })
}

getInfo()
</script>

<template>
  <HeaderVue :back="true" />
  <UserVue />
  <div class="flex center column">
    <div>替{{ $route.query.addr }}开启积攒DROP</div>
    <button
      class="btn init"
      :disabled="!userInfo?.blockchain?.id || lakeAmount <= 0 || lastMintTime > 0"
      @click="init"
    >
      <LoadingVue v-if="isIniting" />
      <span v-else>开启</span>
    </button>
    <div class="help">
      {{ helpMsg }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.init {
  margin-top: 5rem;
}

.help {
  margin-top: 2rem;
}
</style>
