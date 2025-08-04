<script setup lang="ts">
import { addIcon, uploadFile } from '@/apis/project';
import { toast } from '@/utils';
import { PROJECT_TYPE_STRING } from '@/utils/const';
import { getExtByMimeType } from '@/utils/file';
import { getIconUrl } from '@/utils/icon';
import { lib, SHA256 } from 'crypto-js';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n'
import LoadingVue from '@/components/Loading.vue';
import { saveAs } from 'file-saver'
import { event } from '@/utils/event';
import type { SearchedIcon } from '@/apis/extension';

const { t } = useI18n()
const isSaving = ref(false)

const props = defineProps<{
  icon: SearchedIcon
  projectId: string
  projectType: number
}>()

async function collect(isDownload: boolean = false) {
  if (isSaving.value) {
    return
  }
  
  const urls = props.icon.imgs ? props.icon.imgs.map(img => img.url) : [getIconUrl(props.icon)]
  for (const url of urls) {
    if (!url) {
      continue
    }
    isSaving.value = true
    try {
      const imgBlob = await fetch(url).then(res => res.blob())
      const buf = await imgBlob.arrayBuffer()
      const hash = SHA256(lib.WordArray.create(Array.from(new Uint8Array(buf)))).toString()
      const code  = `${hash}.${getExtByMimeType(imgBlob.type)}`
      if (isDownload) {
        saveAs(imgBlob, code)
        isSaving.value = false
        continue
      }
      const res = await uploadFile({
        projectId: props.projectId,
        _id: code,
        data: imgBlob
      })
      await addIcon(props.projectId, [{
        name: props.icon.name,
        code: props.icon.code,
        [PROJECT_TYPE_STRING[props.projectType]]: {
          url: res.url
        }
      }])
      toast.success(t('saveDone'))
      event.emit(event.EventType.IconCollected, {
        id: props.projectId,
      })
    } catch (error) {
      console.error(error)
      toast.error(t('fail'))
    }
  }
  
  isSaving.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    collect(true)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    collect(false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
})
</script>

<template>
  <div
    class="collect flex"
    @click="collect()"
  >
    <p class="help">
      {{ t('saveToProject') }}
    </p>
    <LoadingVue v-if="isSaving" />
    <i
      v-else
      class="iconfont icon-download"
    />
  </div>
</template>

<style scoped lang="scss">
@import "../../../styles/var.scss";

.collect {
  position: fixed;
  z-index: 210;
  bottom: 0;
  right: 0;
  cursor: pointer;
  padding: 1.8rem;
  align-items: flex-end;

  &:hover {
    .help {
      opacity: 1;
      width: auto;
    }
  }

  .help {
    font-size: 1rem;
    color: #666;
    opacity: 0;
    transition: $transition;
    margin-right: 0.8rem;
    width: 0;
    white-space: nowrap;
    overflow: hidden;
  }

  .iconfont {
    font-size: 2.5rem;
  }
}
</style>
