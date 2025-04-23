<!-- eslint-disable vue/no-mutating-props -->
<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch, watchEffect } from 'vue'
import { addTag, delTag, editGroup, editIcon, projectApis, Group, Icon, uploadFile } from '../../apis/project'
import IconComponent from '../../components/Icon.vue'
import { copy, readFileAsBlob, readFileAsText, toast } from '../../utils'
import { useI18n } from 'vue-i18n'
import Select from '@/components/Select.vue'
import { ElUpload } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { PROJECT_TYPE, PROJECT_TYPE_STRING, UPLOAD_DIR, UPLOAD_FILE_SIZE_LIMIT } from '@/utils/const'
import { lib, MD5 } from 'crypto-js'
import { getIconUrl } from '@/utils/icon'
import { isImgFile, isSvgFile } from '@/utils/file'

const { t } = useI18n()

const props = defineProps<{
  projectId: string
  projectType: number
  info: Icon
  top: string
  left: string
  isShow?: boolean
  groups: Group[]
  icons: Icon[]
}>()

const emit = defineEmits<{
  (e: 'update', data: {
    _id: string
    name?: string
    groupId?: string
    tags?: string[]
    svg?: {
      url: string
    }
  }): void
  (e: 'addGroup', data: Group): void
}>()

const isVisible = ref(false)
const root = ref<Element>(document.body)
const nameInputDom = ref<HTMLInputElement>(document.createElement('input'))
const codeInputDom = ref<HTMLInputElement>(document.createElement('input'))
const tagInputDom = ref<HTMLInputElement>(document.createElement('input'))
const input = reactive({
  name: '',
  code: '',
  groupId: '',
  tag: ''
})
const isTagAdding = ref(false)

const opacity = computed(() => props.isShow ? 1 : 0)
const computedTop = computed(() => isVisible.value ? props.top : '-50rem')
const computedLeft = computed(() => isVisible.value ? props.left : '-50rem')
const groupOptions = computed(() => [
  { label: t('ungrouped'), value: '' },
  ...props.groups.map(e => ({ label: e.name, value: e._id }))
])
const acceptType = computed(() => {
  if (props.projectType === PROJECT_TYPE.IMG) {
    return 'image/*'
  }
  return 'image/svg+xml'
})

defineExpose({
  root
})

watchEffect(() => {
  input.name = props.info.name
  input.code = props.info.code
  input.groupId = props.info.groupId || ''
  input.tag = ''
  isTagAdding.value = false
})

watchEffect(() => {
  if (props.isShow) {
    isVisible.value = true
  } else {
    setTimeout(() => {
      if (!props.isShow) {
        isVisible.value = false
      }
    }, 100)
  }
})

function focus(name: 'name'|'code') {
  ({
    name: nameInputDom.value,
    code: codeInputDom.value
  }[name]).focus()
}

function copyClassName() {
  copy(props.info.code)
  toast(t('copyDone'))
}

function showAddTag() {
  isTagAdding.value = !isTagAdding.value
  if (isTagAdding.value) {
    nextTick(() => {
      (tagInputDom.value).focus()
    })
  }
}

async function saveTag() {
  if (!input.tag) {
    return
  }
  await addTag(props.projectId, props.info._id, input.tag)
  toast.success(t('saveDone'))
  props.info.tags.push(input.tag)
  input.tag = ''
  isTagAdding.value = false
}

async function deleteTag(i: number, tag: string) {
  await delTag(props.projectId, props.info._id, tag)
  toast.success(t('deleteDone'))
  props.info.tags.splice(i, 1)
}

async function saveInfo(key: 'name' | 'code' | 'groupId') {
  const data: {
    _id: string
    name?: string
    code?: string
    groupId?: string
  } = {
    _id: props.info._id
  }
  if (key === 'code' && props.icons.some(e => e.code === input.code)) {
    return toast(t('codeExists'))
  }
  data[key] = input[key]
  await editIcon(props.projectId, props.info._id, data)
  toast(t('saveDone'))
  emit('update', data)
}

async function addGroup(name:string) {
  const g:Group = {
    _id: '',
    name,
    num: 0,
    icons: []
  }
  const res = await editGroup(props.projectId, g)
  g._id = res._id
  toast(t('saveDone'))
  emit('addGroup', g)
}

async function getPageCount() {
  if (typeof props.info.analyse?.pageCount === 'number') {
    return
  }
  const id = props.info._id
  projectApis.getIconPages(props.projectId, id).onUpdate(async data => {
    if (id !== props.info._id) {
      return
    }
    props.info.analyse = {
      pageCount: data.pages.length
    }
  })
}

