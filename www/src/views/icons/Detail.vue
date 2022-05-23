<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watchEffect } from "vue";
import { addTag, delTag, editIcon, Group, Icon, Source } from "../../apis/project";
import IconComponent from "../../components/Icon.vue";
import { copy, toast } from '../../utils';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  projectId: string
  info: Icon
  source: Source
  top: string
  left: string
  isShow?: boolean
  groups: Group[]
}>()

const emit = defineEmits<{
  (e: 'update', data: {
    name?: string
    groupId?: string
    tags?: string[]
  }): void
}>()

const opacity = computed(() => props.isShow ? 1 : 0)
const isVisible = ref(false)
const computedTop = computed(() => isVisible.value ? props.top : '-50rem')
const computedLeft = computed(() => isVisible.value ? props.left : '-50rem')
const root = ref(<Element>{})
const nameInputDom = ref<HTMLDivElement>()
const tagInputDom = ref<HTMLDivElement>()
const isNameFocus = ref(false)
const input = reactive({
  name: '',
  groupId: '',
  tag: ''
})
const isTagAdding = ref(false)

defineExpose({
  root
})

watchEffect(() => {
  input.name = props.info.name
  input.groupId = props.info.groupId || ''
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

function nameFocus() {
  (<HTMLDivElement>nameInputDom.value).focus()
}

function copyClassName() {
  copy(props.info.code)
  toast(t('copyDone'))
}

function showAddTag() {
  isTagAdding.value = !isTagAdding.value
  if (isTagAdding.value) {
    nextTick(() => {
      (<HTMLDivElement>tagInputDom.value).focus()
    })
  }
}

async function saveTag() {
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

async function saveInfo(key: 'name' | 'groupId') {
  const data = <{
    name?: string
    groupId?: string
  }>{}
  data[key] = input[key]
  await editIcon(props.projectId, props.info._id, data)
  toast(t('saveDone'))
  emit('update', data)
}
</script>

<template>
  <div class="detail" ref="root">
    <div class="flex start">
      <div>
        <IconComponent :info="info" :source="source" />
        <router-link :to="`/analyse/icon/${projectId}/${info._id}`" class="count-use c-main">{{t('pageRefererCount')}} {{info.analyse?.pageCount}}</router-link>
      </div>
      <div class="info grow">
        <div class="item">
          <div class="outline" v-if="isNameFocus"></div>
          <div class="label">{{t('name')}}</div>
          <div class="value">
            <input
              type="text"
              v-model="input.name"
              ref="nameInputDom"
              @focus="isNameFocus=true"
              @blur="isNameFocus=false"
              @change="saveInfo('name')"
            >
          </div>
          <i class="iconfont icon-edit pointer" @click="nameFocus()"></i>
        </div>
        <div class="item">
          <div class="label">{{t('oriName')}}</div>
          <div class="value">{{info.originalData?.name}}</div>
        </div>
        <div class="item">
          <div class="label">Class</div>
          <div class="value">{{info.code}}</div>
          <i class="iconfont icon-copy pointer" @click="copyClassName"></i>
        </div>
        <div class="item">
          <div class="label">{{t('source')}}</div>
          <div class="value">{{source.name}}</div>
        </div>
        <div class="item">
          <div class="label">{{t('group')}}</div>
          <div class="value">
            <select @change="saveInfo('groupId')" v-model="input.groupId">
              <option value="">{{t('ungrouped')}}</option>
              <option v-for="g in groups" :key="g._id" :value="g._id">{{g.name}}</option>
            </select>
          </div>
        </div>
        <div class="item">
          <div class="label">{{t('tag')}}</div>
          <div class="value"></div>
          <i class="iconfont icon-add-circle pointer" @click="showAddTag"></i>
        </div>
        <div class="tags flex start">
          <div class="tag flex" v-for="tag, i in info.tags" :key="tag">
            <span>{{tag}}</span>
            <i class="iconfont icon-delete-fill pointer tag-del" @click="deleteTag(i, tag)"></i>
          </div>
          <div class="tag flex" v-if="isTagAdding">
            <input type="text" maxlength="8" v-model="input.tag" ref="tagInputDom">
            <i class="iconfont icon-checked pointer tag-add" @click="saveTag"></i>
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
      margin-bottom: 1.6rem;
      position: relative;
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
        width: 11rem;
        margin-right: 1rem;
        line-height: 1.1;
        word-break: break-all;
        select,
        input {
          padding: 0;
          border: none;
          width: 100%;
          font-size: inherit;
          color: inherit;
          border-radius: 0;
        }
      }
      .outline {
        width: 14.438rem;
        height: 2.5rem;
        border-radius: 0.25rem;
        border: solid 0.063rem #476de8;
        position: absolute;
        left: 6rem;
        top: -0.7rem;
        z-index: 0;
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
      color: $color-main;
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