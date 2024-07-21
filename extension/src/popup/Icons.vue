<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import Browser from 'webextension-polyfill'
import { ButtonTooltipType, Icon, Project, SVG, MsgType, IconResource } from '../types'
import { ElSelect, ElOption } from 'element-plus'
import { list, addIcon, uploadFile } from '../apis/project'
import ButtonVue from '../components/Button.vue'
import { domain } from '../apis/request'
import { MD5 } from 'crypto-js'

interface Item extends Icon {
  isSelected?: boolean
}

const icons = ref<Item[]>([])
const tabUrl = ref(new URL('https://iconlake.com'))
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
  if (!tab || !tab.id) return
  const res = await Browser.tabs.sendMessage(tab.id as number, {
    type: MsgType.GetIcons
  }) as {
    icons: Icon[]
    url: string
  }
  icons.value = res.icons.map(e => ({
    ...e,
    isSelected: false
  }))
  tabUrl.value = new URL(res.url)
}

async function getProjects () {
  const data = await list()
  projectList.value = data.list || []
}

onMounted(() => {
  getIcons()
  getProjects()
})

let lastSelectedIndex = -1
function setSelected (item: Item, i: number, e: MouseEvent) {
  item.isSelected = !item.isSelected
  if (e.shiftKey && lastSelectedIndex > -1 && Math.abs(i - lastSelectedIndex) > 1) {
    for (let start = Math.min(lastSelectedIndex, i), end = Math.max(lastSelectedIndex, i); start <= end; ++start) {
      icons.value[start].isSelected = item.isSelected
    }
  }
  lastSelectedIndex = i
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

const genSVG = (svg: SVG) => `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}">${svg.path}</svg>`

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
  const uploadedIcons: (IconResource | undefined)[] = await Promise.all(icons.value.filter(e => e.isSelected).map(async (e, i) => {
    const content = genSVG(e.svg)
    const hash = MD5(content).toString()
    const res = await uploadFile(projectId.value, `${hash}.svg`, content)
    if (!res) {
      showTip('一个图标上传失败', ButtonTooltipType.Danger)
      return
    }
    return {
      code: hash,
      name: e.name || `${tabUrl.value.hostname}-${i}`,
      svg: {
        url: res.url
      }
    }
  }))
  const addIcons = uploadedIcons.filter(e => !!e) as IconResource[]
  if (addIcons.length === 0) {
    showTip('所有图标都上传失败了', ButtonTooltipType.Danger)
    return
  }
  await addIcon(projectId.value, addIcons).catch(() => {
    showTip('保存失败', ButtonTooltipType.Danger)
  })
  isSaving.value = false
  showTip('保存成功', ButtonTooltipType.Success)
  setTimeout(gotoProject, 1000)
}
</script>

<template>
  <div class="list">
    <div class="item" :class="{selected: item.isSelected}" v-for="(item, i) in icons" :key="i" @click="setSelected(item, i, $event)">
      <div class="wrapper" v-html="genSVG(item.svg)"></div>
    </div>
    <div v-if="icons.length === 0" class="empty">野渡无人舟自横</div>
  </div>
  <div class="operate">
    <ElSelect v-model="projectId" placeholder="选择项目" no-data-text="你还没有创建项目">
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
  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bbb;
    font-size: 1.5rem;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  :deep(.btn) {
    margin-left: 16px;
    width: 100px;
  }
}
</style>
