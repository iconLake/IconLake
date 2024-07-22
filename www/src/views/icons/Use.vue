<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchPostEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { projectApis, Files, genIcon, FileInfo, setExpire, Member } from '@/apis/project'
import HeaderVue from '@/components/Header.vue'
import UserVue from '@/components/User.vue'
import { copy, toast } from '@/utils'
import { PERMANENT_FILE_EXPIRE, TEMPORARY_FILE_EXPIRE, ONE_DAY_SECONDS } from '@/utils/const'
import { ElSwitch } from 'element-plus'
import { userApis, UserInfo } from '@/apis/user'
import { usePageLoading } from '@/hooks/router'
import Loading from '@/components/Loading.vue'

const { t } = useI18n()
const pageLoading = usePageLoading()

const $route = useRoute()

type Tab = 'css'|'js'|'vue'|'react'

const userInfo = ref({} as UserInfo)

const data = reactive({
  _id: $route.params.id as string,
  name: '',
  class: '',
  prefix: '',
  iconUpdateTime: '',
  files: {} as Files,
  icons: [],
  activeTab: 'css' as Tab,
  src: '',
  generating: new Set(),
  members: [] as Member[]
})

const editable = computed(() => {
  if (data.members.length === 0) {
    return false
  }
  return data.members.some(e => e.userId === userInfo.value._id)
})

const getLatestFile = (arr: FileInfo[] | undefined): FileInfo | undefined => {
  if (arr instanceof Array && arr.length > 0) {
    if (arr[0].createTime >= arr[arr.length - 1].createTime) {
      return arr[0]
    }
    return arr[arr.length - 1]
  }
  return undefined
}

const genFileLink = (hash: string, ext: 'js'|'css') => `${data.files.domain}/src/${data._id}/${hash}/iconlake.${ext}`

const isPermanent = (days: number) => days >= PERMANENT_FILE_EXPIRE

const getExpireTime = (file: FileInfo) => {
  const n = Math.ceil(
    file.expire - (Date.now() - (+new Date(file.createTime))) / ONE_DAY_SECONDS
  )
  return n < 0 ? 0 : n
}

const cssLink = computed(() => `<link rel="stylesheet" href="${data.src}">`)
const cssExample = computed(() => `<i class="${data.class} ${data.prefix}home"></i>`)

const jsLink = computed(() => `\<script src="${data.src}"\>\<\/script\>`)
const jsExample = '<icon-svg name="home"></icon-svg>'

const isFileListShow = computed(() => (data.activeTab === 'css' || data.activeTab === 'js') && data.files[data.activeTab] instanceof Array && (data.files[data.activeTab] as []).length > 0)

const cssUpgradable = computed(() => {
  const file = getLatestFile(data.files.css)
  return !file || +new Date(file.createTime) < +new Date(data.iconUpdateTime)
})
const jsUpgradable = computed(() => {
  const file = getLatestFile(data.files.js)
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
  const file = getLatestFile(data.files[v])
  data.src = file?.hash ? genFileLink(file.hash, v) : ''
})

async function getInfo () {
  projectApis.info(data._id, 'name files iconUpdateTime class prefix icons.length').onUpdate(async res => {
    if (res.files.css) {
      res.files.css.reverse()
    }
    if (res.files.js) {
      res.files.js.reverse()
    }
    Object.assign(data, res)
  })
}

onMounted(() => {
  userApis.info().onUpdate(async u => {
    userInfo.value = u
  })
  getInfo().finally(() => {
    pageLoading.end()
  })
})

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
  if (res.hash) {
    const latestFile = getLatestFile(data.files[tab])
    if (!latestFile || latestFile.hash !== res.hash) {
      data.files[tab]?.unshift(res)
    }
    toast(t('generateDone'))
  }
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

function onBeforeSetExpire(file: FileInfo) {
  if (isPermanent(file.expire)) {
    return true
  }
  if (data.activeTab !== 'css' && data.activeTab !== 'js') {
    return false
  }
  const n = data.files[data.activeTab]?.reduce((pre, cur) => {
    return pre + (isPermanent(cur.expire) ? 1 : 0)
  }, 0) || 0
  if (n >= data.files.permamentMaxNum) {
    toast(t('generationNote', {n: data.files.permamentMaxNum}))
    return false
  }
  return true
}

async function onSetExpire(id: string, value: number) {
  if (data.activeTab !== 'css' && data.activeTab !== 'js') {
    return
  }
  await setExpire(data._id, id, data.activeTab, value)
  toast(t('saveDone'))
}
</script>

