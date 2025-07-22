<script lang="ts" setup>
import { editIcon, projectApis, type Icon as IconType, uploadFile } from '@/apis/project'
import { getHash, mintIcon, getChainAccount, burnIcon } from '@/apis/blockchain'
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
import { ONLINE_DOMAIN, IS_PRODUCTION, DFS_PREFIX, UPLOAD_DIR } from '@/utils/const'
import { usePageLoading } from '@/hooks/router'
import { getIconUrl } from '@/utils/icon'
import i18n from '@/i18n'
import { storage } from '@/apis/extension'

const { t } = useI18n()
const pageLoading = usePageLoading()

const $route = useRoute()
const projectId = ref($route.params.projectId as string)
const id = ref($route.params.id as string)
const iconInfo = reactive({} as IconType)
const isPending = ref(false)
const isChainAccountReady = ref(false)
const userInfo = ref<UserInfo>()

const txUrl = computed(() => {
  if (iconInfo.blockchain?.txHash) {
    return `${IS_PRODUCTION ? 'https://ping.pub/iconLake' : 'https://testnet.ping.pub/iconLake'}/tx/${iconInfo.blockchain.txHash}`
  } else {
    return ''
  }
})

const isPublished = computed(() => {
  return iconInfo.blockchain?.classId && iconInfo.blockchain?.nftId
})

async function getIconInfo() {
  await projectApis.getIcon(projectId.value, id.value).onUpdate(async (icon) => {
    Object.assign(iconInfo, icon.info)
  })
}

async function publish() {
  if (isPending.value) {
    return
  }
  if (!userInfo.value?.gitee?.id && i18n.global.locale.value === 'zh-cn') {
    toast.error(t('bindRequiredAccount'))
    return
  }
  isPending.value = true
  let uri = getIconUrl(iconInfo)
  if (!uri) {
    toast.error(t('fail'))
    isPending.value = false
    return
  }
  if (uri.startsWith(DFS_PREFIX)) {
    const file = await storage.getFile({
      key: uri.substring(DFS_PREFIX.length),
    })
    if (!file.data) {
      toast.error(t('fail'))
      isPending.value = false
      return
    }
    const res = await uploadFile({
      projectId: projectId.value,
      _id: file.key.replace(`${UPLOAD_DIR.ICON}/`, ''),
      data: file.data,
      dir: UPLOAD_DIR.ICON
    }, {
      storageType: 'iconlake',
    })
    if (!res || !res.url) {
      toast.error(t('fail'))
      isPending.value = false
      return
    }
    uri = res.url
  }
  const hash = await getHash(uri.replace(/\?.*/, ''))
  if (!hash || !userInfo.value || !userInfo.value.blockchain?.id) {
    toast.error(t('fail'))
    isPending.value = false
    return
  }
  const res = await mintIcon({
    creator: userInfo.value.blockchain?.id,
    classId: projectId.value,
    id: hash.graphHash ?? '',
    uri,
    uriHash: hash.fileHash ?? '',
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
  iconInfo.blockchain = {
    classId: projectId.value,
    nftId: hash.graphHash ?? '',
    txHash: res.transactionHash,
    height: res.height,
  }
  await editIcon(projectId.value, id.value, {
    blockchain: iconInfo.blockchain
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
  if (iconInfo.blockchain?.classId && iconInfo.blockchain.nftId && userInfo.value?.blockchain?.id) {
    isPending.value = true
    const res = await burnIcon({
      creator: userInfo.value.blockchain?.id,
      classId: iconInfo.blockchain.classId,
      id: iconInfo.blockchain.nftId,
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
      blockchain: {
        classId: '',
        nftId: '',
        txHash: '',
        height: 0,
      }
    })
    toast(t('burnDone'))
    iconInfo.blockchain = undefined
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
      <Icon
        :info="iconInfo"
        :compress="{ maxWidth: 800, maxHeight: 800 }"
      />
      <h1>{{ iconInfo.name }}</h1>
      <h2>{{ iconInfo.code }}</h2>
      <h3>Created by {{ userInfo?.blockchain?.id }}</h3>
      <div
        v-if="isPublished"
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
        v-if="!isPublished"
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
        class="flex center links"
      >
        <a
          v-if="txUrl"
          target="_blank"
          :href="txUrl"
          class="success"
        >
          <i class="iconfont icon-info" />
          {{ t('OnchainRecord') }}ID: {{ iconInfo.blockchain?.txHash }}
        </a>
        <a
          v-if="iconInfo.blockchain?.classId && iconInfo.blockchain?.nftId"
          target="_blank"
          class="success exhibition"
          :href="`${ONLINE_DOMAIN}/exhibition/${iconInfo.blockchain.classId}/${iconInfo.blockchain.nftId}`"
        >
          <i class="iconfont icon-exhibition" />
        </a>
      </div>
    </div>
    <div
      v-if="!isPublished"
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
    margin: 0 auto 1rem;
    &.type-img {
      width: 100%;
      height: auto;
    }
  }
  h1 {
    word-break: break-all;
    line-height: 1.4;
  }
  h2 {
    word-break: break-all;
    font-size: 1.5rem;
    line-height: 1.5;
    margin-top: 0.8rem;
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
  margin: 4rem 1rem 0;
  background: var(--color-danger);
  color: #fff;
  border-radius: 2rem;
  padding: 2rem;
  align-items: center;
  word-break: break-all;
  .iconfont {
    font-size: 3rem;
    margin-right: 2rem;
  }
  &.exhibition {
    .iconfont {
      margin-right: 0;
    }
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
