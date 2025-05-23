<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/hooks/router'

const { t } = useI18n()
const pageLoading = usePageLoading()
const $props = defineProps<{
  onFinish: () => void
  type: 'exhibition' | 'nft' | 'creator'
}>()

const prompt = ref('')

const title = computed(() => {
  switch ($props.type) {
    case 'exhibition':
      return t('aiGenerateExhibition')
    case 'nft':
      return t('aiGenerateNft')
    case 'creator':
      return t('aiGenerateCreator')
    default:
      return ''
  }
})

const genTheme = () => {}

onMounted(() => {
  pageLoading.end()
})
</script>

<template>
  <div class="aigenerate">
    <div class="aigenerate-title">
      {{ title }}
    </div>
    <div class="aigenerate-input">
      <textarea
        v-model="prompt"
        class="input-prompt"
      />
      <button
        type="submit"
        class="btn"
        @click="genTheme"
      >
        {{ t('generate') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aigenerate {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba($color: #fff, $alpha: 0.8);
  backdrop-filter: blur(20px);
  z-index: 101;
  &-title {
    font-size: 2.4rem;
    font-weight: 600;
    margin-bottom: 1.6rem;
  }
  &-input {
    position: relative;
    border: var(--color-main) 1px solid;
    padding: 1.6rem 1.6rem 5rem;
    border-radius: 1.875rem;
    .input-prompt {
      width: 80vw;
      height: 20rem;
      border: none;
      resize: none;
    }
    .btn {
      position: absolute;
      right: 1rem;
      bottom: 1rem;;
    }
  }
}
</style>
