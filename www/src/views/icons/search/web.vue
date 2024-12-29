<template>
  <div class="search list">
    <div class="group">
      <div class="group-title">
        以下作品来自：<a
          href="https://huaban.com/"
          target="_blank"
        >花瓣</a>
      </div>
      <div class="icons">
        <div
          v-for="(icon, i) in list"
          :key="icon._id"
          class="icon-item"
          @click="review(i)"
        >
          <IconVue :info="icon" />
        </div>
      </div>
      <div
        v-if="!loading"
        class="flex center more"
        @click="loadMore"
      >
        更多...
      </div>
      <div
        v-if="loading"
        class="searching flex center"
      >
        <LoadingVue />
        Searching...
      </div>
    </div>
  </div>
  <ReviewVue
    v-if="isReview"
    :info="reviewIcon"
    @close="isReview = false"
    @prev="reviewIndex--"
    @next="reviewIndex++"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@/apis/project'
import IconVue from '@/components/Icon.vue'
import { extensionApis } from '@/apis/extension';
import ReviewVue from '../Review.vue';
import LoadingVue from '@/components/Loading.vue';

interface SearchedIcon extends Icon {
  img?: {
    url: string
    originalUrl?: string
  }
}

const props = defineProps<{ keywords: string }>()
const list = ref<SearchedIcon[]>([])
const loading = ref(false)
const page = ref(1)
const isReview = ref(false)
const reviewIndex = ref(0)
const site = ref('huaban')

const reviewIcon = computed(() => {
  let index = reviewIndex.value
  if (index < 0) {
    index = 0
  } else if (index >= list.value.length) {
    index = list.value.length - 1
  } else if (index === list.value.length - 1) {
    loadMore()
  }
  const icon = JSON.parse(JSON.stringify(list.value[index]))
  if (icon.img.originalUrl) {
    icon.img.url = icon.img.originalUrl
  }
  return icon
})

watch(
  () => props.keywords,
  async (newVal) => {
    page.value = 1
    search({
      site: site.value,
      keywords: newVal,
      page: page.value
    })
  },
  { immediate: true }
)

function review (index: number) {
  isReview.value = true
  reviewIndex.value = index
}

async function search(params: { site: string; keywords: string; page: number; }) {
  loading.value = true
    if (params.page === 1) {
      list.value = []
    }
    const res = await extensionApis.search(params).catch((err) => {
      console.error(err)
      loading.value = false
      return {
        list: []
      }
    })
    list.value = list.value.concat(res.list)
    loading.value = false
}

async function loadMore() {
  page.value++
  search({
    site: site.value,
    keywords: props.keywords,
    page: page.value
  })
}
</script>

<style scoped lang="scss">
@import "../styles.scss";

.search {
  margin-top: 5rem;
  .more {
    background-color: #fff;
    padding: 1.6rem;
    border-radius: 0.4rem;
    margin-top: 2rem;
    cursor: pointer;
  }
}

.icon-item {
  cursor: pointer;
}

.searching {
  text-align: center;
  margin-top: 2rem;
  padding: 1.6rem;
  .loading {
    margin-right: 0.8rem;
  }
}
</style>
