<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import { useRouter } from 'vue-router'

const $router = useRouter()

$router.beforeEach((to, from) => {
  to.meta.referer = from.fullPath
})
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss" scoped>
</style>
