<script setup lang="ts">
import { useRoute } from 'vue-router'
import HeaderVue from '@/components/Header.vue'
import UserVue from '@/components/User.vue'
import LoadingVue from '@/components/Loading.vue'
import { computed, ref } from 'vue'
import { info } from '@/apis/user'
import { getBalance, getDropInfo, initDrop } from '@/apis/blockchain'
import { LAKE_DENOM_MINI } from '@/utils/const'
import { toast } from '@/utils'
import { useI18n } from 'vue-i18n'
import { fromBech32 } from '@cosmjs/encoding'

const { t } = useI18n()

const $route = useRoute()

const userInfo = ref()
const lakeAmount = ref(0)
const lastMintTime = ref(0)
const addr = ref('')
const isIniting = ref(false)

if (typeof $route.query.addr === 'string') {
  try {
    fromBech32($route.query.addr)
    addr.value = $route.query.addr
  } catch {}
}

const helpMsg = computed(() => {
  if (lastMintTime.value > 0) {
    return t('initedAndNoNeedAgain')
  }
  if (!userInfo.value?.blockchain?.id || lakeAmount.value <= 0) {
    return t('notEnoughLAKE')
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
  }).catch((err) => {
    toast(err.message ?? t('fail'))
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
  <div class="flex center column page">
    <div
      v-if="addr.length > 8"
    >
      {{ t('enableDROPMintingForSomeone1') }}<span class="addr">{{ addr }}</span>{{ t('enableDROPMintingForSomeone2') }}
    </div>
    <div v-if="addr === ''">
      {{ t('invalidAddress') }}
    </div>
    <button
      class="btn init"
      :disabled="!userInfo?.blockchain?.id || lakeAmount <= 0 || lastMintTime > 0 || addr === ''"
      @click="init"
    >
      <LoadingVue v-if="isIniting" />
      <span v-else>{{ t('start') }}</span>
    </button>
    <div class="help">
      {{ helpMsg }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: url('/imgs/init-drop-bg.png') center no-repeat;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: flex-start;
  padding: 0 12rem;
  .addr {
    color: var(--color-main);
    margin: 0 3px;
    font-weight: bold;
  }
}
.init {
  margin-top: 3rem;
}

.help {
  margin-top: 2.8rem;
  font-size: 1rem;
  color: #808008;
}
</style>
