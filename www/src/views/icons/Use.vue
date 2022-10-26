<script setup lang="ts">
import { computed, reactive, watchPostEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { info, Files, genIcon, FileInfo } from '@/apis/project'
import HeaderVue from '@/components/Header.vue'
import UserVue from '@/components/User.vue'
import { copy, toast } from '@/utils'
import { PERMANENT_EXPIRE, TEMPORARY_EXPIRE, ONE_DAY_SECONDS } from '@/utils/const'
import { ElSwitch } from 'element-plus'

const { t } = useI18n()
const $route = useRoute()

type Tab = 'css'|'js'|'vue'|'react'

const data = reactive({
  _id: $route.params.id as string,
  name: '',
  class: '',
  prefix: '',
  iconUpdateTime: '',
  files: {} as Files,
  activeTab: 'css' as Tab,
  src: '',
  generating: new Set()
})

const lastItem = <T>(arr: T[] | undefined): T | undefined => (arr instanceof Array ? arr[arr.length - 1] : undefined)

const genFileLink = (hash: string, ext: 'js'|'css') => `${data.files.domain}/src/${data._id}/${hash}/iconlake.${ext}`

const isPermanent = (days: number) => days >= PERMANENT_EXPIRE

const getExpireTime = (file: FileInfo) => Math.ceil(
  file.expire - (Date.now() - (+new Date(file.createTime))) / ONE_DAY_SECONDS
)

const cssLink = computed(() => `<link rel="stylesheet" href="${data.src}">`)
const cssExample = computed(() => `<i class="${data.class} ${data.prefix}home"></i>`)

const jsLink = computed(() => `\<script src="${data.src}"\>\<\/script\>`)
const jsExample = '<icon-svg name="home"></icon-svg>'

const cssUpgradable = computed(() => {
  const file = lastItem(data.files.css)
  return !file || +new Date(file.createTime) < +new Date(data.iconUpdateTime)
})
const jsUpgradable = computed(() => {
  const file = lastItem(data.files.js)
  return !file || +new Date(file.createTime) < +new Date(data.iconUpdateTime)
})

watchPostEffect(() => {
  const v = data.activeTab
  if (v === 'vue' || v === 'react') {
    data.src = t('loading')
    v === 'vue' && getVueContent()
    v === 'react' && getReactContent()
    return
  }
  const file = lastItem(data.files[v])
  data.src = file?.hash ? genFileLink(file.hash, v) : ''
})

async function getInfo () {
  const res = await info(data._id, 'name files iconUpdateTime class prefix')
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
  if (tab === 'vue' || tab === 'react' || data.generating.has(tab)) {
    return
  }
  data.generating.add(tab)
  const res = await genIcon(data._id, tab).finally(() => {
    data.generating.delete(tab)
  })
  data.files[tab]?.push(res)
  toast(t('generateDone'))
}

async function getVueContent() {
  data.src = (await genIcon(data._id, 'vue')).content || ''
}

async function getReactContent() {
  data.src = (await genIcon(data._id, 'react')).content || ''
}

function copyContent (str: string) {
  copy(str)
  toast(t('copyDone'))
}

function setExpire(id: string, value: number) {
  console.log(id, value)
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
    <div class="item" :class="getTabClass('react')" @click="setTabActive('react')">React</div>
  </div>
  <!-- css -->
  <div v-if="data.activeTab === 'css'" class="content use-css">
    <h2 class="t-center">{{t('useWithType', {type: 'CSS'})}}</h2>
    <p>{{t('includeType', {type: 'CSS'})}}{{t('colon')}}</p>
    <div class="code flex" @click="copyContent(cssLink)" :title="t('copy')">
      <span>{{cssLink}}</span>
      <i class="iconfont icon-copy"></i>
    </div>
    <p>{{t('displayIcon')}}{{t('colon')}}</p>
    <div class="code flex" @click="copyContent(cssExample)" :title="t('copy')">
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
    <div class="code flex" @click="copyContent(jsLink)" :title="t('copy')">
      <span>{{jsLink}}</span>
      <i class="iconfont icon-copy"></i>
    </div>
    <p>{{t('displayIcon')}}{{t('colon')}}</p>
    <div class="code flex" @click="copyContent(jsExample)" :title="t('copy')">
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
    <div class="code vue flex" @click="copyContent(data.src)" :title="t('copy')">
      <pre>{{data.src}}</pre>
      <i class="iconfont icon-copy"></i>
    </div>
  </div>
  <!-- react -->
  <div v-else-if="data.activeTab === 'react'" class="content use-vue">
    <h2 class="t-center">{{t('useWithType', {type: t('reactComponent')})}}</h2>
    <p>{{t('componentFile')}}{{t('colon')}}</p>
    <div class="code vue flex" @click="copyContent(data.src)" :title="t('copy')">
      <pre>{{data.src}}</pre>
      <i class="iconfont icon-copy"></i>
    </div>
  </div>
  <!-- files -->
  <div v-if="data.activeTab === 'css' || data.activeTab === 'js'" class="content files">
    <div class="flex">
      <p>{{t('generatedFileLinks')}}</p>
      <div class="help">{{t('generationNote', {n: data.files.permamentMaxNum})}}</div>
    </div>
    <div
      v-for="file in data.files[data.activeTab]"
      :key="file.hash" class="code flex"
      :title="t('copy')"
      @click="copyContent(genFileLink(file.hash, data.activeTab as 'css'|'js'))"
    >
      <div>
        <span>{{genFileLink(file.hash, data.activeTab)}}</span>
        <i class="iconfont icon-copy"></i>
      </div>
      <div class="expire">
        <ElSwitch
          v-model="file.expire"
          :active-value="PERMANENT_EXPIRE"
          :active-text="t('permanent')"
          :inactive-value="TEMPORARY_EXPIRE"
          :inactive-text="t('temporary')"
          :inline-prompt="true"
          @click.stop="() => false"
          @change="setExpire(file._id, $event as number)"
        ></ElSwitch>
        <div v-if="!isPermanent(file.expire)" class="days">{{t('nDaysExpire', {n: getExpireTime(file)})}}</div>
      </div>
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
.files {
  .help {
    margin-top: 1rem;
    font-size: 1rem;
    color: #aaa;
    text-align: left;
  }
  .code {
    margin-bottom: 1.7rem;
    .icon-copy {
      margin-left: 1rem;
    }
  }
  .expire {
    position: relative;
    .el-switch {
      height: 20px;
    }
    .days {
      position: absolute;
      font-size: 1rem;
      bottom: -1.35rem;
      left: -50%;
      right: -50%;
      text-align: center;
      transform: scale(0.6);
      white-space: nowrap;
      color: #aaa;
    }
  }
}
</style>
