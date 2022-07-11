<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import { Icon } from "../apis/project";
import { parse } from "../utils/resource";

const props = defineProps<{
  info: Icon
}>()

const data = reactive({
  svgPath: ''
})

async function getIcon () {
  data.svgPath = props.info.svg
}

watchEffect(() => {
  if (props.info) {
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