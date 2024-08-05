<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { addIcon, BaseIcon, projectApis, uploadFile } from '../../apis/project'
import HeaderVue from '../../components/Header.vue'
import UserVue from '../../components/User.vue'
import { readFileAsBlob, readFileAsText, toast } from '../../utils'
import { MD5, lib } from 'crypto-js'
import { usePageLoading } from '@/hooks/router'
import { PROJECT_TYPE, PROJECT_TYPE_STRING, UPLOAD_FILE_SIZE_LIMIT } from '@/utils/const'
import Loading from '@/components/Loading.vue'
import { isImgFile, isSvgFile } from '@/utils/file'

const { t } = useI18n()
const pageLoading = usePageLoading()

enum UploadStatus {
  Uploading,
  Success,
  Fail
}

interface Icon extends BaseIcon {
  id?: string
  prefix?: string
  uploadStatus?: UploadStatus
}

type Tab = 'svg'|'iconfont'|'extension'|'img'

const $route = useRoute()
const $router = useRouter()

const data = reactive({
  _id: $route.params.id as string,
  type: 0,
  name: '',
  activeTab: 'extension' as Tab,
  icons: [] as Icon[]
})

const oldIcons: {[propName: string]: any} = {}

const uploading = reactive({
  success: 0,
  fail: 0,
  total: 0
})

async function getInfo () {
  projectApis.info(data._id, 'type name icons').onUpdate(async (res) => {
    data.type = res.type
    data.name = res.name
    data.activeTab = ['', 'svg', 'img'][data.type] as Tab
    res.icons.forEach(e => {
      oldIcons[e.code] = e
    })
  })
}

onMounted(() => {
  getInfo().finally(() => {
    pageLoading.end()
  })
})

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

function uploadMedia(type: string, code: string, content: string | Blob, name: string, fileName?: string) {
  return new Promise(async (resolve, reject) => {
    uploading.total++
    if (cachedIcons.has(code)) {
      toast(t('codeExistsAndIconOut', { code }))
      reject('code exists')
      return
    } else {
      const reader = new FileReader()
      const blob = content instanceof Blob ? content : new Blob([content], { type: 'image/svg+xml' })
      reader.readAsDataURL(blob)
      reader.onload = () => {
        cachedIcons.set(code, {
          code,
          name,
          [type]: {
            url: reader.result as string,
          },
          uploadStatus: UploadStatus.Uploading
        })
        updateIcons()
      }
    }
    uploadFile({
      projectId: data._id,
      _id: fileName || name,
      data: content,
    }).then(res => {
      uploading.success++
      if (cachedIcons.has(code)) {
        Object.assign(cachedIcons.get(code) as Icon, {
          [type]: {
            url: res.url,
          },
          uploadStatus: UploadStatus.Success
        })
        updateIcons()
        resolve(cachedIcons.get(code))
      } else {
        reject('icon deleted')
      }
    }).catch((err) => {
      uploading.fail++
      console.error(err)
      if (cachedIcons.has(code)) {
        Object.assign(cachedIcons.get(code) as Icon, {
          uploadStatus: UploadStatus.Fail
        })
        updateIcons()
      }
      toast.error(t('fileUploadFailed'))
      reject(err)
    })
  })
}

function onSVGChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    Array.from(files).forEach(async file => {
      if (!isSvgFile(file)) {
        return
      }
      if (!file.size || file.size > UPLOAD_FILE_SIZE_LIMIT) {
        toast(t('fileSizeLimitExceeded'))
        return
      }
      const svgText = await readFileAsText(file)
      const code = file.name.substring(0, file.name.lastIndexOf('.'))
      const hash = MD5(svgText).toString()
      uploadMedia('svg', code, svgText, `${hash}.svg`)
    })
  }
}

function onImgChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    Array.from(files).forEach(async file => {
      if (!isImgFile(file)) {
        return
      }
      if (!file.size || file.size > UPLOAD_FILE_SIZE_LIMIT) {
        toast(t('fileSizeLimitExceeded'))
        return
      }
      const imgBlob = await readFileAsBlob(file)
      const name = file.name.substring(0, file.name.lastIndexOf('.'))
      const buf = await imgBlob.arrayBuffer()
      const hash = MD5(lib.WordArray.create(Array.from(new Uint8Array(buf)))).toString()
      const code  = `${hash}.${file.name.substring(file.name.lastIndexOf('.') + 1)}`
      uploadMedia('img', code, imgBlob, name, code)
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
            const svgText = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="${props[2]}">${props[3]}</svg>`
            uploading.total++
            const hash = MD5(svgText).toString()
            uploadMedia('svg', props[1], svgText, `${hash}.svg`).then(() => {
              uploading.success++
            }).catch(() => {
              uploading.fail++
            })
          }
        })
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
              id,
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

async function deleteIcon (icon: Icon) {
  cachedIcons.delete(icon.code)
  updateIcons()
}

const isSaving = ref(false)
async function save () {
  if (uploading.success + uploading.fail < uploading.total) {
    toast.error(t('waitForUploadFinish'))
    return
  }
  if (isSaving.value) {
    return
  }
  const icons = data.icons.filter(e => e.uploadStatus === UploadStatus.Success)
  isSaving.value = true
  await addIcon(data._id, icons)
  toast.success(t('saveDone'))
  $router.replace(`/icons/${data._id}`)
  isSaving.value = false
}
const uploadedIconCount = computed(() => data.icons.filter(e => e.uploadStatus === UploadStatus.Success).length)
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
      v-if="data.type === PROJECT_TYPE.IMG"
      class="item"
      :class="getTabClass('img')"
      @click="setTabActive('img')"
    >
      {{ t('uploadImg') }}
    </div>
    <div
      v-if="data.type === PROJECT_TYPE.SVG"
      class="item"
      :class="getTabClass('svg')"
      @click="setTabActive('svg')"
    >
      {{ t('uploadSVG') }}
    </div>
    <div
      v-if="data.type === PROJECT_TYPE.SVG"
      class="item"
      :class="getTabClass('iconfont')"
      @click="setTabActive('iconfont')"
    >
      {{ t('importIconfont') }}
    </div>
    <div
      class="item"
      :class="getTabClass('extension')"
      @click="setTabActive('extension')"
    >
      {{ t('collectIcons') }}
    </div>
  </div>
  <div class="wrap">
    <!-- icons -->
    <div
      v-if="data.activeTab === 'svg' || data.activeTab === 'img' || data.activeTab === 'iconfont'"
      :class="`icons flex start type-${PROJECT_TYPE_STRING[data.type]}`"
    >
      <div
        v-for="item in data.icons"
        :key="item.code"
        class="item"
      >
        <img :src="item.svg?.url || item.img?.url">
        <div
          v-if="item.name && item.code !== item.name"
          class="name"
          :title="item.name"
        >
          {{ item.name }}
        </div>
        <div
          v-if="item.code"
          class="name"
          :title="item.code"
        >
          {{ item.code }}
          <Loading v-if="item.uploadStatus === UploadStatus.Uploading" />
          <i
            v-if="item.uploadStatus === UploadStatus.Fail"
            :title="t('fileUploadFailed')"
            class="iconfont icon-warn"
          />
          <div
            v-if="item.uploadStatus !== UploadStatus.Uploading"
            class="delete pointer flex center"
            :title="t('delete')"
            @click="deleteIcon(item)"
          >
            <i
              class="iconfont icon-delete-fill c-danger"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="data.activeTab === 'img'"
      class="upload flex center"
    >
      <label for="img">
        {{ t('selectIconFile', {type: t('img')}) }}
        <input
          id="img"
          type="file"
          accept="image/*"
          multiple
          @change="onImgChange"
        >
      </label>
    </div>
    <div
      v-if="data.activeTab === 'svg'"
      class="upload flex center"
    >
      <label for="svg">
        {{ t('selectIconFile', {type: 'SVG'}) }}
        <input
          id="svg"
          type="file"
          accept="image/svg+xml"
          multiple
          @change="onSVGChange"
        >
      </label>
    </div>
    <div
      v-if="data.activeTab === 'iconfont'"
      class="upload flex center"
    >
      <label for="javascript">
        {{ t('selectIconFile', {type: 'iconfont.js'}) }}
        <input
          id="javascript"
          type="file"
          accept="text/javascript"
          @change="onIconfontJSChange"
        >
      </label>
    </div>
    <div
      v-if="data.activeTab === 'iconfont'"
      class="upload flex center m-top"
    >
      <label>
        {{ t('selectIconFile', {type: 'iconfont.json'}) }}
        <input
          type="file"
          accept="application/json"
          @change="onIconfontJSONChange"
        >
      </label>
    </div>
    <div
      v-if="data.activeTab === 'extension'"
      class="extension t-center"
    >
      <h1>{{ t('iconlakeExtension') }}</h1>
      <h2>{{ t('collectFromAnySites') }}</h2>
      <div class="flex center download">
        <div class="item">
          <h3>
            <img
              class="browser"
              :src="'/imgs/chrome.svg'"
            >
          </h3>
          <p>
            <a
              class="store"
              href="https://chrome.google.com/webstore/detail/iconlake/lfjdnkcfpebmhjbeihnebpdalolhcmmb"
              target="_blank"
            >{{ t('webStore') }}</a>
          </p>
        </div>
        <div class="item">
          <h3>
            <img
              class="browser"
              :src="'/imgs/firefox.svg'"
            >
          </h3>
          <p>
            <a
              class="store"
              href="https://addons.mozilla.org/zh-CN/firefox/addon/iconlake/"
              target="_blank"
            >{{ t('webStore') }}</a>
          </p>
        </div>
        <div class="item">
          <h3>
            <img
              class="browser"
              :src="'/imgs/edge.svg'"
            >
          </h3>
          <p>
            <a
              class="store"
              href="https://microsoftedge.microsoft.com/addons/detail/iconlake/ilkiempcnikelnciijanjlgmchleamjh"
              target="_blank"
            >{{ t('webStore') }}</a>
          </p>
        </div>
      </div>
    </div>
    <!-- button -->
    <div
      v-if="data.activeTab === 'svg' || data.activeTab === 'img' || data.activeTab === 'iconfont'"
      class="flex center"
    >
      <button
        class="btn danger"
        :disabled="uploadedIconCount === 0"
        @click="save"
      >
        {{ t('save') }}
        <Loading v-if="isSaving" />
      </button>
    </div>
  </div>
  <div class="footer" />
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

    &.type-img {
      .item {
        width: 30rem;
      }
      img {
        height: 16rem;
      }
    }

    .item {
      width: 11.25rem;
      text-align: center;
      margin-bottom: 5rem;
      position: relative;
      &:hover {
        .delete {
          opacity: 1;
        }
      }
      .delete {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5rem;
        height: 5rem;
        margin: -2.5rem 0 0 -2.5rem;
        border-radius: 2.5rem;
        background-color: rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: var(--transition);
        .iconfont {
          font-size: 3rem;
        }
      }
    }

    img {
      height: 2rem;
      max-width: 100%;
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
      .loading {
        font-size: 1rem;
        color: var(--color-main);
      }
      .icon-warn {
        color: var(--color-danger);
      }
    }
  }

  .upload {
    font-size: 1rem;
    letter-spacing: 0rem;
    color: #476de8;

    label {
      display: block;
      cursor: pointer;
      height: 4rem;
      width: 100%;
      line-height: 4rem;
      border: var(--color-main) 2px dashed;
      border-radius: 1rem;
      text-align: center;
    }

    +div:not(.upload) {
      margin-top: 2rem;
    }
    
    input[type="file"] {  
      display: none;
    }
  }
}

.extension {
  h1 {
    font-size: 3.6rem;
    line-height: 3;
  }
  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 5rem;
  }
  .download {
    align-items: flex-start;
    .item {
      margin: 5rem;
    }
    .store {
      display: inline-block;
      padding: 0.6rem 2rem;
      background: var(--color-main);
      color: #fff;
      border-radius: 3rem;
      margin: 2rem 0 1rem;
      font-size: 1.2rem;
    }
    .file {
      font-size: 1rem;
      color: #666;
      opacity: 0;
      transition: var(--transition);
    }
  }
  .browser {
    width: 8rem;
    height: 8rem;
  }
}

.btn {
  .loading {
    margin-left: 0.8rem;
  }
}

.footer {
  height: 5rem;
}
</style>