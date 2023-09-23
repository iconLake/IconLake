<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const $router = useRouter()
const routeStatus = ref(0)

$router.beforeEach((to, from) => {
  routeStatus.value = 0
  setTimeout(() => {
    routeStatus.value = 1
  })
  to.meta.referer = from.fullPath
})

$router.afterEach(() => {
  setTimeout(() => {
    routeStatus.value = 2
  })
})
</script>

<template>
  <div class="progress">
    <div
      class="progress-bar"
      :class="['', 'routing', 'done'][routeStatus]"
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
      transition: all 3s ease-out;
    }
    &.done {
      opacity: 0;
      width: 100%;
      transition: var(--transition);
    }
  }
}
</style>
