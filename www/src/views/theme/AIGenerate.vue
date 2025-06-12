<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Loading from '@/components/Loading.vue'
import { userApis } from '@/apis/user'
import exhibitionBaseCodes from './codes/exhibition.txt?raw'
import nftBaseCodes from './codes/nft.txt?raw'
import creatorBaseCodes from './codes/creator.txt?raw'
import { extensionApis } from '@/apis/extension'
import { getNFTs } from '@/apis/blockchain'
import { copy, toast } from '@/utils'
import { desktopApis } from '@/apis/desktop'

const { t } = useI18n()
const $props = defineProps<{
  onFinish: (codes: string) => void
  onCancel: () => void
  type: 'class' | 'nft' | 'creator'
  projectId?: string
  creatorId?: string
}>()

const prompt = ref(``)
const isGenerating = ref(false)
const isBuilding = ref(false)
const codes = ref('')
const compressedCodes = ref('')
const themeUrl = ref('')
const promptInputDom = ref()
const isDesktop = ref(false)
const isDesktopReady = ref(false)
const nodejs = ref({
  version: '',
})
const nftId = ref('')
const generatedCodesDom = ref()
const compressedCodesDom = ref()
const previewDom = ref()

const title = computed(() => {
  switch ($props.type) {
    case 'class':
      return t('aiGenerateExhibition')
    case 'nft':
      return t('aiGenerateNft')
    case 'creator':
      return t('aiGenerateCreator')
    default:
      return ''
  }
})

const themeFileName = computed(() => {
  switch ($props.type) {
    case 'class':
      return 'exhibition'
    case 'nft':
      return 'nft'
    case 'creator':
      return 'creator'
    default:
      return ''
  }
})

const previewUrl = computed(() => {
  switch ($props.type) {
    case 'class':
      return `/exhibition/${$props.projectId}?theme=${themeUrl.value}`
    case 'nft':
      return `/exhibition/${$props.projectId}/${nftId.value}?theme=${themeUrl.value}`
    case 'creator':
      return `/exhibition/creator/${$props.creatorId}?theme=${themeUrl.value}`
    default:
      return ''
  }
})

const initPrompt = async () => {
  const baseCodes = {
    class: exhibitionBaseCodes,
    nft: nftBaseCodes,
    creator: creatorBaseCodes
  }[$props.type]
  prompt.value = `${baseCodes}\n\n${t('redesignAndRequirement')}\n1. \n2. `
}

const genTheme = async () => {
  if (isGenerating.value) {
    return
  }
  isGenerating.value = true
  codes.value = 'Coding...'
  generatedCodesDom.value.scrollIntoView({ behavior: 'smooth' })
  const timer = setInterval(() => {
    if (codes.value.length >= 100) {
      clearInterval(timer)
    }
    codes.value += '.'
  }, 1000)
  const res = await userApis.generateTheme({
    prompt: prompt.value,
  }).catch(() => {
    isGenerating.value = false
    return {
      codes: 'Error'
    }
  })
  clearInterval(timer)
  isGenerating.value = false
  codes.value = res.codes
  onCodesChanged()
}

const buildTheme = async () => {
  if (isBuilding.value) {
    return
  }
  isBuilding.value = true
  compressedCodes.value = 'Building...'
  compressedCodesDom.value.scrollIntoView({ behavior: 'smooth' })
  const timer = setInterval(() => {
    if (compressedCodes.value.length >= 100) {
      clearInterval(timer)
    }
    compressedCodes.value += '.'
  }, 1000)
  let res
  if (!isDesktop.value && isDesktopReady.value) {
    res = await desktopApis.buildTheme({
      codes: codes.value,
      type: $props.type === 'class' ? 'exhibition' : $props.type
    }).catch(() => {
      isBuilding.value = false
      return {
        codes: 'Error'
      }
    })
  } else {
    res = await extensionApis.buildTheme({
      codes: codes.value,
      type: $props.type === 'class' ? 'exhibition' : $props.type
    }).catch(() => {
      isBuilding.value = false
      return {
        codes: 'Error'
      }
    })
  }
  clearInterval(timer)
  compressedCodes.value = res.codes || 'Error'
  isBuilding.value = false
  onCompressedCodesChanged()
}

const previewTheme = async () => {
  if (!compressedCodes.value) {
    return
  }
  const blob = new Blob([compressedCodes.value], { type: 'text/javascript' })
  themeUrl.value = URL.createObjectURL(blob)
  previewDom.value.scrollIntoView({ behavior: 'smooth' })
}