let idChangeTimer: NodeJS.Timeout
watch(() => props.info._id, () => {
  idChangeTimer && clearTimeout(idChangeTimer)
  idChangeTimer = setTimeout(() => {
    getPageCount()
  }, 200)
})

async function handleUpload(file: UploadFile) {
  if (!file.raw) {
    toast(t('pleaseSelectFile'))
    return
  }
  if (!file.size || file.size > UPLOAD_FILE_SIZE_LIMIT) {
    toast(t('fileSizeLimitExceeded'))
    return
  }
  if (props.projectType === PROJECT_TYPE.SVG && !isSvgFile(file.raw)) {
    return
  }
  if (props.projectType === PROJECT_TYPE.IMG && !isImgFile(file.raw)) {
    return
  }
  const _id = props.info._id
  const projectId = props.projectId
  const projectType = props.projectType
  const oldUrl = getIconUrl(props.info) || ''
  let url = oldUrl
  if (projectType === PROJECT_TYPE.SVG) {
    const svgText = await readFileAsText(file.raw)
    const hash = MD5(svgText).toString()
    const fileName = `${hash}.svg`
    if (new RegExp(`${fileName}$`).test(oldUrl)) {
      toast(t('fileIsSameAsOld'))
      return
    }
    const res = await uploadFile({
      projectId,
      _id: fileName,
      data: svgText,
      dir: UPLOAD_DIR.ICON
    }).catch((err) => {
      console.error(err)
      toast.error(t('fileUploadFailed'))
    })
    if (!res || !res.url) {
      return
    }
    url = res.url
  } else if (projectType === PROJECT_TYPE.IMG) {
    const imgBlob = await readFileAsBlob(file.raw)
    const buf = await imgBlob.arrayBuffer()
    const hash = MD5(lib.WordArray.create(Array.from(new Uint8Array(buf)))).toString()
    const code  = `${hash}.${file.name.substring(file.name.lastIndexOf('.') + 1)}`
    const res = await uploadFile({
      projectId,
      _id: code,
      data: imgBlob,
      dir: UPLOAD_DIR.ICON
    }).catch((err) => {
      console.error(err)
      toast.error(t('fileUploadFailed'))
    })
    if (!res || !res.url) {
      return
    }
    url = res.url
  } else {
    toast.error(t('notSupported'))
    return
  }
  const key = PROJECT_TYPE_STRING[projectType]
  const data = {
    _id,
    [key]: {
      url
    }
  }
  await editIcon(projectId, _id, { [key]: data[key] })
  toast(t('saveDone'))
  emit('update', data)
}
</script>

<template>
  <div
    ref="root"
    class="detail"
  >
    <RouterLink
      :to="`/icons/${projectId}/protect/${info._id}`"
      class="copyright"
      :class="info.txHash ? 'protected' : ''"
      :title="t('ownershipProtection')"
    >
      <i class="iconfont icon-protect" />
    </RouterLink>
    <div class="flex start">
      <div>
        <ElUpload
          :show-file-list="false"
          :auto-upload="false"
          :accept="acceptType"
          class="upload-input"
          @change="handleUpload"
        >
          <IconComponent
            :info="info"
            :compress="{ maxWidth: 600, maxHeight: 600 }"
          />
          <div class="mask flex center">
            <i class="iconfont icon-edit" />
          </div>
        </ElUpload>
        <router-link
          v-if="projectType === PROJECT_TYPE.SVG"
          :to="`/analyse/icon/${projectId}/${info._id}`"
          class="count-use c-main"
        >
          {{ t('pageReferer') }}{{ (typeof info.analyse?.pageCount === 'number') ? ` ${info.analyse.pageCount}` : '' }}
        </router-link>
        <router-link
          v-if="projectType === PROJECT_TYPE.IMG"
          :to="`/icons/${projectId}/appreciate/${info._id}`"
          class="appreciate c-main"
        >
          <i class="iconfont icon-ai" />
          <span>{{ t('appreciate') }}</span>
        </router-link>
      </div>
      <div class="info grow">
        <div class="item">
          <div class="label">
            {{ t('name') }}
          </div>
          <div class="value">
            <input
              ref="nameInputDom"
              v-model="input.name"
              type="text"
              @change="saveInfo('name')"
            >
            <i
              class="iconfont icon-edit pointer"
              @click="focus('name')"
            />
          </div>
        </div>
        <div class="item">
          <div class="label">
            {{ t('code') }}
          </div>
          <div class="value">
            <input
              ref="codeInputDom"
              v-model="input.code"
              type="text"
              @change="saveInfo('code')"
            >
            <i
              class="iconfont icon-edit pointer"
              @click="focus('code')"
            />
          </div>
        </div>
        <div class="item info-group">
          <div class="label">
            {{ t('group') }}
          </div>
          <div class="value">
            <Select
              v-model="input.groupId"
              :options="groupOptions"
              :addable="true"
              :placeholder="t('ungrouped')"
              @change="saveInfo('groupId')"
              @add="addGroup"
            />
          </div>
        </div>
        <div class="item info-tag">
          <div class="label">
            {{ t('tag') }}
          </div>
          <div class="value" />
          <i
            class="iconfont icon-add-circle pointer"
            :class="{'icon-add-circle': !isTagAdding, 'icon-remove-circle': isTagAdding}"
            @click="showAddTag"
          />
        </div>
        <div class="tags flex start">
          <div
            v-for="tag, i in info.tags"
            :key="tag"
            class="tag flex"
          >
            <span>{{ tag }}</span>
            <i
              class="iconfont icon-delete-fill pointer tag-del"
              @click="deleteTag(i, tag)"
            />
          </div>
          <div
            v-if="isTagAdding"
            class="tag flex"
          >
            <input
              ref="tagInputDom"
              v-model="input.tag"
              type="text"
              maxlength="8"
            >
            <i
              class="iconfont icon-checked pointer tag-add"
              :class="{active: input.tag}"
              @click="saveTag"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../styles/var.scss";

