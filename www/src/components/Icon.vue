<script setup lang="ts">
import { getIconUrl } from '@/utils/icon';
import { Icon } from "../apis/project"
import { computed } from 'vue';

const props = defineProps<{
  info: Icon
}>()

const iconType = computed(() => {
  if (props.info.svg) {
    return 'svg'
  }
  if (props.info.img) {
    return 'img'
  }
  return 'unknown'
})
</script>

<template>
  <div class="icon">
    <img
      v-if="getIconUrl(info)"
      :class="`icon-${iconType}`"
      :src="getIconUrl(info)"
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
