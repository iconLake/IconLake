<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { editInfo, info, uploadFile } from '../../../apis/project'
import { getExt, toast } from '../../../utils'
import { ElSwitch, ElUpload } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { UPLOAD_DIR } from '@/utils/const'

const { t } = useI18n()

const $route = useRoute()

const projectId = $route.params.id as string
const project = ref({
  name: '',
  desc: '',
  cover: '',
  class: '',
  prefix: '',
  isPublic: false,
})

async function getProject() {
  project.value = await info(projectId, 'name desc cover class prefix')
}

async function save() {
  if (!project.value) {
    return
  }
  await editInfo(projectId, project.value)
  toast(t('saveDone'))
  setTimeout(() => {
    window.scrollTo(0, 0)
    location.reload()
  }, 1000)
}

async function handleUpload(file: UploadFile) {
  if (!file.raw || !/^image\//i.test(file.raw?.type)) {
    toast('请选择图片')
    return
  }
  if (!file.size || file.size / 1024 / 1024 > 5) {
    toast('暂不支持上传超过5MB的图片')
    return
  }
  const res = await uploadFile(projectId, `${Date.now()}${getExt(file.name)}`, await file.raw.arrayBuffer(), UPLOAD_DIR.COVER)
  project.value.cover = res.url
}

getProject()
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
        v-if="project.cover"
        class="preview-cnt"
      >
        <img
          :src="project.cover"
          class="upload-preview"
        >
        <div class="preview-mask flex center">
          <i class="iconfont icon-plus" />
        </div>
      </div>
      <div
        v-else
        class="upload-add flex center"
      >
        <i class="iconfont icon-plus" />
      </div>
    </ElUpload>
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
  }
  .upload-preview {
    height: 10rem;
  }
}
.preview-cnt {
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  &:hover {
    border-radius: 0.625rem;
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
  background-color: rgba($color: #fff, $alpha: 0.5);
  opacity: 0;
  transition: var(--transition);
  border: #ccc 1px solid;
  border-radius: 0.625rem;
}
</style>
