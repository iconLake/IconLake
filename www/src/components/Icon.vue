<script setup lang="ts">
import { Icon } from "../apis/project"

const props = defineProps<{
  info: Icon
}>()
</script>

<template>
  <div class="icon">
    <img
      v-if="info.svg && info.svg.url"
      class="icon-svg"
      :src="info.svg?.url"
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