.detail {
  position: absolute;
  top: v-bind('computedTop');
  left: v-bind('computedLeft');
  width: 37.5rem;
  padding: 4.25rem;
  background: #fff;
  border-radius: 1.875rem;
  box-shadow: rgba($color: #000000, $alpha: 0.1) 0 0 2rem;
  transition: opacity 0.1s ease-in-out;
  opacity: v-bind(opacity);
  z-index: 200;
  .icon {
    width: 13.375rem;
    height: 13.375rem;
  }
  .count-use {
    display: block;
    margin-top: 1.5rem;
    font-size: 1rem;
    text-align: center;
  }
  .appreciate {
    display: block;
    margin-top: 1.5rem;
    text-align: center;
    .iconfont {
      font-size: 1.45rem;
      vertical-align: baseline;
      margin-right: 0.4rem;
    }
    span {
      font-size: 1.15rem;
      position: relative;
    }
  }
  .info {
    margin-left: 4rem;
    font-size: 1rem;
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      position: relative;
      min-height: 2.5rem;
      &.info-tag {
        padding-right: 0.5rem;
      }
      &.info-group {
        .value {
          z-index: 2;
        }
      }
      .label,
      .value,
      .iconfont {
        position: relative;
        z-index: 1;
      }
      .label {
        width: 6.6rem;
        color: #808080;
      }
      .value {
        color: #4d4b4b;
        width: 100%;
        line-height: 1.1;
        word-break: break-all;
        position: relative;
        :deep(input:not(.add-form input)) {
          padding: 0 0.5rem;
          box-sizing: border-box;
          width: 100%;
          font-size: inherit;
          color: inherit;
          height: 2.5rem;
          line-height: 2.5rem;
          border-radius: 0.25rem;
          border: solid 0.063rem transparent;
          padding-right: 2.5rem;
          &:focus {
            border-color: #476de8;
          }
        }
        i {
          position: absolute;
          top: 0;
          right: 0.5rem;
          height: 100%;
          line-height: 2.5rem;
        }
      }
    }
  }
  .tags {
    flex-wrap: wrap;
    margin-right: -1rem;
  }
  .tag {
    height: 1.8rem;
    background: #fff;
    color: #808080;
    box-shadow: 0rem 0.188rem 0.188rem 0rem rgba(0, 0, 0, 0.06);
    border-radius: 0.781rem;
    margin: 0 1rem 0.875rem 0;
    padding: 0 0.8rem;
    .iconfont {
      margin-left: 0.25rem;
    }
    &-del {
      color: #b2b2b2;
      display: none;
    }
    &-add {
      color: #808080;
      &.active {
        color: $color-main;
      }
    }
    &:hover {
      .iconfont {
        display: block;
      }
    }
    input {
      border: none;
      border-radius: 0;
      font-size: inherit;
      color: inherit;
      width: 10rem;
    }
  }
}

.copyright {
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: var(--color-main);
  opacity: 0.5;
  cursor: pointer;
  &.protected {
    opacity: 1;
  }
  .iconfont {
    font-size: 3rem;
  }
}

.upload-input {
  position: relative;
  .mask {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    color: #fff;
    font-size: 2.5rem;
    justify-content: center;
    align-items: center;
    opacity: 0;
    border-radius: 1.875rem;
    .iconfont {
      font-size: 2rem;
    }
  }
  &:hover {
    border-radius: 1.875rem;
    overflow: hidden;
    .mask {
      transition: var(--transition);
      transition-delay: 300ms;
      opacity: 1;
    }
  }
}
</style>
