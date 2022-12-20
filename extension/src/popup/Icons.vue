<script setup lang="ts">
import { reactive, ref } from 'vue'
import Browser from 'webextension-polyfill'
import { ButtonTooltipType, Icon, Project, SVG, MsgType } from '../types'
import { ElSelect, ElOption } from 'element-plus'
import { list, addIcon } from '../apis/project'
import ButtonVue from '../components/Button.vue'
import { domain } from '../apis/request'

interface Item extends Icon {
  isSelected?: boolean
}

const icons = ref<Item[]>([])
const projectId = ref('')
const projectList = ref<Project[]>([])
const isSaving = ref(false)
const tooltip = reactive({
  visible: false,
  content: ''
})
const tooltipType = ref(ButtonTooltipType.Default)

async function getIcons () {
  const [tab] = await Browser.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  const res = await Browser.tabs.sendMessage(tab.id as number, {
    type: MsgType.GetIcons
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
  const data = await list()
  projectList.value = data.list || []
}

getProjects()

function setSelected (item: Item) {
  item.isSelected = !item.isSelected
}

function showTip (content: string, type?: ButtonTooltipType) {
  tooltip.visible = true
  tooltip.content = content
  tooltipType.value = type ?? ButtonTooltipType.Default
}

async function gotoProject () {
  const tabs = await Browser.tabs.query({})
  const url = `${domain}/manage/icons/${projectId.value}`
  const tab = tabs.find(e => e.url === url)
  if (tab && tab.id) {
    await Browser.tabs.reload(tab.id)
    await Browser.tabs.update(tab.id, {
      highlighted: true,
      active: true
    })
  } else {
    await Browser.tabs.create({
      url
    })
  }
}

async function save () {
  if (!projectId.value) {
    showTip('请选择项目')
    return
  }
  if (!icons.value.some(e => e.isSelected)) {
    showTip('请选择图标')
    return
  }
  isSaving.value = true
  const t = Date.now()
  await addIcon(projectId.value, icons.value.filter(e => e.isSelected).map((e, i) => ({
    code: `${t}-${i}`,
    name: '',
    svg: e.svg
  }))).catch(() => {
    showTip('保存失败', ButtonTooltipType.Danger)
  })
  isSaving.value = false
  showTip('保存成功', ButtonTooltipType.Success)
  setTimeout(gotoProject, 1000)
}

const genSVG = (svg: SVG) => `<svg viewBox="${svg.viewBox}">${svg.path}</svg>`
</script>

<template>
  <div class="list">
    <div class="item" :class="{selected: item.isSelected}" v-for="(item, i) in icons" :key="i" @click="setSelected(item)">
      <div class="wrapper" v-html="genSVG(item.svg)"></div>
    </div>
  </div>
  <div class="operate">
    <ElSelect v-model="projectId" placeholder="选择项目">
      <ElOption v-for="item in projectList" :label="item.name" :value="item._id" :key="item._id" />
    </ElSelect>
    <ButtonVue v-model:tooltipVisible="tooltip.visible" class="btn" type="primary" round @click="save" :loading="isSaving" :tooltip="tooltip" :tooltip-type="tooltipType">添加</ButtonVue>
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
  padding: 6px;
  box-sizing: border-box;
  text-align: center;
  line-height: 1;
  cursor: pointer;
  position: relative;
  :deep(svg) {
    width: 100%;
    aspect-ratio: 1;
    fill: currentColor;
  }
  .wrapper {
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 10px;
  }
  &:hover {
    .wrapper {
      background-color: #e5ecff;
    }
  }
  &.selected {
    .wrapper {
      border-color: var(--el-color-primary);
      background-color: #fff;
    }
  }
}
.operate {
  padding: 16px;
  text-align: center;
  :deep(.el-input__wrapper) {
    border-radius: 50px;
  }
  :deep(.btn) {
    margin-left: 16px;
    width: 100px;
  }
}
</style>
