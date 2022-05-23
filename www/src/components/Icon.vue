<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import { Icon, Source } from "../apis/project";
import { parse } from "../utils/resource";

const props = defineProps<{
  info: Icon
  source: Source
}>()

const data = reactive({
  svgPath: ''
})

async function getIcon () {
  const icons = await parse(props.source.resourceUrl, props.source.type)
  data.svgPath = icons[`${props.source.prefix}${props.info.code}`]
}

watchEffect(() => {
  if (props.info && props.source) {
    getIcon()
  }
})
</script>

<template>
  <div class="icon">
    <svg class="icon-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" v-html="data.svgPath"></svg>
  </div>
</template>

<style lang="scss" scoped>
.icon-svg {
  width: 2rem;
  height: 2rem;
  fill: currentColor;
}
</style>