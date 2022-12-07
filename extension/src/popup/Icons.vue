<script setup lang="ts">
import { ref } from 'vue'
import Browser from 'webextension-polyfill'
import { Icon } from '../types'
import { ElButton, ElSelect, ElOption } from 'element-plus'

const icons = ref<Icon[]>([])

async function getIcons () {
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

getIcons()
</script>

<template>
  <div class="list">
    <div class="item" v-for="(item, i) in icons" :key="i" v-html="item.svg"></div>
  </div>
  <div class="operate">
    <ElSelect>
      <ElOption label="1111111" value="1" />
    </ElSelect>
    <ElButton>添加</ElButton>
  </div>
</template>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  overflow: auto;
}
.item {
  width: 20%;
  padding: 16px;
  box-sizing: border-box;
  ::v-deep(svg) {
    width: 100%;
    height: auto;
  }
}
.operate {
  padding: 16px;
  text-align: center;
}
</style>
