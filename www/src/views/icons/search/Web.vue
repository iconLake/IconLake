<template>
  <div class="search list">
    <div class="group">
      <div class="group-header">
        <div class="group-title flex">
          <div>
            {{ t('workFrom') }}
            <a
              :href="siteInfo?.url"
              target="_blank"
            >{{ siteInfo?.name }}</a>
          </div>
          <div class="sites flex center">
            <div
              v-for="item in sites"
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
          v-if="options.length > 0 && !keywords"
          class="options flex end"
        >
          <template
            v-for="option in options"
            :key="option.name"
          >
            <Select
              v-model="option.value"
              :options="option.children"
              :placeholder="option.label"
              @change="reload"
            />
            <template
              v-if="getSubOptions(option).length"
            >
              <Select
                v-for="sub in getSubOptions(option)"
                :key="sub.name"
                v-model="sub.value"
                :options="sub.children"
                :placeholder="sub.label"
                @change="reload"
              />
            </template>
          </template>
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
            <IconVue
              :info="icon"
              :lazy="true"
            />
          </div>
        </div>
        <div
          v-if="!loading"
          class="flex center more"
          @click="loadMore"
        >
          {{ loadMoreText }}
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
          v-if="false"
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
    :icon="reviewIcon"
    :project-id="projectId"
    :project-type="projectType"
    :collectable="true"
    @close="isReview = false"
    @prev="reviewIndex--"
    @next="reviewIndex++"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import IconVue from '@/components/Icon.vue'
import { extensionApis, type OptionGroup, type SearchedIcon } from '@/apis/extension';
import ReviewVue from '../Review.vue';
import LoadingVue from '@/components/Loading.vue';
import { PROJECT_TYPE, SEARCH_SITES, type SearchSite } from '@/utils/const';
import { useI18n } from 'vue-i18n';
import { storage } from '@/utils/storage';
import Select from '@/components/Select.vue';

const props = defineProps<{
  keywords: string
  projectId: string
  projectType: number
}>()
const list = ref<SearchedIcon[]>([])
const loading = ref(false)
const page = ref(1)
const isReview = ref(false)
const reviewIndex = ref(-1)
const site = ref('')
const sites = ref<SearchSite[]>([])
const isExtensionReady = ref(false)
const error = ref('')
const reviewIcon = ref<SearchedIcon>({
  _id: '',
  code: '',
  name: '',
  tags: [],
  groupId: '',
})
const options = ref<OptionGroup[]>([])

const { t } = useI18n()

const getOptions = async () => {
  const res = await extensionApis.option({
    site: site.value
  }).catch((err) => {
    console.error(err)
    return {
      options: [],
      error: err.toString()
    }
  })
  options.value = res.error ? [] : res.options
}

const getSubOptions = (option: OptionGroup) => {
  const child = option.children.find(e => e.value === option.value)
  return (child && child.options) ? child.options : []
}

watch(() => props.projectType, (v) => {
  let storedSite = storage.getProjectDefaultSearchSite(props.projectId)
  if (SEARCH_SITES.find(e => e.code === storedSite) === undefined) {
    storedSite = undefined
  }
  site.value = storedSite || (v === PROJECT_TYPE.SVG ? 'iconfont' : 'huaban')
})

watch(() => site.value, (v) => {
  options.value = []
  storage.setProjectDefaultSearchSite(props.projectId, v)
  getOptions()
  reload()
})

watch(() => reviewIndex.value, async () => {
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
  reviewIcon.value = icon
  // fetch detail
  const data = await extensionApis.detail({
    site: site.value,
    url: list.value[index].code
  }).catch((err) => {
    console.error(err)
    return {
      imgs: [],
      html: '',
      error: err.toString()
    }
  })
  if (!data.error) {
    reviewIcon.value.img = {
      url: ''
    }
    const icon = JSON.parse(JSON.stringify(list.value[index]))
    icon.imgs = data.imgs
    icon.html = data.html
    reviewIcon.value = icon
  }
})

const siteInfo = computed(() => {
  const item = SEARCH_SITES.find(e => e.code === site.value)
  return item
})

const loadMoreText = computed(() => {
  if (error.value) {
    if (error.value === 'Unauthorized') {
      return t('searchErrorUnauthorized', { name: siteInfo.value?.name })
    }
    return t('searchErrorGuide', { name: siteInfo.value?.name })
  }
  return `${t('more')}...`
})

let keywordsTimer: NodeJS.Timeout
watch(
  () => props.keywords,
  () => {
    keywordsTimer && clearTimeout(keywordsTimer)
    keywordsTimer = setTimeout(() => {
      reload()
    }, 500)
  },
)

function review (index: number) {
  isReview.value = true
  reviewIndex.value = index
}

async function search(params: {
  site: string
  keywords: string
  page: number
  extra?: {
    [x: string]: string
  }
}) {
  loading.value = true
  if (params.page === 1) {
    list.value = []
  }
  const res = await extensionApis.search(params).catch((err) => {
    console.error(err)
    loading.value = false
    error.value = err.toString()
    return {
      list: [],
      error: err.toString()
    }
  })
  list.value = list.value.concat(res.list)
  loading.value = false
  error.value = res.error
}

async function load() {
  const extra: {[x: string]: string} = {}
  if (options.value.length) {
    options.value.forEach(e => {
      if (e.value) {
        extra[e.name] = e.value
        const child = e.children.find(c => c.value === e.value)
        if (child && child.options) {
          child.options.forEach(e => {
            extra[e.name] = e.value
          })
        }
      }
    })
  }
  search({
    site: site.value,
    keywords: props.keywords,
    page: page.value,
    extra,
  })
}

async function loadMore() {
  if (!error.value) {
    page.value++
  }
  load()
}

async function reload() {
  page.value = 1
  load()
}

onMounted(async () => {
  const extensionInfo = await extensionApis.getExtensionInfo()
  isExtensionReady.value = extensionInfo.isReady
  if (extensionInfo.search?.sites) {
    sites.value = SEARCH_SITES.filter(e => extensionInfo.search?.sites.includes(e.code))
  } else {
    sites.value = SEARCH_SITES.filter(e => e.active)
  }
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

.group-header {
  background: var(--color-bg);
  position: sticky;
  top: 0;
}

.group-title {
  margin-bottom: 1rem;
  a {
    text-decoration: underline;
    text-underline-offset: 0.3rem;
    text-decoration-color: $color-main;
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
  align-items: flex-end;
  .site-item {
    cursor: pointer;
    margin-left: 1.2rem;
    font-size: 1rem;
    line-height: 1;
    &.active {
      color: $color-main;
      font-size: 1.6rem;
    }
  }
}

.guide {
  align-items: center;
  margin-top: 2rem;
  a {
    margin-left: 0.8rem;
  }
  img {
    height: 2rem;
  }
}

.options {
  margin-bottom: 1rem;
  gap: 0.8rem;
  .select {
    height: 3rem;
    width: 11rem;
    opacity: 0.5;
    transition: var(--transition);
    &:hover {
      opacity: 1;
    }
    :deep(.text) {
      border: none;
      text-align: right;
      padding-right: 2rem;
      border-radius: 0;
      background: transparent;
      border-bottom: #fff 2px solid;
    }
  }
}
</style>
