<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/hooks/router'
import { ElUpload, UploadFile } from 'element-plus'
import { toast } from '@/utils';
import { UPLOAD_DIR, UPLOAD_FILE_SIZE_LIMIT } from '@/utils/const';
import { editTheme, projectApis, uploadFile } from '@/apis/project';
import { useRoute } from 'vue-router';
import Loading from '@/components/Loading.vue';

const { t } = useI18n()
const pageLoading = usePageLoading()

const $route = useRoute()

const projectId = $route.params.id as string

const isDiy = ref(false)
const isUploading = reactive({
  class: false,
  nft: false,
})
const fm = reactive({
  class: '',
  nft: '',
})

const isSaving = ref(false)

onMounted(() => {
  getTheme().finally(() => {
    pageLoading.end()
  })
})

async function getTheme() {
  projectApis.info(projectId, 'theme').onUpdate(async res => {
    Object.assign(fm, res.theme)
    isDiy.value = !!res.theme?.class || !!res.theme?.nft
  })
}

function switchDiy() {
  isDiy.value = !isDiy.value
  if (!isDiy.value) {
    fm.class = ''
    fm.nft = ''
    save()
  }
}

async function handleUpload(file: UploadFile, type: 'class' | 'nft') {
  if (!file.raw || !/^text\/javascript$/i.test(file.raw?.type)) {
    toast(t('pleaseSelectFile', { type: 'js' }))
    return
  }
  if (!file.size || file.size > UPLOAD_FILE_SIZE_LIMIT) {
    toast(t('fileSizeLimitExceeded'))
    return
  }
  isUploading[type] = true
  const res = await uploadFile({
    projectId,
    _id: file.name,
    data: await file.raw.arrayBuffer(),
    dir: UPLOAD_DIR.THEME
  }).catch(() => {
    toast(t('fileUploadFailed'))
  })
  isUploading[type] = false
  if (res) {
    fm[type] = res.key
  }
}

async function handleUploadClass(file: UploadFile) {
  await handleUpload(file, 'class')
}

async function handleUploadNft(file: UploadFile) {
  await handleUpload(file, 'nft')
}

async function save() {
  if (isSaving.value) {
    return
  }
  if (isUploading.class || isUploading.nft) {
    toast(t('waitForUploadFinish'))
    return
  }
  isSaving.value = true
  try {
    await editTheme(projectId, {
      class: fm.class,
      nft: fm.nft
    })
  } catch (err) {
    isSaving.value = false
    return
  }
  toast(t('saveDone'))
  isSaving.value = false
}
</script>

<template>
  <div class="theme">
    <div class="flex start opt-type">
      <div
        class="switch"
        :class="{off: !isDiy}"
        @click="switchDiy"
      />
      <div class="label">
        {{ t(isDiy ? 'useDiyTheme' : 'useDefaultTheme') }}
      </div>
    </div>
    <div v-if="isDiy">
      <p class="help flex start">
        <span>{{ t('basedOnOpenSourceToDiyTheme') }}</span>
        <a
          target="_blank"
          href="https://gitee.com/iconLake/Theme"
          title="Gitee"
        >
          <img
            :src="'/imgs/gitee-logo.svg'"
            alt="gitee"
          >
        </a>
        <a
          target="_blank"
          href="https://github.com/iconLake/Theme"
          title="Github"
        >
          <img
            :src="'/imgs/github-logo.svg'"
            alt="github"
          >
        </a>
      </p>
      <div class="input-item">
        <p class="label">
          {{ t('uploadExhibitionIndexComponent') }}
        </p>
        <ElUpload
          :show-file-list="false"
          :auto-upload="false"
          accept="text/javascript"
          @change="handleUploadClass"
        >
          <input
            :value="isUploading.class ? t('uploading') : fm.class"
            type="text"
            readonly
            :placeholder="`${t('selectFileAndExample')}exhibition-xxxxxxxx.js`"
            class="upload-content"
          >
          <Loading v-if="isUploading.class" />
        </ElUpload>
      </div>
      <div class="input-item">
        <p class="label">
          {{ t('uploadExhibitionNftComponent') }}
        </p>
        <ElUpload
          :show-file-list="false"
          :auto-upload="false"
          accept="text/javascript"
          @change="handleUploadNft"
        >
          <input
            :value="isUploading.nft ? t('uploading') : fm.nft"
            type="text"
            readonly
            :placeholder="`${t('selectFileAndExample')}nft-xxxxxxxx.js`"
            class="upload-content"
          >
          <Loading v-if="isUploading.nft" />
        </ElUpload>
      </div>
      <div class="flex center">
        <button
          type="submit"
          class="btn"
          @click="save"
        >
          {{ t('save') }}
          <Loading v-if="isSaving" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme {
  background-color: #fff;
  border-radius: 0.4rem;
  padding: 3.6rem 5.2rem;
}
.opt-type {
  align-items: center;
  .label {
    margin-left: 2rem;
  }
}
.help {
  align-items: center;
  line-height: 1;
  margin: 2rem 0 5rem;
  img {
    height: 1.6rem;
  }
  a {
    margin-left: 0.8rem;
  }
}
.input-item {
  margin-bottom: 2.4rem;
  .label {
    margin-bottom: 0.8rem;
  }
  :deep(.el-upload) {
    width: 100%;
  }
  .upload-content {
    height: 4rem;
    width: 100%;
    padding: 0 1.4rem;
    cursor: pointer;
  }
  .loading {
    margin-left: 0.8rem;
  }
}
</style>
