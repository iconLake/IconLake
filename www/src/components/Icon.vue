<script setup lang="ts">
import { getIconUrl } from '@/utils/icon';
import { Icon } from "../apis/project"
import { computed, ref } from 'vue';
import { addCompressParams } from '@/utils';

const props = defineProps<{
  info: Icon
  compress?: {
    maxWidth?: number
    maxHeight?: number
  }
}>()

const isError = ref(false)

const imgUrl = computed(() => {
  const url = getIconUrl(props.info)
  if (!url) {
    return ''
  }
  if (!isError.value && props.compress) {
    return addCompressParams(url, props.compress)
  }
  return url
})

const iconType = computed(() => {
  if (props.info.svg && props.info.svg.url) {
    return 'svg'
  }
  if (props.info.img && props.info.img.url) {
    return 'img'
  }
  return 'unknown'
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
