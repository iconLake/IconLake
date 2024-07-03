<script lang="ts" setup>
import UserVue from '../../components/User.vue'
import IconVue from '../../components/Icon.vue'
import HeaderVue from '../../components/Header.vue'
import { useRoute } from 'vue-router'
import { getIcon, getIconPages, Icon } from '../../apis/project'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatTime } from '../../utils'
import { usePageLoading } from '@/hooks/router'

const { t } = useI18n()
const pageLoading = usePageLoading()

const $route = useRoute()

interface Page {
  url: string
  count: number
}

const projectId = $route.params.projectId as string
const _id = $route.params.id as string
const icon = reactive({
  info: {} as Icon
})
const pageList = ref<Page[]>([])
const updateTime = ref('--')

async function getInfo() {
  const data = await getIcon(projectId, _id)
  Object.assign(icon, data)
}

async function getList() {
  const data = await getIconPages(projectId, _id)
  pageList.value = data.pages
  if (data.updateTime) {
    updateTime.value = formatTime(data.updateTime)
  }
}

onMounted(() => {
  Promise.all([getInfo(), getList()]).finally(() => {
    pageLoading.end()
  })
})
</script>

<template>
  <HeaderVue :back="`/icons/${projectId}`" />
  <UserVue />
  <div class="analyse">
    <div class="flex stretch">
      <IconVue :info="icon.info" />
      <div class="flex column info">
        <div>
          <span class="label">{{ t('name') }}</span>
          <span class="value">{{ icon.info.name }}</span>
        </div>
        <div>
          <div>
            <span class="label">{{ t('updateTime') }}</span>
            <span class="value">{{ updateTime }}</span>
          </div>
          <div class="m-top">
            <span class="label">{{ t('statPeriod') }}</span>
            <span class="value">{{ t('last30d') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      {{ t('refererPageLink') }}
    </div>
    <div class="list">
      <div
        v-for="item in pageList"
        :key="item.url"
        class="item flex"
      >
        <a
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
        >{{ item.url }}</a>
        <div>
          <span>{{ t('refererCount') }}：</span>
          <span class="num">{{ item.count }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="footer" />
</template>

<style lang="scss" scoped>
@import "../../styles/var.scss";

.analyse {
  width: 100rem;
  margin: 0 auto;
  background: #fff;
  border-radius: 0.4rem;
  padding: 5rem;
  .icon {
    width: 21.5rem;
    height: 21.5rem;
  }
  .info {
    font-size: 1.4rem;
    .label {
      color: #808080;
      margin-right: 3.5rem;
    }
  }
  .title {
    margin: 3rem 0 1.3rem;
    font-size: 1.6rem;
  }
  .list {
    .item {
      height: 5rem;
      background-color: #f5f7fd;
      border-radius: 0.4rem;
      padding: 0 3.2rem;
      margin-top: 0.4rem;
      a {
        white-space: nowrap;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        color: $color-main;
        line-height: 1.2em;
      }
      .num {
        display: inline-block;
        width: 2em;
      }
    }
  }
}
.footer {
  height: 5rem;
}
</style>