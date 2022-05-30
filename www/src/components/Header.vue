<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const $props = defineProps<{
  back?: string | boolean
  white?: boolean
}>()

const $route = useRoute()

const backUrl = computed(() => {
  const referer = $route.meta.referer || '/'
  return typeof $props.back === 'boolean' && $props.back ? referer : <string>$props.back
})
</script>

<template>
  <div :class="`header flex ${white ? 'white' : ''}`">
    <router-link v-if="back" :to="backUrl" class="iconfont icon-back back" :title="t('back')"></router-link>
    <a href="/" class="logo" title="iconLake, make icon in control.">
      <img :src="`/imgs/logo${white ? '-white' : ''}.svg`" alt="logo">
    </a>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.header {
  height: 6rem;
  justify-content: flex-start;
  &.white {
    color: #fff;
  }
  .back {
    padding: 1.5rem;
  }
  .logo {
    align-self: flex-start;
    img {
      width: 5rem;
      height: 5rem;
    }
  }
}
</style>