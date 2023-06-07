<script setup lang="ts">
import { Icon } from "../apis/project"

const props = defineProps<{
  info: Icon
}>()
</script>

<template>
  <div class="icon">
    <svg
      class="icon-svg"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="props.info.svg?.viewBox"
      v-html="props.info.svg?.path"
    />
  </div>
</template>

<style lang="scss" scoped>
.icon-svg {
  width: 2rem;
  height: 2rem;
  fill: currentColor;
}
</style>