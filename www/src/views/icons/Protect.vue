<script lang="ts" setup>
import { editIcon, getIcon, Icon as IconType, uploadFile } from '@/apis/project'
import { getHash, mintIcon, getAccount, getTx, getChainAccount } from '@/apis/blockchain'
import Header from '@/components/Header.vue'
import Icon from '@/components/Icon.vue'
import User from '@/components/User.vue'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/utils'
import { info } from '@/apis/user'
import type { UserInfo } from '@/apis/user'
import LoadingVue from '@/components/Loading.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $route = useRoute()
const projectId = ref($route.params.projectId as string)
const id = ref($route.params.id as string)
const iconInfo = reactive({
  svg: {
    viewBox: '',
    path: '',
  },
  txHash: undefined
} as IconType)
const isPending = ref(false)
const isChainAccountReady = ref(false)
const userInfo = ref<UserInfo>()

async function getIconInfo() {
  const icon = await getIcon(projectId.value, id.value)
  Object.assign(iconInfo, icon.info)
  if (icon.info.txHash) {
    await getTx(icon.info.txHash).catch(() => {
      iconInfo.txHash = undefined
    })
  }
}

async function publish() {
  if (isPending.value) {
    return
  }
  isPending.value = true
  const hash = await getHash(iconInfo.svg.url)
  if (!userInfo.value || !userInfo.value.blockchain?.id) {
    isPending.value = false
    return
  }
  const res = await mintIcon({
    creator: userInfo.value.blockchain?.id,
    classId: projectId.value,
    id: hash.graph_hash ?? '',
    uri: iconInfo.svg.url,
    uriHash: hash.file_hash ?? '',
    name: iconInfo.code,
    description: iconInfo.name,
    supply: 1
  }).catch((err) => {
    console.error(err)
    isPending.value = false
    toast(err.message)
  })
  if (!res) {
    return
  }
  if (res?.code !== 0) {
    toast(t('blockchainConfirmationFailed'), 'error')
    isPending.value = false
    return
  }
  iconInfo.txHash = res.transactionHash
  await editIcon(projectId.value, id.value, {
    txHash: res.transactionHash
  })
  toast(t('blockchainConfirmationSuccessful'), 'success')
  isPending.value = true
}

async function checkChainAccount() {
  userInfo.value = await info()
  if (!userInfo.value.blockchain?.id) {
    return
  }
  const account = await getChainAccount(userInfo.value.blockchain?.id).catch(console.error)
  if (account) {
    isChainAccountReady.value = true
  }
}

getIconInfo()
checkChainAccount()
</script>

<template>
  <Header :back="`/icons/${projectId}`" />
  <User />
  <div class="main">
    <p>{{ t('onChainVerifyOwnership') }}</p>
    <div
      v-if="iconInfo.svg.url"
      class="info"
    >
      <Icon :info="iconInfo" />
      <h1>{{ iconInfo.code }}</h1>
      <h2>{{ iconInfo.name }}</h2>
      <h3>Created by {{ userInfo?.blockchain?.id }}</h3>
    </div>
    <div
      class="operate"
    >
      <button
        v-if="!iconInfo.txHash"
        class="btn"
        :loading="isPending"
        :disabled="!isChainAccountReady"
        @click="publish"
      >
        <LoadingVue v-if="isPending" />
        <span v-else>{{ t('publishToBlockchain') }}</span>
      </button>
      <div
        v-else
        class="success"
      >
        <i class="iconfont icon-info" />
        {{ t('OnchainRecord') }}ID: {{ iconInfo.txHash }}
      </div>
    </div>
    <div
      v-if="!iconInfo.txHash"
      class="warn flex start"
    >
      <i class="iconfont icon-warn" />
      <p>{{ t('publishOriginalWorks') }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  text-align: center;
  padding: 0 0 5rem;
}
.info {
  width: 38rem;
  margin: 5rem auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 2rem;
  line-height: 2;
  .icon {
    width: 22rem;
    height: 22rem;
  }
  h2 {
    font-size: 1.5rem;
    line-height: 1;
  }
  h3 {
    font-size: 1rem;
    opacity: 0.5;
    margin-top: 3rem;
  }
}
.warn,
.success {
  display: inline-flex;
  margin: 4rem auto 0;
  background: var(--color-danger);
  color: #fff;
  border-radius: 2rem;
  padding: 2rem;
  align-items: center;
  .iconfont {
    font-size: 3rem;
    margin-right: 2rem;
  }
}
.success {
  background: var(--color-main);
  margin-top: 0;
}
.operate {
  margin-top: 4rem;
}
</style>
