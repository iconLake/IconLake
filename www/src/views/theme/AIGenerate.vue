<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Loading from '@/components/Loading.vue'
import { userApis } from '@/apis/user'
import exhibitionBaseCodes from './codes/exhibition.txt?raw'
import nftBaseCodes from './codes/nft.txt?raw'
import creatorBaseCodes from './codes/creator.txt?raw'
import { extensionApis } from '@/apis/extension'
import { getNFTs } from '@/apis/blockchain'

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
const codes = ref('')
const compressedCodes = ref('')
const themeUrl = ref('')
const promptInputDom = ref()
const isDesktop = ref(false)
const nftId = ref('')

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
  prompt.value = baseCodes + '\n\n重新设计UI，仅输出完整代码，设计要求如下：\n1. '
}

const genTheme = async () => {
  if (isGenerating.value) {
    return
  }
  isGenerating.value = true
  codes.value = 'Coding...'
  const res = await userApis.generateTheme({
    prompt: prompt.value,
  }).catch(() => {
    isGenerating.value = false
    return {
      codes: 'Error'
    }
  })
  codes.value = res.codes
  isGenerating.value = false
}

const previewTheme = async () => {
  if (!compressedCodes.value) {
    return
  }
  const blob = new Blob([compressedCodes.value], { type: 'text/javascript' })
  themeUrl.value = URL.createObjectURL(blob)
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

onMounted(async () => {
  await initPrompt()
  promptInputDom.value.focus()
  const extInfo = await extensionApis.getExtensionInfo()
  isDesktop.value = !!extInfo.isDesktop
  if ($props.type === 'nft') {
    nftId.value = await getNftId()
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
        <span class="msg">{{ t('generateThemeByOthers') }}</span>
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
    <div class="aigenerate-title">
      {{ t('generatedCodes') }}
    </div>
    <div class="aigenerate-codes-wrap">
      <textarea
        v-model="codes"
        class="aigenerate-codes"
      />
    </div>
    <div class="aigenerate-title">
      {{ t('preview') }}
    </div>
    <div
      v-if="!isDesktop"
      class="aigenerate-desc"
    >
      <p>
        桌面版可以实时构建主题文件，网页版需要通过 <a
          :href="`https://stackblitz.com/github/iconLake/Theme?file=src%2F${themeFileName}%2FApp.vue`"
          target="_blank"
        >StackBlitz</a> 或者 <a
          :href="`https://codesandbox.io/p/github/iconLake/Theme/master?file=%2Fsrc%2F${themeFileName}%2FApp.vue`"
          target="_blank"
        >codeSandbox</a> 构建
      </p>
    </div>
    <div class="guide">
      <p>
        使用StackBlitz进行预览并构建主题文件的操作步骤如下：
      </p>
      <p>
        第一步：复制AI生成的代码到 <a
          :href="`https://stackblitz.com/github/iconLake/Theme?file=src%2F${themeFileName}%2FApp.vue`"
          target="_blank"
        ><b>StackBlitz</b></a> 里的 <a
          :href="`https://stackblitz.com/github/iconLake/Theme?file=src%2F${themeFileName}%2FApp.vue`"
          target="_blank"
        ><b>src/{{ themeFileName }}/App.vue</b></a>，然后按 <b>Ctrl/Command + S</b> 或 点击左上角 <b>Save</b> 保存。此时，预览窗口已自动刷新并显示最新主题效果；
      </p>
      <p>第二步：在 <b>Terminal</b> 窗口键入 <b>q + Enter</b> 或 <b>Ctrl/Command + C</b> 以终止预览，然后键入 <b>pnpm run build</b> 开始构建主题文件；</p>
      <p>第三步：复制 <b>dist/assets/{{ themeFileName }}-xxxxxx.js</b> 里的内容，粘贴到下方输入框里。</p>
    </div>
    <div class="aigenerate-codes-wrap">
      <textarea
        v-model="compressedCodes"
        class="aigenerate-codes"
        @change="previewTheme"
      />
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
    margin: 5rem 0 1.6rem;
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
  }
  &-preview-wrap {
    width: 80vw;
    height: 90vh;
    margin: 3rem auto;
    background-color: var(--color-bg);
    border-radius: 1.875rem;
    overflow: hidden;
  }
  &-preview {
    width: 100%;
    height: 100%;
  }
  .guide {
    width: 50vw;
    margin: 0 auto;
    text-align: left;
    margin-top: 5rem;
    p {
      margin-bottom: 1rem;
    }
  }
  &-footer {
    margin: 3rem 0;
    .btn {
      margin: 0 1rem;
    }
  }
}
</style>
