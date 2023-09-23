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
  const referer = $route.meta.referer as string || '/'
  return typeof $props.back === 'boolean' && $props.back ? referer : $props.back as string
})
</script>

<template>
  <div :class="`header flex ${white ? 'white' : ''}`">
    <router-link
      v-if="back"
      :to="backUrl"
      class="iconfont icon-back back flex center"
      :title="t('back')"
    />
    <a
      href="/"
      class="logo"
      title="iconLake - You Create, You Own!"
    >
      <img
        :src="`/imgs/logo${white ? '-white' : ''}.svg`"
        alt="logo"
      >
    </a>
    <slot />
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
    height: 6rem;
    width: 6rem;
    transition: var(--transition);
    border-bottom-right-radius: 1rem;
    &:hover {
      color: var(--color-main);
      background: #fff;
    }
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
