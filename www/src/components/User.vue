<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Cookies from 'js-cookie'
import { logout, info, UserInfo } from '../apis/user'
import { useI18n } from 'vue-i18n'
import { updateEncryptKey } from '@/utils/storage';
import { mintDrop } from '@/utils/global';
const { t } = useI18n()

let locale = ref(Cookies.get('locale') || 'zh-cn')
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

let isPopShow = ref(false)
let popTimer: NodeJS.Timeout
const userInfo = reactive({} as UserInfo)

async function getUserInfo () {
  Object.assign(userInfo, await info())
  updateEncryptKey(userInfo._id)
  if (userInfo.blockchain) {
    mintDrop(userInfo.blockchain.id)
  }
}

getUserInfo()

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
  await logout()
  location.href = '/login'
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
      <span>{{ userInfo.name ? userInfo.name[0] : 'U' }}</span>
    </div>
    <div
      class="pop"
      :class="{active: isPopShow}"
    >
      <RouterLink
        class="item flex"
        to="/user/assets"
      >
        我的资产
      </RouterLink>
      <div
        class="item flex"
        @click="toggleLocale"
      >
        <span>{{ language?.label }}</span>
        <span>{{ language?.value }}</span>
      </div>
      <a
        href="https://support.qq.com/product/370032"
        target="_blank"
        class="item flex"
      >{{ t('feedback') }}</a>
      <div
        class="item flex"
        @click="userLogout"
      >
        <span>{{ t('logout') }}</span>
        <i class="iconfont icon-out" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  position: absolute;
  top: 1.9rem;
  right: 2.5rem;
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