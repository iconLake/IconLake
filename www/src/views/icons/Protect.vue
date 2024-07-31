<script lang="ts" setup>
import { editIcon, projectApis, Icon as IconType } from '@/apis/project'
import { getHash, mintIcon, getTx, getChainAccount, burnIcon } from '@/apis/blockchain'
import Header from '@/components/Header.vue'
import Icon from '@/components/Icon.vue'
import User from '@/components/User.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/utils'
import { userApis } from '@/apis/user'
import type { UserInfo } from '@/apis/user'
import LoadingVue from '@/components/Loading.vue'
import { useI18n } from 'vue-i18n'
import { IS_PRODUCTION } from '@/utils/const'
import { usePageLoading } from '@/hooks/router'
import { getIconUrl } from '@/utils/icon'

const { t } = useI18n()
const pageLoading = usePageLoading()

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

const txUrl = computed(() => {
  if (iconInfo.txHash) {
    return `${IS_PRODUCTION ? 'https://ping.pub/iconLake' : 'https://testnet.ping.pub/iconLake'}/tx/${iconInfo.txHash}`
  } else {
    return ''
  }
})

async function getIconInfo() {
  projectApis.getIcon(projectId.value, id.value).onUpdate(async (icon) => {
    Object.assign(iconInfo, icon.info)
    if (icon.info.txHash) {
      const tx = await getTx(icon.info.txHash)
      if (!tx) {
        toast.error(t('txNotFound'))
        iconInfo.txHash = undefined
      }
    }
  })
}

async function publish() {
  if (isPending.value) {
    return
  }
  isPending.value = true
  const uri = getIconUrl(iconInfo)
  if (!uri) {
    toast.error(t('fail'))
    isPending.value = false
    return
  }
  const hash = await getHash(uri)
  if (!hash || !userInfo.value || !userInfo.value.blockchain?.id) {
    toast.error(t('fail'))
    isPending.value = false
    return
  }
  const res = await mintIcon({
    creator: userInfo.value.blockchain?.id,
    classId: projectId.value,
    id: hash.graph_hash ?? '',
    uri,
    uriHash: hash.file_hash ?? '',
    name: iconInfo.code,
    description: iconInfo.name,
    supply: '1',
  })
  if (!res) {
    isPending.value = false
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
  isPending.value = false
}

async function checkChainAccount() {
  await userApis.info().onUpdate(async info => {
    userInfo.value = info
  })
  if (!userInfo.value?.blockchain?.id) {
    return
  }
  const account = await getChainAccount(userInfo.value.blockchain?.id)
  if (account) {
    isChainAccountReady.value = true
  }
}

async function onBurnIcon() {
  if (iconInfo.txHash && userInfo.value?.blockchain?.id) {
    isPending.value = true
    const tx = await getTx(iconInfo.txHash)
    if (!tx) {
      toast.error(t('txNotFound'))
      isPending.value = false
      return
    }
    const msg = tx?.body?.messages![0] as any
    const res = await burnIcon({
      creator: userInfo.value.blockchain?.id,
      classId: msg.class_id,
      id: msg.id
    })
    if (!res) {
      isPending.value = false
      return
    }
    if (res?.code !== 0) {
      console.error(res)
      toast(t('burnFailed'), 'error')
      isPending.value = false
      return
    }
    await editIcon(projectId.value, id.value, {
      txHash: '',
    })
    toast(t('burnDone'))
    iconInfo.txHash = undefined
    isPending.value = false
  }
}

onMounted(() => {
  Promise.all([getIconInfo(), checkChainAccount()]).finally(() => {
    pageLoading.end()
  })
})
</script>

<template>
  <Header :back="`/icons/${projectId}`" />
  <User />
  <div class="main">
    <p>{{ t('onChainVerifyOwnership') }}</p>
    <div
      v-if="getIconUrl(iconInfo)"
      class="info"
    >
      <Icon :info="iconInfo" />
      <h1>{{ iconInfo.code }}</h1>
      <h2>{{ iconInfo.name }}</h2>
      <h3>Created by {{ userInfo?.blockchain?.id }}</h3>
      <div
        v-if="iconInfo.txHash"
        class="burn flex center"
        :title="t('burnIcon')"
        @click="onBurnIcon"
      >
        <LoadingVue v-if="isPending" />
        <i
          v-else
          class="iconfont icon-close"
        />
      </div>
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
      <a
        v-else
        target="_blank"
        :href="txUrl"
        class="success"
      >
        <i class="iconfont icon-info" />
        {{ t('OnchainRecord') }}ID: {{ iconInfo.txHash }}
      </a>
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
  position: relative;
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
  .burn {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--color-danger);
    color: #fff;
    width: 4rem;
    height: 4rem;
    border-top-right-radius: 50%;
    border-bottom-left-radius: 50%;
    opacity: 0;
    cursor: pointer;
    transition: var(--transition);
  }
  &:hover {
    .burn {
      opacity: 1;
    }
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
