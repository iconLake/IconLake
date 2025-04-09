<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePageLoading } from '@/hooks/router'
import { useI18n } from 'vue-i18n'
import { getStorageInfo } from '@/apis/project'

const pageLoading = usePageLoading()
const { t } = useI18n()
const storageInfo = ref<{
  limit: number
  free?: number
}>({
  limit: 1024 * 1024 * 100,
  free: 0,
})

const toMB = (size?: number) => {
  return size ? Math.round(size / 1024 / 1024 * 100) / 100 : 0
}

const percent = computed(() => {
  if (!storageInfo.value.free) {
    return 0
  }
  if (storageInfo.value.free < 0) {
    return 100
  }
  const p = storageInfo.value.free / storageInfo.value.limit
  return 100 - (p > 1 ? 1 : p) * 100
})

const getInfo = async () => {
  storageInfo.value = await getStorageInfo()
}

onMounted(async () => {
  await getInfo()
  pageLoading.end()
})
</script>

<template>
  <div class="container">
    <div class="flex">
      <span class="title">{{ t('cloudStorage') }}</span>
      <span class="title-sub">{{ t('freeStorage') }}: {{ toMB(storageInfo.free) }}MB/{{ toMB(storageInfo.limit) }}MB</span>
    </div>
    <div class="bar">
      <div
        class="progress"
        :style="{ width: `${percent}%` }"
      />
    </div>
    <div class="msg">
      <p>{{ t('getMoreStorageMsg') }}</p>
      <p>
        <a
          target="_blank"
          href="https://gitee.com/iconLake"
          title="Gitee"
        >
          <img
            :src="'/imgs/gitee-logo.svg'"
            alt="gitee"
          >
        </a>
        <a
          target="_blank"
          href="https://github.com/iconLake"
          title="Github"
        >
          <img
            :src="'/imgs/github-logo.svg'"
            alt="github"
          >
        </a>
        <a
          target="_blank"
          href="https://x.com/iconLake"
          title="X"
        >
          <img
            :src="'/imgs/x-logo.svg'"
            alt="x"
          >
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  background-color: #fff;
  border-radius: 0.4rem;
  padding: 4rem 5.2rem;
  margin-bottom: 2rem;
}
.title-sub {
  font-size: 1.2rem;
  color: #999;
}
.bar {
  width: 100%;
  height: 2rem;
  background-color: var(--color-bg);
  border-radius: 0.25rem;
  margin-top: 2rem;
  .progress {
    height: 100%;
    background-color: var(--color-main);
    border-radius: 0.25rem;
  }
}
.msg {
  margin-top: 2rem;
  font-size: 1.2rem;
  p {
    margin-bottom: 1rem;
  }
  img {
    height: 2rem;
    margin-right: 1.5rem;
  }
}
</style>
