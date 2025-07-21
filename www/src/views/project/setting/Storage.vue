<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/hooks/router'
import Loading from '@/components/Loading.vue'
import { toast } from '@/utils'
import { editInfo, projectApis } from '@/apis/project'
import { useRoute } from 'vue-router'

const pageLoading = usePageLoading()

const { t } = useI18n()
const $route = useRoute()

const isSaving = ref(false)
const isTesting = ref(false)
const info = ref({
  api: '',
  token: '',
})
const projectId = $route.params.id as string

const save = async () => {
  isSaving.value = true
  try {
    await editInfo(projectId, {
      'storage.api': info.value.api,
      'storage.token': info.value.token,
    })
  } catch (err) {
    isSaving.value = false
    return
  }
  toast(t('saveDone'))
  isSaving.value = false
}

const getStorage = async () => {
  projectApis.info(projectId, 'storage').onUpdate(async res => {
    res.storage && (info.value = res.storage)
  })
}

const testApi = () => {
  if (isTesting.value) {
    return
  }
  isTesting.value = true
  const body = new FormData()
  body.append('file', new File(
    [Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64')],
    'test.gif',
    { type: 'image/gif' }
  ))
  body.append('key', `test/${Date.now()}.gif`)
  fetch(info.value.api, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${info.value.token}`,
    },
    body
  }).then(res => res.json()).then((res) => {
    if (res.key && res.url) {
      const img = new Image()
      img.src = res.url
      img.onload = () => {
        toast(t('testSuccess'))
      }
      img.onerror = (err) => {
        console.error(err)
        toast(t('testFailed'))
      }
    } else {
      console.error(res)
      toast(t('testFailed'))
    }
  }).catch((err) => {
    console.error(err)
    toast(t('testFailed'))
  }).finally(() => {
    isTesting.value = false
  })
}

onMounted(async () => {
  await getStorage()
  pageLoading.end()
})
</script>

<template>
  <form
    class="info"
    @submit.prevent=""
  >
    <p class="tip">
      {{ t('uploadApiCustomizedDesc') }}
    </p>
    <p>API</p>
    <input
      v-model="info.api"
      type="text"
      class="input"
      maxlength="64"
      :placeholder="`${t('suchAs')}https://your-domain.com/upload`"
    >
    <p>Token</p>
    <input
      v-model="info.token"
      type="text"
      class="input"
      maxlength="64"
    >
    <div class="flex center btns">
      <button
        type="button"
        class="btn"
        :disabled="!info.api || !info.token || isTesting"
        @click="testApi"
      >
        {{ t('testAvailable') }}
        <Loading v-if="isTesting" />
      </button>
      <button
        type="submit"
        class="btn"
        :disabled="!info.api || !info.token"
        @click="save"
      >
        {{ t('save') }}
        <Loading v-if="isSaving" />
      </button>
    </div>
  </form>
  <div class="info help">
    <p class="tip">
      {{ t('howToBuildYourOwnUploadService') }}
    </p>
    <p>
      {{ t('setupUploadServiceWithOpensource') }}
      <a
        href="https://gitee.com/iconLake/dfs"
        target="_blank"
      >
        <img
          :src="'/imgs/gitee-logo.svg'"
          height="18"
          alt="gitee"
        >
      </a>
      <a
        href="https://github.com/iconLake/dfs"
        target="_blank"
      >
        <img
          src="/imgs/github-logo.svg"
          height="18"
          alt="gitee"
        >
      </a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.info {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 4rem 5.2rem;
  margin-top: 2.4rem;
  .tip {
    margin-bottom: 2.4rem;
  }
  .input {
    height: 4rem;
    width: 100%;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    margin: 0.8rem 0 2.4rem;
  }
  .btns {
    gap: 1.6rem;
    .loading {
      margin-left: 0.8rem;
    }
  }
}
.help {
  a {
    margin-left: 0.8rem;
  }
}
</style>
