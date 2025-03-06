<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from 'vue'
import Browser from 'webextension-polyfill'
import { ButtonTooltipType, Icon, Project, SVG, MsgType, IconResource, ProjectTypes } from '../types'
import { ElSelect, ElOption, ElSlider } from 'element-plus'
import { list, addIcon, uploadFile } from '../apis/project'
import ButtonVue from '../components/Button.vue'
import { domain } from '../apis/request'
import { lib, MD5 } from 'crypto-js'

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
const projectType = ref(ProjectTypes.SVG)
const minSize = ref(100)

const sizeMarks = {
  100: '100px',
  300: '300px',
  500: '500px',
  800: '800px',
}

async function getIcons (type?: ProjectTypes) {
  const [tab] = await Browser.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  if (!tab || !tab.id) return
  const msgType = type === ProjectTypes.Img ? MsgType.GetImgs : MsgType.GetSvgs
  const res = await Browser.tabs.sendMessage(tab.id as number, {
    type: msgType
  }) as {
    icons: Icon[]
    url: string
  }
  if (type === ProjectTypes.Img) {
    await Browser.runtime.sendMessage({
      type: 'ModifyRequestReferer',
      params: [
        res.icons.map(e => ({
          url: e.img?.url,
          referer: res.url
        }))
      ]
    })
  }
  icons.value = res.icons.map(e => ({
    ...e,
    isSelected: false
  }))
  tabUrl.value = new URL(res.url)
}

let allProjects: Project[]
async function getProjects (type?: ProjectTypes) {
  if (!allProjects) {
    const data = await list()
    allProjects = data.list || []
  }
  if (type) {
    return allProjects.filter(e => e.type === type)
  }
  return allProjects
}

watch(projectType, async (value) => {
  getIcons(value)
  projectId.value = ''
  projectList.value = await getProjects(value)
  await saveProjectType()
}, {
  immediate: true
})

const filteredIcons = computed(() => {
  return icons.value.filter(item => {
    if (projectType.value === ProjectTypes.Img && item.img) {
      return item.img.width >= minSize.value && item.img.height >= minSize.value
    }
    return true
  })
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
    let res
    let code = ''
    if (e.svg) {
      const content = genSVG(e.svg)
      code = MD5(content).toString()
      res = await uploadFile(projectId.value, `${code}.svg`, content)
    } else if (e.img) {
      const file = await fetch(e.img.url).then(res => res.blob()).catch(() => {
        showTip('获取图片失败', ButtonTooltipType.Danger)
      })
      if (!file) return
      const hash = MD5(lib.WordArray.create(Array.from(new Uint8Array(await file.arrayBuffer())))).toString()
      let ext = file.type.split('/')[1]
      if (ext === 'svg+xml') ext = 'svg'
      code = `${hash}.${ext}`
      res = await uploadFile(projectId.value, code, file)
    } else {
      console.error('unknown icon', e)
      return
    }
    if (!res) {
      showTip('一个图标上传失败', ButtonTooltipType.Danger)
      return
    }
    return {
      code,
      name: e.name || `${tabUrl.value.hostname}-${i}`,
      [projectType.value === ProjectTypes.Img ? 'img' : 'svg']: {
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

async function getSavedProjectType() {
  const { projectType: type } = await Browser.storage.local.get('projectType')
  if (type) {
    projectType.value = type
  }
}

async function saveProjectType () {
  await Browser.storage.local.set({ projectType: projectType.value })
}

onMounted(async () => {
  await getSavedProjectType()
})
</script>

<template>
  <div class="list" :class="{img: projectType === ProjectTypes.Img}">
    <div class="types">
      <div class="item" :class="{active: projectType === ProjectTypes.SVG}" @click="projectType = ProjectTypes.SVG">SVG</div>
      <div class="item" :class="{active: projectType === ProjectTypes.Img}" @click="projectType = ProjectTypes.Img">图片</div>
    </div>
    <div class="width-filter" v-if="projectType === ProjectTypes.Img">
      <ElSlider
        v-model="minSize"
        :min="0"
        :max="1000"
        :step="50"
        input-size="small"
        placement="bottom"
        :format-tooltip="value => `${value}px`"
        :marks="sizeMarks"
      />
    </div>
    <div class="item" :class="{selected: item.isSelected}" v-for="(item, i) in filteredIcons" :key="i" @click="setSelected(item, i, $event)">
      <div class="wrapper svg" v-if="item.svg" v-html="genSVG(item.svg)"></div>
      <div class="wrapper img" v-if="item.img">
        <img :src="item.img.url" />
      </div>
    </div>
    <div v-if="icons.length === 0" class="empty">没有找到{{ projectType === ProjectTypes.SVG ? 'SVG' : '图片' }}</div>
  </div>
  <div class="operate">
    <ElSelect v-model="projectId" placeholder="选择项目" no-data-text="你还没有创建项目">
      <ElOption v-for="item in projectList" :label="item.name" :value="item._id" :key="item._id" />
    </ElSelect>
    <ButtonVue v-model:tooltipVisible="tooltip.visible" class="btn" type="primary" round @click="save" :loading="isSaving" :tooltip="tooltip" :tooltip-type="tooltipType">添加</ButtonVue>
  </div>
</template>

<style lang="scss" scoped>
.types {
  width: 100%;
  display: flex;
  background-color: #fff;
  height: 36px;
  overflow: hidden;
  border-radius: 18px;
  font-size: 13px;
  margin-bottom: 16px;
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border-radius: 18px;
    flex: 1;
    cursor: pointer;
    &.active {
      color: #fff;
      background: var(--el-color-primary);
    }
  }
}

.width-filter {
  width: 100%;
  margin-bottom: 10px;
  .el-slider {
    :deep(.el-slider__marks) {
      opacity: 0;
      transition: var(--transition);
    }
    &:hover {
      :deep(.el-slider__marks) {
        opacity: 1;
      }
    }
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 16px;
  overflow: auto;
  flex: 1;
  .empty {
    width: 100%;
    height: calc(100% - 52px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bbb;
    font-size: 1.5rem;
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
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      overflow: hidden;
      img {
        max-height: 100%;
        max-width: 100%;
      }
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
  &.img {
    .item {
      width: 50%;
    }
    .empty {
      height: calc(100% - 94px);
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
