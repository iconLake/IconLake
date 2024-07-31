<script setup lang="ts">
import { getIconUrl } from '@/utils/icon';
import { Icon } from "../apis/project"

const props = defineProps<{
  info: Icon
}>()
</script>

<template>
  <div class="icon">
    <img
      v-if="getIconUrl(info)"
      class="icon-svg"
      :src="getIconUrl(info)"
    >
  </div>
</template>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  width: 2rem;
  height: 2rem;
}
.icon-svg {
  width: 100%;
  height: 100%;
}
</style>
