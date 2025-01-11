<script setup lang="ts">
import { loginByBlockchain, LoginParams, LoginType, userApis, UserInfo } from '@/apis/user'
import { usePageLoading } from '@/hooks/router'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import i18n from '@/i18n'
import { toast } from '@/utils'
import LoadingVue from '@/components/Loading.vue'
import { getSignMsg } from '@/utils/blockchain'
import { signMsg } from '@/apis/blockchain'

const { t } = useI18n()

const userInfo = ref<UserInfo>()
const loginParams = ref<LoginParams>()
const isDealing = reactive({
  gitee: false,
  github: false,
  blockchain: false,
  code: false,
})

const pageLoading = usePageLoading()

const forceBindText = computed(() => {
  return i18n.global.locale.value === 'zh-cn' ? '必须绑定Gitee才能使用全部功能' : ''
})

const boundCount = computed(() => {
  let count = 0
  Object.values(LoginType).forEach(t => {
    if (userInfo.value?.[t]?.id) {
      count++
    }
  })
  return count
})

onMounted(async () => {
  await Promise.all([
    userApis.info().onUpdate(async info => {
      userInfo.value = info
    }),
    userApis.loginParams().onUpdate(async info => {
      loginParams.value = info
    }),
  ])
  pageLoading.end()
})

async function bind(type: LoginType) {
  if (!loginParams.value) {
    throw new Error('no login params')
  }
  if (type === LoginType.Blockchain) {
    return await bindBlockchain()
  }
  if (type === LoginType.Gitee) {
    document.cookie = `referer=${location.href};path=/`
    location.href = `https://gitee.com/oauth/authorize?client_id=${loginParams.value.clientId.gitee}&redirect_uri=${loginParams.value.domain}%2Fapi%2Foauth%2Fgitee&response_type=code`
    return
  }
  if (type === LoginType.Github) {
    document.cookie = `referer=${location.href};path=/`
    location.href = `https://github.com/login/oauth/authorize?client_id=${loginParams.value.clientId.github}&redirect_uri=${loginParams.value.domain}%2Fapi%2Foauth%2Fgithub`
    return
  }
  if (type === LoginType.Code) {
    return await bindCode()
  }
}

async function bindCode() {
  const code = prompt(t('pleaseInputCode'))
  if (!code) {
    throw new Error('no code')
  }
  const res = await userApis.loginByCode({ code })
  if (!res || res.error) {
    throw new Error('login error')
  }
  if (res.userId !== userInfo.value?._id) {
    toast(t('alreadyBoundAndSwitch'))
    userApis.clearCache()
    await new Promise(() => {
      setTimeout(() => {
        location.reload()
      }, 2000)
    })
  }
}

async function bindBlockchain() {
  const catchCall = (err: Error) => {
    console.error(err)
    throw err
  }
  const msg = await getSignMsg().catch(catchCall)
  if (!msg) {
    throw new Error('no msg')
  }
  const signRes = await signMsg(msg).catch(catchCall)
  if (!signRes) {
    throw new Error('no sign')
  }
  const res = await loginByBlockchain({
    msg,
    sig: signRes.signature,
    pubkey: signRes.pub_key
  }).catch(catchCall)
  if (!res || res.error) {
    throw new Error('no res')
  }
  if (res.userId !== userInfo.value?._id) {
    toast(t('alreadyBoundAndSwitch'))
    userApis.clearCache()
    await new Promise(() => {
      setTimeout(() => {
        location.reload()
      }, 2000)
    })
  }
}

async function unbind(type: LoginType) {
  await userApis.unbind(type)
  await userApis.info().onUpdate(async info => {
    userInfo.value = info
  })
}

async function deal(type: LoginType) {
  isDealing[type] = true
  try {
    if (userInfo.value?.[type]?.id) {
      await unbind(type)
    } else {
      await bind(type)
    }
    toast.success(t('success'))
    userApis.info().onUpdate(async info => {
      userInfo.value = info
    })
  } catch (e) {
    console.error(e)
    toast.error(t('fail'))
  }
  isDealing[type] = false
}
</script>

<template>
  <div class="item">
    <div class="item-label">
      {{ t('blockchain') }}
    </div>
    <div class="item-value flex">
      <span>{{ userInfo?.blockchain?.id || t('notBound') }}</span>
      <div
        v-if="!userInfo?.blockchain?.id || boundCount > 1"
        class="btn"
        @click="deal(LoginType.Blockchain)"
      >
        <LoadingVue v-if="isDealing.blockchain" />
        <template v-else>
          {{ t(userInfo?.blockchain?.id ? 'unbind' : 'bind') }}
        </template>
      </div>
    </div>
  </div>
  <div
    v-if="loginParams?.login.gitee"
    class="item"
  >
    <div
      v-if="forceBindText"
      class="alert"
    >
      {{ forceBindText }}
    </div>
    <div class="item-label">
      Gitee
    </div>
    <div class="item-value flex">
      <div class="flex center">
        <img
          v-if="userInfo?.gitee?.avatar"
          :src="userInfo?.gitee?.avatar"
          :alt="userInfo?.gitee?.name"
          class="avatar"
        >
        <span>{{ userInfo?.gitee?.name || userInfo?.gitee?.id || t('notBound') }}</span>
      </div>
      <div
        class="btn"
        @click="deal(LoginType.Gitee)"
      >
        <LoadingVue v-if="isDealing.gitee" />
        <template v-else>
          {{ t(userInfo?.gitee?.id ? 'unbind' : 'bind') }}
        </template>
      </div>
    </div>
  </div>
  <div
    v-if="loginParams?.login.github"
    class="item"
  >
    <div class="item-label">
      Github
    </div>
    <div class="item-value flex">
      <div class="flex center">
        <img
          v-if="userInfo?.github?.avatar"
          :src="userInfo?.github?.avatar"
          :alt="userInfo?.github?.name"
          class="avatar"
        >
        <span>{{ userInfo?.github?.name || userInfo?.github?.id || t('notBound') }}</span>
      </div>
      <div
        class="btn"
        @click="deal(LoginType.Github)"
      >
        <LoadingVue v-if="isDealing.github" />
        <template v-else>
          {{ t(userInfo?.github?.id ? 'unbind' : 'bind') }}
        </template>
      </div>
    </div>
  </div>
  <div
    v-if="loginParams?.login.code"
    class="item"
  >
    <div class="item-label">
      Code
    </div>
    <div class="item-value flex">
      <span>{{ userInfo?.code?.id || t('notBound') }}</span>
      <div
        class="btn"
        @click="deal(LoginType.Code)"
      >
        <LoadingVue v-if="isDealing.code" />
        <template v-else>
          {{ t(userInfo?.code?.id ? 'unbind' : 'bind') }}
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../styles/var.scss";

.item {
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 0.4rem;
  padding: 2.3rem 5.2rem;
  position: relative;
  overflow: hidden;

  .item-label {
    margin-bottom: 1.5rem;
  }

  .item-value {
    font-size: 1.2rem;
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 1.25rem;
    margin-right: 1.5rem;
  }
}

.alert {
  position: absolute;
  top: 0;
  right: 0;
  background: $color-danger;
  color: #fff;
  padding: 0.8rem 0.8rem 0.8rem 1rem;
  border-radius: 0 0 0 1.2rem;
  font-size: 1rem;
}
</style>
