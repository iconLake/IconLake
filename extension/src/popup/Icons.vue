<script setup lang="ts">
import { ref } from 'vue'
import Browser from 'webextension-polyfill'
import { Icon } from '../types'

const icons = ref([] as Icon[])

async function test() {
  const [tab] = await Browser.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  const res = await Browser.tabs.sendMessage(tab.id as number, {
    type: 'getIcons'
  }) as {
    icons: Icon[]
  }
  icons.value = res.icons
}

test()
</script>

<template>
  <div v-for="(item, i) in icons" :key="i" v-html="item.svg"></div>
</template>