<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { info } from '../../apis/project'
import HeaderVue from '../../components/Header.vue'
import { toast } from '../../utils';

interface Icon {
  id?: string
  code?: string
  name?: string
  prefix?: string
  svg?: {
    viewBox: string
    path: string
  }
}

const $route = useRoute()

const data = reactive({
  _id: <string>$route.params.id,
  name: '',
  activeTab: 'iconfont',
  icons: <Icon[]>[]
})

async function getInfo () {
  const res = await info(data._id, 'name icons')
  Object.assign(data, res)
}

function getTabClass(type: 'svg'|'iconfont') {
  return data.activeTab === type ? 'active' : ''
}

function setTabActive(type: 'svg'|'iconfont') {
  data.activeTab = type
}

function onSVGChange() {

}

let cachedIcons = new Map<string, Icon>()

function updateIcons() {
  const icons: Icon[] = []
  cachedIcons.forEach(e => {
    if (e.prefix) {
      e.code = e.id?.substring(e.prefix.length)
    }
    icons.push(e)
  })
  data.icons = icons
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
              cachedIcons.set(svg.id, {})
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
              cachedIcons.set(id, {})
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

getInfo()
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
    <input type="file" @change="onSVGChange" >
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