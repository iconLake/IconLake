<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { editInfo, projectApis, uploadFile } from '../../../apis/project'
import { getExt, toast } from '../../../utils'
import { ElSwitch, ElUpload } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { PROJECT_TYPE, UPLOAD_DIR, UPLOAD_FILE_SIZE_LIMIT } from '@/utils/const'
import { usePageLoading } from '@/hooks/router'
import Loading from '@/components/Loading.vue'
import { event } from '@/utils/event'

const { t } = useI18n()
const pageLoading = usePageLoading()

const $route = useRoute()

const projectId = $route.params.id as string
const project = ref({
  type: PROJECT_TYPE.IMG,
  name: '',
  desc: '',
  cover: '',
  class: '',
  prefix: '',
  isPublic: false,
})
const isCoverUploading = ref(false)
const isSaving = ref(false)

async function getProject() {
  projectApis.info(projectId, 'type name desc cover class prefix').onUpdate(async res => {
    project.value = res
  })
}

async function save() {
  if (!project.value || isSaving.value) {
    return
  }
  isSaving.value = true
  try {
    await editInfo(projectId, project.value)
  } catch (err) {
    isSaving.value = false
    return
  }
  toast(t('saveDone'))
  event.emit(event.EventType.ProjectInfoChange, {
    id: projectId,
  })
  isSaving.value = false
}

async function handleUpload(file: UploadFile) {
  if (!file.raw || !/^image\//i.test(file.raw?.type)) {
    toast(t('pleaseSelectFile', { type: t('img') }))
    return
  }
  if (!file.size || file.size > UPLOAD_FILE_SIZE_LIMIT) {
    toast(t('fileSizeLimitExceeded'))
    return
  }
  isCoverUploading.value = true
  const res = await uploadFile({
    projectId,
    _id: `${Date.now()}${getExt(file.name)}`,
    data: await file.raw.arrayBuffer(),
    dir: UPLOAD_DIR.COVER
  }).catch(() => {
    toast(t('fileUploadFailed'))
  })
  isCoverUploading.value = false
  if (res) {
    project.value.cover = res.url
  }
}

onMounted(() => {
  getProject().finally(() => {
    pageLoading.end()
  })
})
</script>

<template>
  <form
    class="info"
    @submit.prevent=""
  >
    <p>{{ t('name') }}</p>
    <input
      v-model="project.name"
      type="text"
      class="input"
      maxlength="15"
    >
    <p>{{ t('desc') }}</p>
    <textarea
      v-model="project.desc"
      rows="10"
      class="input"
      maxlength="300"
    />
    <p>{{ t('cover') }}</p>
    <ElUpload
      :show-file-list="false"
      :auto-upload="false"
      accept="image/*"
      class="upload-input"
      @change="handleUpload"
    >
      <div
        v-if="project.cover && !isCoverUploading"
        class="preview-cnt"
      >
        <img
          :src="project.cover"
          class="upload-preview"
        >
        <div class="preview-mask flex center">
          <i class="iconfont icon-edit" />
        </div>
      </div>
      <div
        v-else
        class="upload-add flex center"
      >
        <Loading v-if="isCoverUploading" />
        <i
          v-else
          class="iconfont icon-plus"
        />
      </div>
    </ElUpload>
    <template v-if="project.type === PROJECT_TYPE.SVG">
      <p>{{ t('class') }}</p>
      <input
        v-model="project.class"
        type="text"
        class="input"
        maxlength="15"
      >
      <p>{{ t('prefix') }}</p>
      <input
        v-model="project.prefix"
        type="text"
        class="input"
        maxlength="15"
      >
    </template>
    <p>{{ t('isPublic') }}</p>
    <ElSwitch
      v-model="project.isPublic"
    />
    <div class="flex center">
      <button
        type="submit"
        class="btn"
        :disabled="!project.name"
        @click="save"
      >
        {{ t('save') }}
        <Loading v-if="isSaving" />
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.info {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 4rem 5.2rem;
  .input {
    height: 4rem;
    width: 100%;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    margin: 0.8rem 0 2.4rem;
  }
  textarea.input {
    height: 12rem;
    padding: 1.4rem;
  }
  .upload-input {
    margin: 0.8rem 0 2.4rem;
  }
  .upload-add {
    height: 4rem;
    width: 4rem;
    border: #ccc 1px solid;
    border-radius: 0.625rem;
    color: var(--el-color-black);
    .loading {
      color: var(--color-main);
    }
  }
  .upload-preview {
    height: 10rem;
  }
}
.preview-cnt {
  position: relative;
  overflow: hidden;
  border-radius: 0.625rem;
  &:hover {
    .preview-mask {
      opacity: 1;
    }
  }
}
.preview-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: rgba($color: #000, $alpha: 0.1);
  opacity: 0;
  transition: var(--transition);
  color: #fff;
  transition: var(--transition);
  .iconfont {
    font-size: 2rem;
  }
}
.btn {
  .loading {
    margin-left: 0.8rem;
  }
}
</style>