const finish = () => {
  $props.onFinish(compressedCodes.value)
}

const getNftId = async () => {
  const res = await getNFTs({
    classId: $props.projectId,
  })
  return res?.nfts?.[0].id || ''
}

function copyPrompt () {
  copy(prompt.value)
  toast(t('copyDone'))
}

function onCodesChanged() {
  if (!isGenerating.value && codes.value && codes.value !== 'Error') {
    buildTheme()
  }
}

function onCompressedCodesChanged() {
  if (!isBuilding.value && compressedCodes.value && compressedCodes.value !== 'Error') {
    previewTheme()
  }
}

async function checkDesktopConnected() {
  if (!isDesktopReady.value && !isDesktop.value) {
    try {
      const desktopInfo = await desktopApis.ping()
      isDesktopReady.value = true
      nodejs.value.version = desktopInfo.nodejs?.version || ''
    } catch (e) {
      isDesktopReady.value = false
      nodejs.value.version = ''
    }
  }
}

onMounted(async () => {
  await initPrompt()
  promptInputDom.value.focus()
  const extInfo = await extensionApis.getExtensionInfo()
  isDesktop.value = !!extInfo.isDesktop
  if (isDesktop.value && extInfo.nodejs) {
    nodejs.value = extInfo.nodejs
  }
  if ($props.type === 'nft') {
    nftId.value = await getNftId()
  }

  if (!isDesktop.value) {
    checkDesktopConnected()
    window.addEventListener('focus', checkDesktopConnected)
  }
})

onUnmounted(() => {
  if (!isDesktop.value) {
    window.removeEventListener('focus', checkDesktopConnected)
  }
})
</script>

