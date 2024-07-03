<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePageLoading } from './hooks/router';

const $router = useRouter()

const pageLoading = usePageLoading()

$router.beforeEach((to, from) => {
  pageLoading.start()
  to.meta.referer = from.fullPath
})
</script>

<template>
  <div class="progress">
    <div
      class="progress-bar"
      :class="['', 'routing', 'done'][pageLoading.status.value]"
    />
  </div>
  <router-view />
</template>

<style lang="scss" scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 999;
  &-bar {
    height: 100%;
    background-color: var(--color-main);
    width: 0%;
    &.routing {
      width: 90%;
      transition: all 10s ease-out;
    }
    &.done {
      opacity: 0;
      width: 100%;
      transition: var(--transition);
    }
  }
}
</style>
