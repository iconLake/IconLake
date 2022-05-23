<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const $props = defineProps<{
  back?: string | boolean
}>()

const $route = useRoute()

const backUrl = computed(() => {
  const referer = $route.meta.referer || '/'
  return typeof $props.back === 'boolean' && $props.back ? referer : <string>$props.back
})
</script>

<template>
  <div class="header flex">
    <router-link v-if="back" :to="backUrl" class="iconfont icon-back back"></router-link>
    <a href="/" class="logo">iconLake</a>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.header {
  height: 6rem;
  justify-content: flex-start;
  .back {
    padding: 1.5rem;
  }
}
</style>