<template>
  <div
    class="close"
    @click="$props.onCancel"
  >
    <i
      class="iconfont icon-close"
    />
  </div>
  <div class="aigenerate">
    <div class="aigenerate-title">
      {{ title }}
    </div>
    <div class="aigenerate-input">
      <textarea
        ref="promptInputDom"
        v-model="prompt"
        class="input-prompt"
      />
      <div class="btn-wrap">
        <span
          class="msg"
          @click="copyPrompt"
        >
          <i class="iconfont icon-copy" />
          {{ t('generateThemeByOthers') }}
        </span>
        <button
          type="submit"
          class="btn"
          @click="genTheme"
        >
          <Loading v-if="isGenerating" />
          <span v-else>{{ t('generate') }}</span>
        </button>
      </div>
    </div>
    <div
      ref="generatedCodesDom"
      class="aigenerate-title"
    >
      {{ t('generatedCodes') }}
    </div>
    <div class="aigenerate-codes-wrap">
      <textarea
        v-model="codes"
        class="aigenerate-codes"
        @blur="onCodesChanged"
      />
    </div>
    <div
      ref="compressedCodesDom"
      class="aigenerate-title"
    >
      {{ t('builtCodes') }}
    </div>
    <div
      v-if="!isDesktop"
      class="aigenerate-desc"
    >
      <template
        v-if="isDesktopReady && nodejs.version"
      >
        {{ t('desktopIsOpenAndReady') }}
      </template>
      <i18n-t
        v-if="!isDesktopReady"
        keypath="builtCodesDesc"
      >
        <template #desktop>
          <a
            href="/download"
            target="_blank"
            class="link"
          >{{ t('desktopVersion') }}</a>
        </template>
        <template #sbz>
          <a
            :href="`https://stackblitz.com/github/iconLake/Theme?file=src%2F${themeFileName}%2FApp.vue`"
            target="_blank"
            class="link"
          >StackBlitz</a>
        </template>
        <template #csb>
          <a
            :href="`https://codesandbox.io/p/github/iconLake/Theme/master?file=%2Fsrc%2F${themeFileName}%2FApp.vue`"
            target="_blank"
            class="link"
          >codeSandbox</a>
        </template>
      </i18n-t>
    </div>
    <div
      v-if="!isDesktop && !isDesktopReady"
      class="guide"
    >
      <p>{{ t('sbzBuildSteps') }}</p>
      <p>
        <i18n-t keypath="sbzBuildStep1">
          <template #sbz>
            <a
              :href="`https://stackblitz.com/github/iconLake/Theme?file=src%2F${themeFileName}%2FApp.vue`"
              target="_blank"
              class="link"
            ><b>StackBlitz</b></a>
          </template>
          <template #filename>
            <a
              :href="`https://stackblitz.com/github/iconLake/Theme?file=src%2F${themeFileName}%2FApp.vue`"
              target="_blank"
              class="link"
            ><b>src/{{ themeFileName }}/App.vue</b></a>
          </template>
          <template #command>
            <b>Ctrl/Command + S</b>
          </template>
          <template #save>
            <b>Save</b>
          </template>
        </i18n-t>
      </p>
      <p>
        <i18n-t keypath="sbzBuildStep2">
          <template #terminal>
            <b>Terminal</b>
          </template>
          <template #q>
            <b>q + Enter</b>
          </template>
          <template #command>
            <b>Ctrl/Command + C</b>
          </template>
          <template #build>
            <b>pnpm run build</b>
          </template>
        </i18n-t>
      </p>
      <p>
        <i18n-t keypath="sbzBuildStep3">
          <template #filename>
            <b>dist/assets/{{ themeFileName }}-xxxxxx.js</b>
          </template>
        </i18n-t>
      </p>
    </div>
    <div
      v-if="!nodejs.version && (isDesktop || isDesktopReady)"
      class="warning"
    >
      <p class="c-danger">
        <i class="iconfont icon-warn" />
        <i18n-t keypath="noNodejsAndGotoInstall">
          <template #nodejs>
            <a
              href="https://nodejs.org/"
              target="_blank"
              class="link"
            >{{ t('nodejsOfficialWebsite') }}</a>
          </template>
        </i18n-t>
      </p>
    </div>
    <div class="aigenerate-codes-wrap">
      <textarea
        v-model="compressedCodes"
        class="aigenerate-codes compressed"
        @blur="onCompressedCodesChanged"
      />
    </div>
    <div
      ref="previewDom"
      class="aigenerate-title"
    >
      {{ t('preview') }}
    </div>
    <div class="aigenerate-preview-wrap">
      <iframe
        :src="previewUrl"
        frameborder="0"
        class="aigenerate-preview"
      />
    </div>
    <div class="aigenerate-footer">
      <a
        :href="previewUrl"
        target="_blank"
        class="btn"
      >{{ t('previewInNewWindow') }}</a>
      <button
        type="submit"
        class="btn"
        @click="finish"
      >
        {{ t('confirmUseThisTheme') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.close {
  position: fixed;
  top: 0;
  right: 0;
  cursor: pointer;
  padding: 1.6rem;
  z-index: 102;
}
.aigenerate {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #fff, $alpha: 0.8);
  backdrop-filter: blur(20px);
  z-index: 101;
  overflow: auto;
  text-align: center;
  &-title {
    font-size: 2rem;
    padding: 5rem 0 1.6rem;
  }
  &-desc {
    margin-bottom: 1.8rem;
  }
  &-input {
    position: relative;
    border: var(--color-main) 1px solid;
    padding: 1.6rem 1.6rem 5rem;
    border-radius: 1.875rem;
    width: 80vw;
    margin: 0 auto;
    box-sizing: border-box;
    .input-prompt {
      height: 60vh;
      border: none;
      resize: none;
      text-align: left;
      width: 100%;
    }
    .btn-wrap {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      .msg {
        opacity: 0.5;
        font-size: 1.2rem;
        margin-right: 2rem;
        vertical-align: bottom;
        position: relative;
        bottom: 0.5rem;
        cursor: pointer;
      }
    }
  }
  &-codes-wrap {
    width: 80vw;
    background-color: var(--color-bg);
    margin: 0 auto;
    border-radius: 1.875rem;
    padding: 1.6rem;
    box-sizing: border-box;
  }
  &-codes {
    width: 100%;
    height: 60vh;
    border: none;
    background-color: transparent;
    &.compressed {
      height: 30vh;
    }
  }
  &-preview-wrap {
    width: 80vw;
    height: 90vh;
    margin: 0 auto;
    background-color: var(--color-bg);
    border-radius: 1.875rem;
    overflow: hidden;
  }
  &-preview {
    width: 100%;
    height: 100%;
  }
  .link {
    text-decoration: underline;
    text-underline-offset: 5px;
    text-decoration-color: var(--color-bg);
    transition: var(--transition);
    &:hover {
      text-decoration-color: var(--color-main);
    }
  }
  .guide {
    width: 70vw;
    margin: 0 auto;
    text-align: left;
    margin-top: 5rem;
    p {
      margin-bottom: 1rem;
      line-height: 1.8;
    }
  }
  &-footer {
    margin: 3rem 0;
    .btn {
      margin: 0 1rem;
    }
  }
  .warning {
    margin-bottom: 2rem;
    .icon-warn {
      font-size: 2.2rem;
      vertical-align: sub;
    }
  }
}
</style>
