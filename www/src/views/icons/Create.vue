<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { addIcon, BaseIcon, info } from '../../apis/project'
import HeaderVue from '../../components/Header.vue'
import UserVue from '../../components/User.vue'
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
  _id: $route.params.id as string,
  name: '',
  activeTab: 'svg' as Tab,
  icons: [] as Icon[]
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
  cachedIcons.clear()
}

let cachedIcons = new Map<string, Icon>()

function updateIcons() {
  const icons: Icon[] = []
  cachedIcons.forEach((e, k) => {
    if (e.prefix && e.id) {
      e.code = e.id?.substring(e.prefix.length)
    }
    if (oldIcons[e.code]) {
      cachedIcons.delete(k)
      return toast(t('codeExistsAndIconOut', { code: e.code }))
    }
    icons.push(e)
  })
  data.icons = icons
}

function onSVGChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
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
          const doc = parser.parseFromString(reader.result as string, 'image/svg+xml')
          const code = file.name.substring(0, file.name.lastIndexOf('.'))
          let viewBox = doc.documentElement.getAttribute('viewBox')
          if (!viewBox) {
            const w = doc.documentElement.getAttribute('width')
            const h = doc.documentElement.getAttribute('height')
            if (w && h) {
              viewBox = `0 0 ${w} ${h}`
            } else {
              viewBox = ''
            }
          }
          const svg = {
            code,
            name: code,
            svg: {
              viewBox,
              path: Array.from(doc.documentElement.children).map(node => node.outerHTML).join('')
            }
          }
          cachedIcons.set(code, svg)
          updateIcons()
        } catch (err) {
          console.error(err)
          toast.error(t('fileCouldNotBeParsed'))
        }
      }
      reader.onerror = () => {
        toast.error(t('fileLoadFailed'))
      }
    })
  }
}

function onIconfontJSChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    if (files[0].type !== 'text/javascript') {
      return toast.error(t('pleaseSelectFile', {type: '.js'}))
    }
    const reader = new FileReader()
    reader.readAsText(files[0], 'utf-8')
    reader.onload = () => {
      const text = reader.result as string
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
              cachedIcons.set(svg.id, {} as Icon)
            }
            Object.assign(cachedIcons.get(svg.id) as Icon, svg)
          }
        })
        updateIcons()
      }
    }
    reader.onerror = () => {
      toast.error(t('fileLoadFailed'))
    }
  }
}

function onIconfontJSONChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    if (files[0].type !== 'application/json') {
      return toast.error(t('pleaseSelectFile', {type: '.json'}))
    }
    const reader = new FileReader()
    reader.readAsText(files[0], 'utf-8')
    reader.onload = () => {
      const text = reader.result as string
      try {
        const json = JSON.parse(text)
        const prefix = json.css_prefix_text
        if (json.glyphs instanceof Array) {
          json.glyphs.forEach((icon: any) => {
            const id = `${prefix}${icon.font_class}`
            if (!cachedIcons.has(id)) {
              cachedIcons.set(id, {} as Icon)
            }
            Object.assign(cachedIcons.get(id) as Icon, {
              name: icon.name,
              prefix
            })
          })
          updateIcons()
        }
      } catch (err) {
        toast.error(t('fileCouldNotBeParsed'))
      }
    }
    reader.onerror = () => {
      toast.error(t('fileLoadFailed'))
    }
  }
}

async function save () {
  await addIcon(data._id, data.icons)
  toast.success(t('saveDone'))
  $router.replace(`/icons/${data._id}`)
}
</script>

<template>
  <HeaderVue :back="`/icons/${data._id}`">
    <div class="name">{{data.name}}</div>
  </HeaderVue>
  <UserVue />
  <div class="tab flex">
    <div class="item" :class="getTabClass('svg')" @click="setTabActive('svg')">{{t('uploadSVG')}}</div>
    <div class="item" :class="getTabClass('iconfont')" @click="setTabActive('iconfont')">{{t('importIconfont')}}</div>
  </div>
  <div class="wrap">
      <!-- icons -->
    <div class="icons flex start">
      <div v-for="item in data.icons" :key="item.code" class="item">
        <svg :viewBox="item.svg?.viewBox" v-html="item.svg?.path"></svg>
        <div v-if="item.code" class="name" :title="item.code">{{item.code}}</div>
        <div v-if="item.name && item.code !== item.name" class="name" :title="item.name">{{item.name}}</div>
      </div>
    </div>
    <div v-if="data.activeTab === 'svg'" class="upload flex center">
      <label for="svg">
        {{t('selectIconFile', {type: 'SVG'})}}
        <input id="svg" type="file" @change="onSVGChange" accept="image/svg+xml" multiple/>
      </label>
    </div>
    <div v-if="data.activeTab === 'iconfont'"  class="upload flex center">
      <label for="javascript">
         {{t('selectIconFile', {type: 'iconfont.js'})}}
        <input id="javascript" type="file" @change="onIconfontJSChange" accept="text/javascript"/>
      </label>
    </div>
    <div v-if="data.activeTab === 'iconfont'"  class="upload flex center m-top">
      <label>
         {{t('selectIconFile', {type: 'iconfont.json'})}}
        <input type="file" @change="onIconfontJSONChange" accept="application/json">
      </label>
    </div>
    <!-- button -->
    <div class="flex center">
      <button class="btn danger" :disabled="data.icons.length === 0" @click="save">{{t('save')}}</button>
    </div>
  </div>
  <div class="footer"></div>
</template>

<style lang="scss" scoped>
@import "../../styles/var.scss";

.tab {
  border-radius: 3rem;
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
    border-radius: 3rem;
    &.active {
      background: $color-main;
      color: #fff;
    }
  }
}

.wrap {
  width: 90rem;
  background-color: #ffffff;
	border-radius: 1rem;
  margin: 4rem auto 0;
  padding: 5rem;
  padding-bottom: 3rem;
  .icons {
    flex-wrap: wrap;
    min-height: calc(100vh - 40rem);

    .item {
      width: 11.25rem;
      text-align: center;
      margin-bottom: 5rem;
    }

    svg {
      height: 2rem;
    }

    .name {
      width: 80%;
      margin: 1rem auto 0;
      font-size: 1rem;
      letter-spacing: 0rem;
      color: #808080;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
  }

  .upload {
    font-size: 1rem;
    letter-spacing: 0rem;
    color: #476de8;
    height: 2rem;

    label {
      cursor: pointer;
    }

    +div:not(.upload) {
      margin-top: 2rem;
    }
    
    input[type="file"] {  
      display: none;
    }
  }
}

.footer {
  height: 5rem;
}
</style>