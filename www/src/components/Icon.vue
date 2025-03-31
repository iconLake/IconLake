<script setup lang="ts">
import { getIconUrl } from '@/utils/icon';
import { Icon } from "../apis/project"
import { computed, ref, watch } from 'vue';
import { addCompressParams } from '@/utils';
import { DFS_PREFIX } from '@/utils/const';
import { extensionApis, storage } from '@/apis/extension';

const props = defineProps<{
  info: Icon
  compress?: {
    maxWidth?: number
    maxHeight?: number
  }
}>()

const isError = ref(false)
const imgUrl = ref('')

const getImgFromDFS = (url: string) => {
  extensionApis.onReady(async () => {
    const file = await storage.getFile({
      key: url.substring(DFS_PREFIX.length),
    })
    imgUrl.value = file.data || '/imgs/img-error.svg'
  })
}

watch(() => props.info, async () => {
  const url = getIconUrl(props.info)
  if (!url) {
    imgUrl.value = ''
    return
  }
  if (url.startsWith(DFS_PREFIX)) {
    getImgFromDFS(url)
    return
  }
  if (!isError.value && props.compress) {
    imgUrl.value = addCompressParams(url, props.compress)
    return
  }
  imgUrl.value = url
}, { immediate: true })

const iconType = computed(() => {
  if (props.info.svg && props.info.svg.url) {
    return 'svg'
  }
  if (props.info.img && props.info.img.url) {
    return 'img'
  }
  return 'unknown'
})

watch(() => isError.value, () => {
  if (isError.value) {
    imgUrl.value = '/imgs/img-error.svg'
  }
})
</script>

<template>
  <div :class="`icon type-${iconType}`">
    <img
      v-if="imgUrl"
      :class="`icon-${iconType}`"
      :src="imgUrl"
      @error="isError = true"
    >
  </div>
</template>

<style lang="scss" scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}
.icon-svg {
  width: 100%;
  height: 100%;
}
.icon-img {
  height: auto;
  width: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
