<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { addIcon, BaseIcon, info } from '../../apis/project'
import HeaderVue from '../../components/Header.vue'
import { toast } from '../../utils'

const { t } = useI18n()

interface Icon extends BaseIcon {
  id?: string
  prefix?: string
}

type Tab = 'svg'|'iconfont'

const $route = useRoute()
const $router = useRouter()

const data = reactive({
  _id: <string>$route.params.id,
  name: '',
  activeTab: <Tab>'svg',
  icons: <Icon[]>[]
})

const oldIcons: {[propName: string]: any} = {}

async function getInfo () {
  const res = await info(data._id, 'name icons')
  data.name = res.name
  res.icons.forEach(e => {
    oldIcons[e.code] = e
  })
}

getInfo()

function getTabClass(type: Tab) {
  return data.activeTab === type ? 'active' : ''
}

function setTabActive(type: Tab) {
  data.activeTab = type
  data.icons.length = 0
}

let cachedIcons = new Map<string, Icon>()

function updateIcons() {
  const icons: Icon[] = []
  cachedIcons.forEach(e => {
    if (e.prefix && e.id) {
      e.code = e.id?.substring(e.prefix.length)
    }
    icons.push(e)
  })
  data.icons = icons
}

function onSVGChange(e: Event) {
  const files = (<HTMLInputElement>e.target).files
  if (files && files.length > 0) {
    Array.from(files).forEach(file => {
      if (file.type !== 'image/svg+xml') {
        return
      }
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = () => {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(<string>reader.result, 'image/svg+xml')
          const code = file.name.substring(0, file.name.lastIndexOf('.'))
          const svg = {
            code,
            name: code,
            svg: {
              viewBox: doc.documentElement.getAttribute('viewBox') || '',
              path: Array.from(doc.documentElement.children).map(node => node.outerHTML).join('')
            }
          }
          cachedIcons.set(code, svg)
          updateIcons()
        } catch (err) {
          console.error(err)
          toast.error('文件无法解析')
        }
      }
      reader.onerror = () => {
        toast.error('文件加载失败')
      }
    })
  }
}

function onIconfontJSChange(e: Event) {
  const files = (<HTMLInputElement>e.target).files
  if (files && files.length > 0) {
    if (files[0].type !== 'text/javascript') {
      return toast.error('请选择.js文件')
    }
    const reader = new FileReader()
    reader.readAsText(files[0], 'utf-8')
    reader.onload = () => {
      const text = <string>reader.result
      const symbols = text.match(/<symbol.*?>.*?<\/symbol>/ig)
      if (symbols) {
        symbols.forEach(symbol => {
          const props = symbol.match(/^<symbol.*?id="(.*?)".*?viewBox="(.*?)">(.*?)<\/symbol>$/i)
          if (props) {
            const svg = {
              id: props[1],
              code: props[1],
              svg: {
                viewBox: props[2],
                path: props[3]
              }
            }
            if (!cachedIcons.has(svg.id)) {
              cachedIcons.set(svg.id, <Icon>{})
            }
            Object.assign(<Icon>cachedIcons.get(svg.id), svg)
          }
        })
        updateIcons()
      }
    }
    reader.onerror = () => {
      toast.error('文件加载失败')
    }
  }
}

function onIconfontJSONChange(e: Event) {
  const files = (<HTMLInputElement>e.target).files
  if (files && files.length > 0) {
    if (files[0].type !== 'application/json') {
      return toast.error('请选择.json文件')
    }
    const reader = new FileReader()
    reader.readAsText(files[0], 'utf-8')
    reader.onload = () => {
      const text = <string>reader.result
      try {
        const json = JSON.parse(text)
        const prefix = json.css_prefix_text
        if (json.glyphs instanceof Array) {
          json.glyphs.forEach((icon: any) => {
            const id = `${prefix}${icon.font_class}`
            if (!cachedIcons.has(id)) {
              cachedIcons.set(id, <Icon>{})
            }
            Object.assign(<Icon>cachedIcons.get(id), {
              name: icon.name,
              prefix
            })
          })
          updateIcons()
        }
      } catch (err) {
        toast.error('文件无法解析')
      }
    }
    reader.onerror = () => {
      toast.error('文件加载失败')
    }
  }
}

async function save () {
  await addIcon(data._id, data.icons)
  toast.success('保存成功')
  $router.replace(`/icons/${data._id}`)
}
</script>

<template>
  <HeaderVue :back="`/icons/${data._id}`">
    <div class="name">{{data.name}}</div>
  </HeaderVue>
  <div class="tab flex">
    <div class="item" :class="getTabClass('svg')" @click="setTabActive('svg')">上传SVG</div>
    <div class="item" :class="getTabClass('iconfont')" @click="setTabActive('iconfont')">导入iconfont</div>
  </div>
  <div v-if="data.activeTab === 'svg'" class="upload-svg">
    <input type="file" @change="onSVGChange" accept="image/svg+xml" multiple >
  </div>
  <div v-if="data.activeTab === 'iconfont'">
    <div>iconfont.js文件</div>
    <div>
      <input type="file" @change="onIconfontJSChange" accept="text/javascript">
    </div>
    <div>iconfont.json文件</div>
    <div>
      <input type="file" @change="onIconfontJSONChange" accept="application/json">
    </div>
  </div>
  <!-- icons -->
  <div class="icons flex start">
    <div v-for="item in data.icons" :key="item.code" class="item">
      <svg :viewBox="item.svg?.viewBox" v-html="item.svg?.path"></svg>
      <div class="name">{{item.name}}</div>
    </div>
  </div>
  <!-- button -->
  <div class="flex center">
    <button class="btn" :disabled="data.icons.length === 0" @click="save">{{t('save')}}</button>
  </div>
</template>

<style lang="scss" scoped>
@import "../../styles/var.scss";

.tab {
  border-radius: 1rem;
  background: #fff;
  overflow: hidden;
  width: 40%;
  min-width: 30rem;
  margin: 0 auto;
  .item {
    flex: 1 1 50%;
    text-align: center;
    padding: 1.5rem 0;
    cursor: pointer;
    &.active {
      background: $color-main;
      color: #fff;
    }
  }
}

.icons {
  flex-wrap: wrap;
  .item {
    padding: 1rem;
    min-width: 5rem;
  }
  svg {
    width: 2rem;
    height: 2rem;
  }
}
</style>