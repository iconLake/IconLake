<script setup lang="ts">
import { getLocalDrop } from '@/utils/global';
import { ref, onBeforeUnmount } from 'vue';
import UserVue from '../../components/User.vue'

const localDropAmount = ref(0)

let timer: string | number | NodeJS.Timeout | undefined

async function getDrop() {
  localDropAmount.value = await getLocalDrop()
  timer = setInterval(() => {
    localDropAmount.value++
  }, 1000)
}

onBeforeUnmount(() => {
  clearInterval(timer)
})

getDrop()
</script>

<template>
  <UserVue />
  {{ localDropAmount / 1000000 }}DROP
</template>
