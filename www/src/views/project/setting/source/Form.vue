<script lang="ts" setup>
import { computed, ref } from 'vue'
import { delSource, editSource, Source, sync } from '../../../../apis/project'
import { confirm, parseResourceUrl, toast } from '../../../../utils'
import * as resource from '../../../../utils/resource'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  projectId?: string
  info?: Source
  deletable?: boolean
}>()

const emit = defineEmits(['save', 'delete'])

let name = ref(props.info?.name || '')
let type = ref(props.info?.type || resource.TYPE.ICONFONT)
let resourceUrl = ref(props.info?.resourceUrl || '')

let savable = computed(() => {
  return name.value && type.value && resourceUrl.value
})

async function save (e: Event) {
  const url = parseResourceUrl(resourceUrl.value, type.value)
  const source = {
    projectId: props.projectId || '',
    _id: props.info?._id || '',
    name: name.value,
    type: type.value,
    resourceUrl: url.resourceUrl,
    syncUrl: url.syncUrl,
    prefix: props.info?.prefix || '',
    className: props.info?.className || ''
  }
  const { _id } = await editSource(source)
  toast.success(t('saveDone'))
  emit('save', source)
  if ((<SubmitEvent>e).submitter?.dataset.sync) {
    syncSource(_id)
  }
}

function del () {
  confirm(t('delSourceConfirm'), () => {
    delSource(<string>props.projectId, (<Source>props.info)._id).then(() => {
      emit('delete')
    })
  })
}

async function syncSource (_id: string) {
  await sync(<string>props.projectId, _id)
  toast(t('syncDone'))
}
</script>

<template>
  <form @submit.prevent="save">
    <div class="content">
      <div class="flex">
        <div class="item short">
          <label>{{t('name')}}</label>
          <input type="text" autofocus class="input" v-model="name">
        </div>
        <div class="item short">
          <label>{{t('type')}}</label>
          <select class="input" v-model="type">
            <option value="1">iconfont</option>
          </select>
        </div>
      </div>
      <div class="item">
        <label>{{t('onlineLink')}}</label>
        <input type="text" class="input" v-model="resourceUrl">
      </div>
      <div class="t-center">
        <button v-if="deletable" type="button" class="btn danger" @click="del">{{t('delete')}}</button>
        <button type="submit" class="btn" :disabled="!savable">{{t('save')}}</button>
        <button type="submit" data-sync="true" class="btn" :disabled="!savable">{{t('saveAndSync')}}</button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  margin: 0 2.7rem;
  background: #fff;
  padding: 2.8rem;
  border-bottom-left-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
}
label {
  display: block;
  font-size: 1.4rem;
  margin-bottom: 0.8rem;
}
button {
  margin: 0 0.85rem;
}
.content {
  width: 52.8rem;
  margin: 0 auto;
}
.item {
  width: 100%;
  margin-bottom: 2.4rem;
  &.short {
    width: 48%;
  }
}
.input {
  width: 100%;
  height: 4rem;
  line-height: 4rem;
  border-radius: 0.4rem;
	border: solid 0.1rem #cccccc;
  padding: 0 1.4rem;
  box-sizing: border-box;
  font-size: 1.4rem;
}
.btn {
  height: 3rem;
  line-height: 3rem;
  font-size: 1.4rem;
  padding: 0 1.9rem;
}
</style>