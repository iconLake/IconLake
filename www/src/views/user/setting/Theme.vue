<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/hooks/router'
import { ElUpload, UploadFile } from 'element-plus'
import { toast } from '@/utils';
import { UPLOAD_DIR, UPLOAD_FILE_SIZE_LIMIT } from '@/utils/const';
import Loading from '@/components/Loading.vue';
import { userApis } from '@/apis/user'
import AIGenerate from '@/views/theme/AIGenerate.vue';

const { t } = useI18n()
const pageLoading = usePageLoading()

const isDiy = ref(false)
const isAiGenerating = ref(false)
const isUploading = reactive({
  creator: false,
})
const fm = reactive({
  creator: '',
})
const userAddress = ref('')

const isSaving = ref(false)

onMounted(() => {
  getTheme().finally(() => {
    pageLoading.end()
  })
})

async function getTheme() {
  userApis.info().onUpdate(async info => {
    Object.assign(fm, info.theme)
    isDiy.value = !!info.theme?.creator
    userAddress.value = info.blockchain?.id ?? ''
  })
}

function switchDiy() {
  isDiy.value = !isDiy.value
  if (!isDiy.value) {
    fm.creator = ''
    save()
  }
}

async function handleUpload(file: UploadFile, type: 'creator') {
  if (!file.raw || !/^text\/javascript$/i.test(file.raw?.type)) {
    toast(t('pleaseSelectFile', { type: 'js' }))
    return
  }
  if (!file.size || file.size > UPLOAD_FILE_SIZE_LIMIT) {
    toast(t('fileSizeLimitExceeded'))
    return
  }
  isUploading[type] = true
  const res = await userApis.uploadFile({
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

async function handleUploaContent(content: string, type: 'creator') {
  if (!content) {
    return
  }
  isUploading[type] = true
  const res = await userApis.uploadFile({
    _id: `${type}-${Date.now()}.js`,
    data: content,
    dir: UPLOAD_DIR.THEME
  }).catch(() => {
    toast(t('fileUploadFailed'))
  })
  isUploading[type] = false
  if (res) {
    fm[type] = res.key
  }
}

async function handleUploadCreator(file: UploadFile) {
  await handleUpload(file, 'creator')
}

async function save() {
  if (isSaving.value) {
    return
  }
  if (isUploading.creator) {
    toast(t('waitForUploadFinish'))
    return
  }
  isSaving.value = true
  try {
    await userApis.editTheme(fm)
  } catch (err) {
    isSaving.value = false
    return
  }
  toast(t('saveDone'))
  isSaving.value = false
}

function aiGenTheme() {
  isAiGenerating.value = true
}

async function onAIGenerateFinish(text: string) {
  isAiGenerating.value = false
  await handleUploaContent(text, 'creator')
}

async function onAIGenerateCancel() {
  isAiGenerating.value = false
}
</script>

<template>
  <div class="theme">
    <p class="title">
      {{ t('exhibitionTheme') }}
    </p>
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
          {{ t('uploadExhibitionCreatorComponent') }}
        </p>
        <ElUpload
          :show-file-list="false"
          :auto-upload="false"
          accept="text/javascript"
          @change="handleUploadCreator"
        >
          <input
            :value="isUploading.creator ? t('uploading') : fm.creator"
            type="text"
            readonly
            :placeholder="`${t('selectFileAndExample')}creator-xxxxxxxx.js`"
            class="upload-content"
          >
          <Loading v-if="isUploading.creator" />
        </ElUpload>
        <div
          class="ai flex center"
          @click="aiGenTheme()"
        >
          <i class="iconfont icon-ai" />
        </div>
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
  <AIGenerate
    v-if="isAiGenerating"
    :on-finish="onAIGenerateFinish"
    :on-cancel="onAIGenerateCancel"
    type="creator"
    :creator-id="userAddress"
  />
</template>

<style lang="scss" scoped>
.theme {
  background-color: #fff;
  border-radius: 0.4rem;
  padding: 3.6rem 5.2rem;
  margin-bottom: 2rem;
}
.title {
  margin-bottom: 2.2rem;
}
.opt-style {
  .opt-item {
    height: 10rem;
    aspect-ratio: 4 / 3;
    margin-right: 5rem;
    position: relative;
    cursor: pointer;
    &.style-default {
      background: url('/imgs/list-style-default.png') no-repeat center center / contain;
    }
    &.style-tidy {
      background: url('/imgs/list-style-tidy.png') no-repeat center center / contain;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -1.5rem;
      left: 0;
      right: 0;
      margin: auto;
      width: 1rem;
      height: 1rem;
      border-radius: 0.5rem;
      background-color: #cfd5e6;
    }
    &.active {
      &::after {
        background-color: var(--color-main);
      }
    }
  }
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
  position: relative;
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
  .ai {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 4rem;
    height: 4rem;
    cursor: pointer;
    color: var(--color-main);
    .iconfont {
      font-size: 1.8rem;
    }
  }
}
</style>
