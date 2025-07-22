<script setup lang="ts">
import { type LoginParams, LoginType, userApis, type UserInfo } from '@/apis/user'
import { usePageLoading } from '@/hooks/router'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import i18n from '@/i18n'
import { confirm, toast } from '@/utils'
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
  accessKey: false,
  google: false,
  webAuthn: false,
  mail: false,
})
const bindMailFm = ref({
  mail: '',
  password: '',
})
const bindMailFmDom = ref<HTMLDivElement | null>(null)
const sendingMailStatus = ref(0)
const sendMailText = ref(t('sendPasswordToEmail'))

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
  switch (type) {
    case LoginType.Mail:
      return await bindMail()
    case LoginType.Blockchain:
      return await bindBlockchain()
    case LoginType.WebAuthn:
      return await bindWebAuthn()
    case LoginType.Google:
      document.cookie = `referer=${location.href};path=/`
      location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile')}&access_type=offline&include_granted_scopes=true&response_type=code&state=${loginParams.value.nonce}&client_id=${encodeURIComponent(loginParams.value.clientId.google)}&redirect_uri=${loginParams.value.domain}%2Fapi%2Foauth%2Fgoogle`
      return
    case LoginType.Gitee:
      document.cookie = `referer=${location.href};path=/`
      location.href = `https://gitee.com/oauth/authorize?client_id=${loginParams.value.clientId.gitee}&redirect_uri=${loginParams.value.domain}%2Fapi%2Foauth%2Fgitee&response_type=code`
      return
    case LoginType.Github:
      document.cookie = `referer=${location.href};path=/`
      location.href = `https://github.com/login/oauth/authorize?client_id=${loginParams.value.clientId.github}&redirect_uri=${loginParams.value.domain}%2Fapi%2Foauth%2Fgithub`
      return
    case LoginType.Code:
      return await bindCode()
    default:
      throw new Error('no type')
  }
}

async function bindMail() {
  await new Promise((resolve, reject) => {
    confirm(bindMailFmDom.value!, async () => {
      if (!bindMailFm.value.mail || !bindMailFm.value.password) {
        reject({
          error: 'argsError'
        })
        return
      }
      const res = await userApis.mailLogin({
        mail: bindMailFm.value.mail,
        password: bindMailFm.value.password,
      }).catch(e => e)
      if (res.error) {
        reject()
        return
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
      resolve(void 0)
    }, {
      cancel: () => {
        reject({
          error: 'cancel'
        })
      },
    })
  })
}

async function sendMail() {
  if (sendingMailStatus.value !== 0 || !bindMailFm.value.mail) {
    return
  }
  sendingMailStatus.value = 1
  sendMailText.value = t('sending')
  const res = await userApis.sendMail({
    mail: bindMailFm.value.mail,
  }).catch(e => e)
  if (res.error) {
    sendMailText.value = t(res.error)
    sendingMailStatus.value = 0
    return
  }
  sendingMailStatus.value = 2
  sendMailText.value = t('sendMailDone')
}

async function bindWebAuthn() {
  const t = new Date()
  const name = userInfo.value?.name || `iconLake Creator (${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()})`
  const cred = await navigator.credentials.create({
    publicKey: {
      rp: {
        name: 'iconLake'
      },
      challenge: new TextEncoder().encode(`Login iconLake\n${new Date().toISOString()}`),
      user: {
        id: new TextEncoder().encode(name),
        name,
        displayName: name
      },
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7
        },
        {
          type: 'public-key',
          alg: -257
        }
      ],
      timeout: 60000,
      attestation: 'none'
    }
  })
  const res = await userApis.webAuthnRegister(cred)
  if (!res || res.error) {
    throw new Error('login error')
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
  const res = await userApis.loginByBlockchain({
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
  } catch (e: any) {
    console.error(e)
    toast.error(t(e?.error || 'fail'))
  }
  isDealing[type] = false
}

async function regenAccessKey() {
  isDealing.accessKey = true
  try {
    await userApis.regenAccessKey()
    toast.success(t('success'))
    userApis.info().onUpdate(async info => {
      userInfo.value = info
    })
  } catch (e) {
    console.error(e)
    toast.error(t('fail'))
  }
  isDealing.accessKey = false
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
    v-if="loginParams?.login.webAuthn"
    class="item"
  >
    <div class="item-label">
      {{ t('webAuthn') }} ({{ t('fido') }})
    </div>
    <div class="item-value flex">
      <div class="flex center">
        <span>{{ userInfo?.webAuthn?.id || t('notBound') }}</span>
      </div>
      <div
        class="btn"
        @click="deal(LoginType.WebAuthn)"
      >
        <LoadingVue v-if="isDealing.webAuthn" />
        <template v-else>
          {{ t(userInfo?.webAuthn?.id ? 'unbind' : 'bind') }}
        </template>
      </div>
    </div>
  </div>
  <div
    v-if="loginParams?.login.google"
    class="item"
  >
    <div class="item-label">
      Google
    </div>
    <div class="item-value flex">
      <div class="flex center">
        <img
          v-if="userInfo?.google?.avatar"
          :src="userInfo?.google?.avatar"
          :alt="userInfo?.google?.name"
          class="avatar"
        >
        <span>{{ userInfo?.google?.name || userInfo?.google?.id || t('notBound') }}</span>
      </div>
      <div
        class="btn"
        @click="deal(LoginType.Google)"
      >
        <LoadingVue v-if="isDealing.google" />
        <template v-else>
          {{ t(userInfo?.google?.id ? 'unbind' : 'bind') }}
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
    v-if="loginParams?.login.mail"
    class="item"
  >
    <div class="item-label">
      Email
    </div>
    <div class="item-value flex">
      <span>{{ userInfo?.mail?.id || t('notBound') }}</span>
      <div
        class="btn"
        @click="deal(LoginType.Mail)"
      >
        <LoadingVue v-if="isDealing.mail" />
        <template v-else>
          {{ t(userInfo?.mail?.id ? 'unbind' : 'bind') }}
        </template>
      </div>
    </div>
    <div
      ref="bindMailFmDom"
      class="bind-mail-fm flex column"
    >
      <input
        v-model="bindMailFm.mail"
        type="email"
        :placeholder="t('email')"
      >
      <input
        v-model="bindMailFm.password"
        type="password"
        :placeholder="t('password')"
      >
      <div
        class="bind-mail-send"
        @click="sendMail"
      >
        {{ sendMailText }}
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
  <div
    class="item"
  >
    <div class="item-label">
      AccessKey
    </div>
    <div class="item-value flex">
      <span>{{ userInfo?.accessKey?.id || t('notBound') }}</span>
      <div
        class="btn"
        @click="regenAccessKey"
      >
        <LoadingVue v-if="isDealing.accessKey" />
        <template v-else>
          {{ t('regen') }}
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

.bind-mail-fm {
  display: none;
  gap: 1.4rem;
  input {
    padding: 0 1.4rem;
    height: 4rem;
    width: 100%;
  }
  .bind-mail-send {
    cursor: pointer;
    color: var(--color-main);
    opacity: 0.6;
    transition: var(--transition);
    font-size: 1rem;
    &:hover {
      opacity: 1;
    }
  }
}
:global(.confirm .bind-mail-fm) {
  display: flex;
}
</style>
