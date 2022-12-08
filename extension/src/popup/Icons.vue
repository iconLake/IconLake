<script setup lang="ts">
import { ref } from 'vue'
import Browser from 'webextension-polyfill'
import { Icon, Project } from '../types'
import { ElButton, ElSelect, ElOption } from 'element-plus'

interface Item extends Icon {
  isSelected?: boolean
}

const icons = ref<Item[]>([])
const projectId = ref('')
const projectList = ref<Project[]>([])

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
  icons.value = res.icons.map(e => ({
    ...e,
    isSelected: false
  }))
}

getIcons()

async function getProjects () {
  const data: { list?: Project[], error?: string } = await fetch('https://iconlake.com/api/project/list').then(e => e.json())
  if (data.error === 'userNotLogin') {
    Browser.tabs.create({
      url: 'https://iconlake.com/login'
    })
  }
  projectList.value = data.list || []
}

getProjects()

function setSelected (item: Item) {
  item.isSelected = !item.isSelected
}
</script>

<template>
  <div class="list">
    <div class="item" :class="{selected: item.isSelected}" v-for="(item, i) in icons" :key="i" v-html="item.svg" @click="setSelected(item)"></div>
  </div>
  <div class="operate">
    <ElSelect v-model="projectId">
      <ElOption v-for="item in projectList" :label="item.name" :value="item._id" :key="item._id" />
    </ElSelect>
    <ElButton class="btn" type="primary" round>添加</ElButton>
  </div>
</template>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 16px;
  overflow: auto;
  flex: 1;
}
.item {
  width: 20%;
  padding: 16px;
  box-sizing: border-box;
  text-align: center;
  line-height: 1;
  cursor: pointer;
  ::v-deep(svg) {
    width: 100%;
    aspect-ratio: 1;
  }
  &.selected {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 5px;
      right: 5px;
      bottom: 5px;
      left: 5px;
      border: 1px solid var(--el-color-primary);
      border-radius: 10px;
    }
  }
}
.operate {
  padding: 16px;
  text-align: center;
  ::v-deep(.el-input__wrapper) {
    border-radius: 50px;
  }
  .btn {
    margin-left: 16px;
  }
}
</style>