<template>
  <HeaderVue :back="`/icons/${data._id}`">
    <div class="name">
      {{ data.name }}
    </div>
  </HeaderVue>
  <UserVue />
  <div class="tab flex">
    <div
      class="item"
      :class="getTabClass('css')"
      @click="setTabActive('css')"
    >
      <span>CSS</span>
      <span
        v-if="cssUpgradable"
        class="alert"
        :title="t('upgradable')"
      />
    </div>
    <div
      class="item"
      :class="getTabClass('js')"
      @click="setTabActive('js')"
    >
      <span>Javascript</span>
      <span
        v-if="jsUpgradable"
        class="alert"
        :title="t('upgradable')"
      />
    </div>
    <div
      class="item"
      :class="getTabClass('vue')"
      @click="setTabActive('vue')"
    >
      Vue
    </div>
    <div
      class="item"
      :class="getTabClass('react')"
      @click="setTabActive('react')"
    >
      React
    </div>
  </div>
  <!-- css -->
  <div
    v-if="data.activeTab === 'css'"
    class="content use-css"
  >
    <h2 class="t-center">
      {{ t('useWithType', {type: 'CSS'}) }}
    </h2>
    <p>{{ t('includeType', {type: 'CSS'}) }}{{ t('colon') }}</p>
    <div
      class="code flex"
      :title="t('copy')"
      @click="copyContent(cssLink)"
    >
      <span>{{ cssLink }}</span>
      <i class="iconfont icon-copy" />
    </div>
    <p>{{ t('displayIcon') }}{{ t('colon') }}</p>
    <div
      class="code flex"
      :title="t('copy')"
      @click="copyContent(cssExample)"
    >
      <span>{{ cssExample }}</span>
      <i class="iconfont icon-copy" />
    </div>
    <div class="t-center operate">
      <button
        v-if="editable"
        class="btn"
        :disabled="data.icons.length === 0"
        @click="generate"
      >
        {{ t(data.generating.has('css') ? 'generating' : 'regenerate') }}
        <Loading v-if="data.generating.has('css')" />
      </button>
    </div>
  </div>
  <!-- js -->
  <div
    v-else-if="data.activeTab === 'js'"
    class="content use-js"
  >
    <h2 class="t-center">
      {{ t('useWithType', {type: 'Javascript'}) }}
    </h2>
    <p>{{ t('includeType', {type: 'Javascript'}) }}{{ t('colon') }}</p>
    <div
      class="code flex"
      :title="t('copy')"
      @click="copyContent(jsLink)"
    >
      <span>{{ jsLink }}</span>
      <i class="iconfont icon-copy" />
    </div>
    <p>{{ t('displayIcon') }}{{ t('colon') }}</p>
    <div
      class="code flex"
      :title="t('copy')"
      @click="copyContent(jsExample)"
    >
      <span>{{ jsExample }}</span>
      <i class="iconfont icon-copy" />
    </div>
    <div class="t-center operate">
      <button
        v-if="editable"
        class="btn"
        :disabled="data.icons.length === 0"
        @click="generate"
      >
        {{ t(data.generating.has('js') ? 'generating' : 'regenerate') }}
        <Loading v-if="data.generating.has('js')" />
      </button>
    </div>
  </div>
  <!-- vue -->
  <div
    v-else-if="data.activeTab === 'vue'"
    class="content use-vue"
  >
    <h2 class="t-center">
      {{ t('useWithType', {type: t('vueComponent')}) }}
    </h2>
    <p>{{ t('componentFile') }}{{ t('colon') }}</p>
    <div
      class="code vue flex"
      :title="t('copy')"
      @click="copyContent(data.src)"
    >
      <pre>{{ data.src }}</pre>
      <i class="iconfont icon-copy" />
    </div>
  </div>
  <!-- react -->
  <div
    v-else-if="data.activeTab === 'react'"
    class="content use-vue"
  >
    <h2 class="t-center">
      {{ t('useWithType', {type: t('reactComponent')}) }}
    </h2>
    <p>{{ t('componentFile') }}{{ t('colon') }}</p>
    <div
      class="code vue flex"
      :title="t('copy')"
      @click="copyContent(data.src)"
    >
      <pre>{{ data.src }}</pre>
      <i class="iconfont icon-copy" />
    </div>
  </div>
  <!-- files -->
  <div
    v-if="isFileListShow"
    class="content files"
  >
    <div class="flex">
      <p>{{ t('generatedFileLinks') }}</p>
      <div class="help">
        {{ t('generationNote', {n: data.files.permamentMaxNum}) }}
      </div>
    </div>
    <div
      v-for="file in data.files[data.activeTab as 'js'|'css']"
      :key="file._id"
      class="code flex"
      :title="t('copy')"
      @click="copyContent(genFileLink(file.hash, data.activeTab as 'css'|'js'))"
    >
      <div>
        <span>{{ genFileLink(file.hash, data.activeTab as 'js'|'css') }}</span>
        <i class="iconfont icon-copy" />
      </div>
      <div class="expire">
        <ElSwitch
          v-if="editable"
          v-model="file.expire"
          :title="t('validity')"
          :active-value="PERMANENT_FILE_EXPIRE"
          :active-text="t('permanent')"
          :inactive-value="TEMPORARY_FILE_EXPIRE"
          :inactive-text="t('temporary')"
          :inline-prompt="true"
          :before-change="() => onBeforeSetExpire(file)"
          @click.stop="() => false"
          @change="onSetExpire(file._id, $event as number)"
        />
        <div
          v-if="!isPermanent(file.expire)"
          class="days"
        >
          {{ t('nDaysExpire', {n: getExpireTime(file)}) }}
        </div>
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
    .loading {
      margin-left: 0.8rem;
    }
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
    min-width: 3rem;
    .el-switch {
      height: 2rem;
      margin-bottom: 0.3rem;
    }
    .days {
      font-size: 1rem;
      text-align: center;
      transform: scale(0.8);
      white-space: nowrap;
      color: #aaa;
    }
  }
}
</style>
