<script setup lang="ts">
import { computed, reactive, watchPostEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { info, Files, genIcon, FileInfo } from '../../apis/project'
import HeaderVue from '../../components/Header.vue'
import UserVue from '../../components/User.vue'
import { copy, toast } from '../../utils'

const { t } = useI18n()
const $route = useRoute()

type Tab = 'css'|'js'|'vue'

const data = reactive({
  _id: <string>$route.params.id,
  name: '',
  class: '',
  prefix: '',
  iconUpdateTime: '',
  file: <Files>{},
  activeTab: <Tab>'css',
  src: '',
  generating: new Set()
})

const cssLink = computed(() => `<link rel="stylesheet" href="${data.src}">`)
const cssExample = computed(() => `<i class="${data.class} ${data.prefix}home"></i>`)

const jsLink = computed(() => `\<script src="${data.src}"\>\<\/script\>`)
const jsExample = '<icon-svg name="home"></icon-svg>'

const cssUpgradable = computed(() => !data.file.css?.updateTime
  || +new Date(data.file.css?.updateTime) < +new Date(data.iconUpdateTime))
const jsUpgradable = computed(() => !data.file.js?.updateTime
  || +new Date(data.file.js?.updateTime) < +new Date(data.iconUpdateTime))

watchPostEffect(() => {
  const v = data.activeTab
  if (v === 'vue') {
    data.src = t('loading')
    getVueContent()
    return
  }
  data.src = data.file[v]?.hash ? `${data.file.domain}/src/${data._id}/${data.file[v]?.hash}/iconlake.${v}` : ''
})

async function getInfo () {
  const res = await info(data._id, 'name file iconUpdateTime class prefix')
  Object.assign(data, res)
}

getInfo()

function getTabClass(type: Tab) {
  return data.activeTab === type ? 'active' : ''
}

function setTabActive(type: Tab) {
  data.activeTab = type
}

async function generate() {
  const tab = data.activeTab
  if (tab === 'vue' || data.generating.has(tab)) {
    return
  }
  data.generating.add(tab)
  if (!data.file[tab]) {
    data.file[tab] = {
      updateTime: '',
      hash: ''
    }
  }
  const res = await genIcon(data._id, tab).finally(() => {
    data.generating.delete(tab)
  })
  Object.assign(<FileInfo>data.file[tab], res)
  toast(t('generateDone'))
}

async function getVueContent() {
  data.src = (await genIcon(data._id, 'vue')).content || ''
}

function copyContent (str: string) {
  copy(str)
  toast(t('copyDone'))
}
</script>

<template>
  <HeaderVue :back="`/icons/${data._id}`">
    <div class="name">{{data.name}}</div>
  </HeaderVue>
  <UserVue />
  <div class="tab flex">
    <div class="item" :class="getTabClass('css')" @click="setTabActive('css')">
      <span>CSS</span>
      <span v-if="cssUpgradable" class="alert" :title="t('upgradable')"></span>
    </div>
    <div class="item" :class="getTabClass('js')" @click="setTabActive('js')">
      <span>Javascript</span>
      <span v-if="jsUpgradable" class="alert" :title="t('upgradable')"></span>
    </div>
    <div class="item" :class="getTabClass('vue')" @click="setTabActive('vue')">Vue</div>
  </div>
  <!-- css -->
  <div v-if="data.activeTab === 'css'" class="content use-css">
    <h2 class="t-center">{{t('useWithType', {type: 'CSS'})}}</h2>
    <p>{{t('includeType', {type: 'CSS'})}}{{t('colon')}}</p>
    <div class="code flex" @click="copyContent(cssLink)">
      <span>{{cssLink}}</span>
      <i class="iconfont icon-copy"></i>
    </div>
    <p>{{t('displayIcon')}}{{t('colon')}}</p>
    <div class="code flex" @click="copyContent(cssExample)">
      <span>{{cssExample}}</span>
      <i class="iconfont icon-copy"></i>
    </div>
    <div class="t-center operate">
      <button class="btn" @click="generate">{{t(data.generating.has('css') ? 'generating' : 'regenerate')}}</button>
    </div>
  </div>
  <!-- js -->
  <div v-else-if="data.activeTab === 'js'" class="content use-js">
    <h2 class="t-center">{{t('useWithType', {type: 'Javascript'})}}</h2>
    <p>{{t('includeType', {type: 'Javascript'})}}{{t('colon')}}</p>
    <div class="code flex" @click="copyContent(jsLink)">
      <span>{{jsLink}}</span>
      <i class="iconfont icon-copy"></i>
    </div>
    <p>{{t('displayIcon')}}{{t('colon')}}</p>
    <div class="code flex" @click="copyContent(jsExample)">
      <span>{{jsExample}}</span>
      <i class="iconfont icon-copy"></i>
    </div>
    <div class="t-center operate">
      <button class="btn" @click="generate">{{t(data.generating.has('js') ? 'generating' : 'regenerate')}}</button>
    </div>
  </div>
  <!-- vue -->
  <div v-else-if="data.activeTab === 'vue'" class="content use-vue">
    <h2 class="t-center">{{t('useWithType', {type: t('vueComponent')})}}</h2>
    <p>{{t('componentFile')}}{{t('colon')}}</p>
    <div class="code vue flex" @click="copyContent(data.src)">
      <pre>{{data.src}}</pre>
      <i class="iconfont icon-copy"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../styles/var.scss";

.name {
  margin-left: 2.2rem;
}
.tab {
  border-radius: 3rem;
  background: #fff;
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
  .alert {
    display: inline-block;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 0.3rem;
    background: $color-danger;
    position: relative;
    top: -1rem;
    left: 0.5rem;
  }
}
.content {
  width: 100rem;
  margin: 7rem auto 0;
  h2 {
    margin-bottom: 5rem;
  }
  p {
    margin: 1.7rem 0;
  }
  &.use-vue {
    &::after {
      content: "";
      display: block;
      height: 2rem;
    }
  }
  .code {
    background: #fff;
    color: $color-main;
    padding: 1.8rem 2.8rem;
    border-radius: 0.4rem;
    cursor: pointer;
    span {
      line-height: 1.4;
    }
    &.vue {
      align-items: flex-start;
      pre {
        overflow: auto;
        line-height: 1.4;
        font-family: inherit;
      }
    }
  }
  .operate {
    padding: 2rem 0;
  }
}
</style>
