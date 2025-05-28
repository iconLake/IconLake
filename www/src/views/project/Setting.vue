<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import UserVue from '../../components/User.vue'
import HeaderVue from '../../components/Header.vue'
import { useI18n } from 'vue-i18n'
import { projectApis } from '@/apis/project';
import { userApis, type UserInfo } from '@/apis/user';
import { getHash, updateClass, getNftClass } from '@/apis/blockchain'
import Loading from '@/components/Loading.vue'
import { toast } from '@/utils'
import { usePageLoading } from '@/hooks/router'
import { PROJECT_TYPE, ONLINE_DOMAIN } from '@/utils/const'
import { event } from '@/utils/event'

const { t } = useI18n()
const pageLoading = usePageLoading()

const $route = useRoute()
const projectId = $route.params.id as string
const project = ref({
  type: PROJECT_TYPE.IMG,
  name: '',
  desc: '',
  cover: '',
  class: '',
})
const isInfoEditing = computed(() => /\/info$/i.test($route.path))
const isUpdatingChain = ref(false)
const isDiffFromChain = ref(false)

async function getProject() {
  await projectApis.info(projectId, 'type name desc cover class').onUpdate(async (res) => {
    project.value = res
  })
  getChainProject()
}

async function getChainProject() {
  const info = await getNftClass(projectId).catch(() => {})
  isDiffFromChain.value = !info
    || !info.class
    || info.class.name !== project.value.name
    || info.class.description !== project.value.desc
    || info.class.symbol !== project.value.class
    || info.class.uri !== project.value.cover
}

async function updateChain(e: Event) {
  e.preventDefault()
  const uri = project.value.cover
  if (!uri) {
    toast(t('setCoverFirst'))
    return
  }
  if (isUpdatingChain.value) {
    return
  }
  isUpdatingChain.value = true
  const hash = await getHash(uri)
  let user: UserInfo|undefined
  await userApis.info().onUpdate(async (info) => {
    user = info
  })
  if (!hash || !user?.blockchain?.id) {
    toast.error(t('fail'))
    return
  }
  const res = await updateClass({
    creator: user.blockchain?.id,
    id: projectId,
    name: project.value.name,
    description: project.value.desc,
    symbol: project.value.class,
    uri,
    uriHash: hash.fileHash ?? '',
  })
  if (res) {
    if (res?.code === 0) {
      toast(t('updateCompleted'))
      isDiffFromChain.value = false
    } else {
      toast(res?.rawLog ?? t('updateFailed'))
    }
  }
  isUpdatingChain.value = false
}

const handleProjectInfoChange = (data: { id: string }) => {
  if (data.id === projectId) {
    getProject()
  }
}

onMounted(() => {
  getProject().finally(() => {
    pageLoading.end()
  })

  event.on(event.EventType.ProjectInfoChange, handleProjectInfoChange)
})

onUnmounted(() => {
  event.off(event.EventType.ProjectInfoChange, handleProjectInfoChange)
})
</script>

<template>
  <HeaderVue :back="`/icons/${projectId}`" />
  <UserVue />
  <div class="flex start main">
    <div class="menu">
      <router-link
        class="item"
        active-class="active"
        to="./info"
      >
        <i class="iconfont icon-info" />
        <span>{{ t('projectInfo') }}</span>
      </router-link>
      <router-link
        class="item"
        active-class="active"
        to="./group"
      >
        <i class="iconfont icon-group" />
        <span>{{ t('iconGroup') }}</span>
      </router-link>
      <router-link
        class="item"
        active-class="active"
        to="./member"
      >
        <i class="iconfont icon-member" />
        <span>{{ t('projectMember') }}</span>
      </router-link>
      <router-link
        class="item"
        active-class="active"
        to="./theme"
      >
        <i class="iconfont icon-theme" />
        <span>{{ t('theme') }}</span>
      </router-link>
      <router-link
        v-if="project.type === PROJECT_TYPE.SVG"
        class="item"
        active-class="active"
        to="./monitor"
      >
        <i class="iconfont icon-monitor" />
        <span>{{ t('monitor') }}</span>
      </router-link>
      <router-link
        class="item"
        active-class="active"
        to="./advance"
      >
        <i class="iconfont icon-setting" />
        <span>{{ t('advance') }}</span>
      </router-link>
    </div>
    <div class="content grow">
      <a
        :href="`${ONLINE_DOMAIN}/exhibition/${projectId}`"
        target="_blank"
        class="flex info"
        :style="{
          'background-image': `url(${project.cover})`
        }"
      >
        <div class="grow">
          <div class="flex">
            <div class="title">
              {{ project.name }}
            </div>
            <i
              v-if="!isInfoEditing"
              class="iconfont icon-edit"
            />
          </div>
          <div class="desc">
            {{ project.desc }}
          </div>
        </div>
        <div
          v-if="isDiffFromChain"
          class="btn update-chain"
          @click="updateChain"
        >
          <Loading v-if="isUpdatingChain" />
          <span v-else>
            {{ t('UpdateOnchainInformation') }}
          </span>
        </div>
      </a>
      <router-view />
    </div>
  </div>
  <div class="footer" />
</template>

<style lang="scss" scoped>
@import '../../styles/var.scss';
.header {
  margin-bottom: 2rem;
}
.footer {
  height: 8.8rem;
}

.main {
  width: 120rem;
  margin: 0 auto;
}
.menu {
  width: 20rem;
  min-width: 20rem;
  margin-top: -1.8rem;
  .item {
    display: flex;
    align-items: center;
    padding: 1.8rem 0;
    font-size: 1.4rem;
    white-space: nowrap;
    .iconfont {
      font-size: 1.6rem;
      margin-right: 2.9rem;
    }
    &:hover,
    &.active {
      color: $color-main;
    }
  }
}
.info {
  padding: 5rem 5.3rem;
  background: #fff;
  border-radius: 0.4rem;
  margin-bottom: 2.2rem;
  background-size: cover;
  background-position: center;
  position: relative;
  .title {
    font-size: 1.8rem;
  }
  .icon-edit {
    font-size: 1.4rem;
  }
  .desc {
    color: #666;
    font-size: 1.3rem;
    line-height: 1.4;
    margin-top: 1.5rem;
    word-break: break-all;
  }
  .update-chain {
    box-shadow: 0.075rem 0.369rem 0.413rem 0.025rem rgba(0, 0, 0, 0.2);
    position: absolute;
    right: 1.125rem;
    bottom: 1.125rem;
  }
}
</style>
