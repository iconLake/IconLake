<script setup lang="ts">
import { getIconUrl } from '@/utils/icon';
import type { Icon } from "../apis/project";
import { computed, onMounted, ref, watch } from 'vue';
import { addCompressParams } from '@/utils';
import { DFS_PREFIX } from '@/utils/const';
import { extensionApis, storage } from '@/apis/extension';

const props = defineProps<{
  info: Icon
  compress?: {
    maxWidth?: number
    maxHeight?: number
  }
  lazy?: boolean
}>()

const isError = ref(false)
const imgUrl = ref('')
const imgDom = ref()
const isLazyLoaded = ref(false)

const getImgFromDFS = (url: string) => {
  extensionApis.onReady(async () => {
    const file = await storage.getFile({
      key: url.substring(DFS_PREFIX.length),
    }).catch(() => ({ data: '' }))
    imgUrl.value = file.data || '/imgs/img-error.svg'
  })
}

watch(() => props.info, async () => {
  isError.value = false
  const url = getIconUrl(props.info)
  if (!url) {
    imgUrl.value = '/imgs/img-error.svg'
    return
  }
  if (url.startsWith(DFS_PREFIX)) {
    getImgFromDFS(url)
    return
  }
  if (props.compress) {
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

onMounted(() => {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        if (img.dataset.src) {
          img.src = img.dataset.src
          isLazyLoaded.value = true
        }
        observer.unobserve(img)
      }
    }
  })
  if (imgDom.value && props.lazy) {
    observer.observe(imgDom.value)
  }
})
</script>

<template>
  <div :class="`icon type-${iconType}`">
    <img
      v-if="imgUrl"
      ref="imgDom"
      :class="`icon-${iconType}`"
      :data-src="imgUrl"
      :src="(lazy && !isLazyLoaded) ? undefined : imgUrl"
      loading="lazy"
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
.icon-img,
.icon-unknown {
  height: auto;
  width: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
