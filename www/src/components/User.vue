<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import Cookies from 'js-cookie'
import { logout, userApis, UserInfo } from '../apis/user'
import { useI18n } from 'vue-i18n'
import { clearCache } from '@/utils/cache';
import { toast } from '@/utils';
const { t } = useI18n()

const locale = ref(Cookies.get('locale') || 'zh-cn')
const language = {
  'en-us': {
    label: '语言',
    value: '中文'
  },
  'zh-cn': {
    label: 'Language',
    value: 'English'
  },
}[locale.value]

const isPopShow = ref(false)
let popTimer: NodeJS.Timeout
const userInfo = reactive({} as UserInfo)
const isLoggedIn = ref(false)

async function getUserInfo () {
  userApis.info().onUpdate(async info => {
    Object.assign(userInfo, info)
    isLoggedIn.value = true
  })
}

onMounted(() => {
  getUserInfo().catch(e => {
    if (e.error === 'userNotLogin') {
      isLoggedIn.value = false
    }
  })
})

function setLocale (v:string) {
  locale.value = v
  Cookies.set('locale', v, {
    expires: 100 * 360
  })
  window.location.reload()
}

function toggleLocale () {
  setLocale(locale.value === 'en-us' ? 'zh-cn' : 'en-us')
}

function showPop (isShow: boolean) {
  if (popTimer) {
    clearTimeout(popTimer)
  }
  if (isShow) {
    isPopShow.value = isShow
  } else {
    popTimer = setTimeout(() => {
      isPopShow.value = false
    }, 100)
  }
}

async function userLogout() {
  showPop(false)
  toast(t('loggingOut'))
  await logout()
  clearCache()
  gotoLogin()
}

async function gotoLogin() {
  location.href = '/login'
}

function clearCachedData() {
  clearCache()
  toast(t('clearCacheDone&Reload'))
  setTimeout(() => {
    location.reload()
  }, 1000)
}
</script>

<template>
  <div
    class="user"
    @mouseenter="showPop(true)"
    @mouseleave="showPop(false)"
  >
    <div
      v-if="userInfo.avatar"
      class="avatar img"
    >
      <img
        :src="userInfo.avatar"
        :alt="userInfo.name"
      >
    </div>
    <div
      v-else
      class="avatar bg-main text flex center"
    >
      <span v-if="userInfo.name">{{ userInfo.name[0] }}</span>
      <i
        v-else
        class="iconfont icon-user"
      />
    </div>
    <div
      class="pop"
      :class="{active: isPopShow}"
    >
      <RouterLink
        class="item flex"
        to="/user/assets"
      >
        {{ t('myAssets') }}
      </RouterLink>
      <RouterLink
        class="item flex"
        to="/home"
      >
        {{ t('myProjects') }}
      </RouterLink>
      <div
        class="item flex"
        @click="toggleLocale"
      >
        <span>{{ language?.label }}</span>
        <span>{{ language?.value }}</span>
      </div>
      <div
        class="item flex"
        @click="clearCachedData"
      >
        <span>{{ t('clearCachedData') }}</span>
        <i class="iconfont icon-clean" />
      </div>
      <a
        :href="t('feedbackUrl')"
        target="_blank"
        class="item flex"
      >
        <span>{{ t('feedback') }}</span>
        <i class="iconfont icon-desc" />
      </a>
      <div
        v-if="isLoggedIn"
        class="item flex"
        @click="userLogout"
      >
        <span>{{ t('logout') }}</span>
        <i class="iconfont icon-out" />
      </div>
      <div
        v-else
        class="item flex"
        @click="gotoLogin"
      >
        <span>{{ t('login') }}</span>
        <i class="iconfont icon-in" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  position: absolute;
  top: 1.9rem;
  right: 2.5rem;
  z-index: 99;
  .avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 2rem;
    overflow: hidden;
    cursor: pointer;
    &.img {
      background: #fff;
      font-size: 0;
    }
    &.text {
      font-size: 1.8rem;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .icon-user {
    font-size: 2.5rem;
  }
  .pop {
    position: absolute;
    top: 5rem;
    right: 0;
    width: 20rem;
    background: #fff;
    border-radius: 0.5rem;
    display: none;
    font-size: 1.4rem;
    box-shadow: 0rem 0.4rem 1.02rem 0.08rem rgba(0, 0, 0, 0.08);
    padding: 1.8rem 0;
    z-index: 999;
    &.active {
      display: block;
    }
    .item {
      padding: 1.2rem 2rem;
      cursor: pointer;
      &:hover {
        background-color: #f5f7fd;
      }
    }
  }
}
</style>