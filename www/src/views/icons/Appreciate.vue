<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePageLoading } from '@/hooks/router'
import { onMounted, reactive, ref } from 'vue'
import Header from '@/components/Header.vue'
import User from '@/components/User.vue'
import { type Appreciate, getAppreciateList, type Icon as IconType, projectApis, AppreciateType } from '@/apis/project'
import Icon from '@/components/Icon.vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { toast } from '@/utils'

const { t } = useI18n()
const pageLoading = usePageLoading()
const route = useRoute()
const projectId = ref(route.params.projectId as string)
const id = ref(route.params.id as string)
const appreciateType = ref<AppreciateType>(AppreciateType.Good)
const comments = reactive<{
  [key: string]: Appreciate[]
}>({
  [AppreciateType.Good]: [],
  [AppreciateType.Normal]: [],
  [AppreciateType.Bad]: [],
  [AppreciateType.Great]: []
})

const iconInfo = ref<IconType>()
const error = ref('')

async function getIconInfo() {
  await projectApis.getIcon(projectId.value, id.value).onUpdate(async (icon) => {
    iconInfo.value = icon.info
  })
}

function changeAppreciate(type: AppreciateType) {
  appreciateType.value = type
  getData()
}

async function getData(update?: boolean) {
  const type = appreciateType.value
  if (comments[type].length > 0 && !update) {
    return
  }
  if (update) {
    comments[type] = []
  }
  const res = await getAppreciateList({
    projectId: projectId.value,
    iconId: id.value,
    type,
    update,
  })
  comments[type] = res.list.reverse()
}

function parseMD(text: string) {
  return DOMPurify.sanitize(marked.parse(text, {
    async: false
  }))
}

onMounted(async () => {
  await Promise.all([
    getIconInfo(),
    getData()
  ]).catch((e) => {
    if (e.error) {
      error.value = e.error
      toast.error(t(e.error))
    }
  }).finally(() => {
    pageLoading.end()
  })
})
</script>

<template>
  <Header :back="`/icons/${projectId}`" />
  <User />
  <div
    v-if="iconInfo?._id"
    class="flex center main"
  >
    <div class="work">
      <Icon :info="iconInfo" />
      <div class="name">
        {{ iconInfo.name }}
      </div>
      <div class="code">
        {{ iconInfo.code }}
      </div>
      <div
        v-if="iconInfo.desc"
        class="desc"
      >
        {{ iconInfo.desc }}
      </div>
    </div>
    <div class="appreciate">
      <div class="tab">
        <div
          class="item"
          :class="{ active: appreciateType === AppreciateType.Good }"
          @click="changeAppreciate(AppreciateType.Good)"
        >
          {{ t('goodAppreciate') }}
        </div>
        <div
          class="item"
          :class="{ active: appreciateType === AppreciateType.Normal }"
          @click="changeAppreciate(AppreciateType.Normal)"
        >
          {{ t('normalAppreciate') }}
        </div>
        <div
          class="item"
          :class="{ active: appreciateType === AppreciateType.Bad }"
          @click="changeAppreciate(AppreciateType.Bad)"
        >
          {{ t('badAppreciate') }}
        </div>
        <div
          class="item"
          :class="{ active: appreciateType === AppreciateType.Great }"
          @click="changeAppreciate(AppreciateType.Great)"
        >
          {{ t('greatAppreciate') }}
        </div>
      </div>
      <div class="comments">
        <div
          v-if="comments[appreciateType].length === 0"
          class="empty"
        >
          {{ t(error) || t('appreciating') }}
        </div>
        <div
          v-for="item in comments[appreciateType]"
          :key="item._id"
          class="comment"
        >
          <div
            class="content"
            v-html="parseMD(item.text)"
          />
          <div
            v-if="item.ai"
            class="author"
          >
            <span class="name">——{{ t(item.ai) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  align-items: start;
  padding: 2rem 0;
  gap: 3rem;
}
.work {
  width: 30vw;
  background-color: #fff;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  .icon {
    width: 100%;
    height: auto;
  }
  .name {
    margin-top: 1rem;
    font-size: 1.5rem;
    line-height: 1.5;
    word-break: break-all;
  }
  .code {
    margin-top: 0.5rem;
    font-size: 1rem;
    line-height: 1.2;
    opacity: 0.5;
    word-break: break-all;
  }
  .desc {
    margin-top: 1rem;
    font-size: 1rem;
    line-height: 1.2;
    opacity: 0.8;
    word-break: break-all;
  }
}
.appreciate {
  width: 50vw;
  padding: 0 2rem;
  .tab {
    display: flex;
    margin-bottom: 3rem;
    .item {
      cursor: pointer;
      padding: 1rem 0;
      border-bottom: 2px solid #fff;
      width: 10rem;
      margin-right: 5rem;
      &.active {
        color: var(--color-main);
        border-color: var(--color-main);
      }
    }
  }
  .empty {
    text-align: center;
    padding: 10rem 0;
  }
  .comment {
    margin-bottom: 5rem;
  }
  .content {
    width: 100%;
    font-size: 1.5rem;
    line-height: 1.8;
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin: 1.8rem 0 1.5rem;
      font-size: 1.6rem;
      font-weight: bold;
      line-height: 1.8;
      text-indent: 2em;
    }
    :deep(h1) {
      font-size: 1.8rem;
    }
    :deep(h2) {
      font-size: 1.7rem;
    }
    :deep(p) {
      margin: 1.5rem 0;
      line-height: 1.8;
      text-indent: 2em;
    }
  }
  .author {
    @font-face {
      font-family: 'ZhiMangXing-Regular';
      src: url(/font/ZhiMangXing-Regular.ttf) format('truetype');
    }
    margin-top: 3rem;
    text-align: right;
    font-size: 1.2rem;
    line-height: 1.2;
    opacity: 0.3;
    .name {
      font-family: ZhiMangXing-Regular, var(--font-family);
      font-size: 5rem;
    }
  }
}
</style>
