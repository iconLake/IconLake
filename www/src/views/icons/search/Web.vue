<template>
  <div class="search list">
    <div class="group">
      <div class="group-title flex">
        <div>
          {{ t('workFrom') }}<a
            :href="siteInfo?.url"
            target="_blank"
          >{{ siteInfo?.name }}</a>
        </div>
        <div class="sites flex center">
          <div
            v-for="item in SEARCH_SITES"
            :key="item.code"
            class="site-item"
            :class="site === item.code ? 'active' : ''"
            @click="site = item.code"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div
        v-if="isExtensionReady"
      >
        <div
          class="icons"
        >
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
          {{ t('more') }}...
        </div>
        <div
          v-if="loading"
          class="searching flex center"
        >
          <LoadingVue />
          {{ t('searching') }}...
        </div>
      </div>
      <div
        v-if="!isExtensionReady"
        class="flex start guide"
      >
        <p>{{ t('installExtension&gotoStore') }}</p>
        <a
          href="https://chrome.google.com/webstore/detail/iconlake/lfjdnkcfpebmhjbeihnebpdalolhcmmb"
          target="_blank"
        >
          <img
            :src="'/imgs/chrome.svg'"
          >
        </a>
        <a
          href="https://addons.mozilla.org/zh-CN/firefox/addon/iconlake/"
          target="_blank"
        >
          <img
            :src="'/imgs/firefox.svg'"
          >
        </a>
        <a
          href="https://microsoftedge.microsoft.com/addons/detail/iconlake/ilkiempcnikelnciijanjlgmchleamjh"
          target="_blank"
        >
          <img
            :src="'/imgs/edge.svg'"
          >
        </a>
      </div>
    </div>
  </div>
  <ReviewVue
    v-if="isReview"
    :info="reviewIcon"
    @close="isReview = false"
    @prev="reviewIndex--"
    @next="reviewIndex++"
    @collect="collect"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import IconVue from '@/components/Icon.vue'
import { extensionApis, SearchedIcon } from '@/apis/extension';
import ReviewVue from '../Review.vue';
import LoadingVue from '@/components/Loading.vue';
import { SEARCH_SITES } from '@/utils/const';
import { useI18n } from 'vue-i18n';
import { getIconUrl } from '@/utils/icon';


const props = defineProps<{ keywords: string }>()
const list = ref<SearchedIcon[]>([])
const loading = ref(false)
const page = ref(1)
const isReview = ref(false)
const reviewIndex = ref(0)
const site = ref('iconfont')
const isExtensionReady = ref(false)

const { t } = useI18n()

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
  if (icon.img?.originalUrl) {
    icon.img.url = icon.img.originalUrl
  }
  return icon
})

const siteInfo = computed(() => {
  const item = SEARCH_SITES.find(e => e.code === site.value)
  return item
})

const reload = () => {
  page.value = 1
  search({
    site: site.value,
    keywords: props.keywords,
    page: page.value
  })
}

let keywordsTimer: NodeJS.Timeout
watch(
  () => props.keywords,
  () => {
    keywordsTimer && clearTimeout(keywordsTimer)
    keywordsTimer = setTimeout(() => {
      reload()
    }, 500)
  },
  { immediate: true }
)

watch(
  () => site.value,
  reload
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

async function collect(icon: SearchedIcon) {
  const url = getIconUrl(icon)
  if (!url) {
    return
  }
  const file = await fetch(url).then(res => res.blob())

}

onMounted(async () => {
  const extensionInfo = await extensionApis.getExtensionInfo()
  isExtensionReady.value = extensionInfo.isReady
})
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

.sites {
  .site-item {
    cursor: pointer;
    margin-left: 1.2rem;
    &.active {
      color: $color-main;
    }
  }
}

.guide {
  align-items: center;
  a {
    margin-left: 0.8rem;
  }
  img {
    height: 2rem;
  }
}
</style>
