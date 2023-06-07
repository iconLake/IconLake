<!-- eslint-disable vue/no-mutating-props -->
<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watchEffect } from 'vue'
import { addTag, delTag, editGroup, editIcon, Group, Icon } from '../../apis/project'
import IconComponent from '../../components/Icon.vue'
import { copy, toast } from '../../utils'
import { useI18n } from 'vue-i18n'
import Select from '@/components/Select.vue'

const { t } = useI18n()

const props = defineProps<{
  projectId: string
  info: Icon
  top: string
  left: string
  isShow?: boolean
  groups: Group[]
  icons: Icon[]
}>()

const emit = defineEmits<{
  (e: 'update', data: {
    name?: string
    groupId?: string
    tags?: string[]
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
    name?: string
    code?: string
    groupId?: string
  } = {}
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
</script>

<template>
  <div
    ref="root"
    class="detail"
  >
    <div class="flex start">
      <div>
        <IconComponent :info="info" />
        <router-link
          :to="`/analyse/icon/${projectId}/${info._id}`"
          class="count-use c-main"
        >
          {{ t('pageRefererCount') }} {{ info.analyse?.pageCount }}
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
  .icon {
    :deep(.icon-svg) {
      width: 13.375rem;
      height: 13.375rem;
    }
  }
  .count-use {
    display: block;
    margin-top: 1.5rem;
    font-size: 1rem;
    text-align: center;
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
</style>