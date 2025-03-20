<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '../../../utils'
import { ONLINE_DOMAIN } from '@/utils/const'
import Loading from '@/components/Loading.vue'
import { userApis, UserInfo } from '@/apis/user'
import { getCreator, getHash, updateCreator } from '@/apis/blockchain'
import { event } from '@/utils/event'

const { t } = useI18n()

const info = ref<UserInfo>({
  _id: '',
  name: '',
  desc: '',
  avatar: '',
  medias: [],
  tokenExpire: new Date(),
})
const isDiffFromChain = ref(false)
const isUpdatingChain = ref(false)

async function updateChain(e: Event) {
  e.preventDefault()
  const avatar = info.value.avatar
  if (!avatar) {
    toast(t('setAvatarFirst'))
    return
  }
  if (isUpdatingChain.value) {
    return
  }
  isUpdatingChain.value = true
  const hash = await getHash(avatar)
  if (!hash) {
    toast.error(t('fail'))
    isUpdatingChain.value = false
    return
  }
  let user: UserInfo|undefined
  await userApis.info().onUpdate(async (info) => {
    user = info
  })
  if (!user?.blockchain?.id) {
    toast.error(t('bindBlockchainFirst'))
    isUpdatingChain.value = false
    return
  }
  const res = await updateCreator({
    address: user.blockchain?.id,
    name: info.value.name ?? '',
    description: info.value.desc ?? '',
    avatar,
    avatarHash: hash.fileHash ?? '',
    medias: info.value.medias ?? [],
    sex: info.value.sex ?? '',
    birthday: info.value.birthday ?? '',
    location: info.value.location ?? '',
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

async function getInfoOnChain() {
  if (!info.value.blockchain?.id) {
    return
  }
  const infoOnChain = await getCreator(info.value.blockchain?.id)
  isDiffFromChain.value = !infoOnChain
    || infoOnChain.creator?.name !== info.value.name
    || infoOnChain.creator?.description !== info.value.desc
    || infoOnChain.creator?.avatar !== info.value.avatar
    || JSON.stringify(infoOnChain.creator?.medias) !== JSON.stringify(info.value.medias?.map(e => ({ name: e.name, content: e.content })))
    || infoOnChain.creator?.sex !== info.value.sex
    || infoOnChain.creator?.birthday !== info.value.birthday
    || infoOnChain.creator?.location !== info.value.location
}

onMounted(async () => {
  await userApis.info().onUpdate(async (user) => {
    info.value = {
      ...user,
      medias: (!user.medias || user.medias.length === 0) ? [{ name: '', content: '' }] : user.medias,
    }
  })
  await getInfoOnChain()

  event.on(event.EventType.UserInfoChange, async (data) => {
    info.value = data.userInfo
    await getInfoOnChain()
  })
})
</script>

<template>
  <a
    v-if="info.name || info.avatar"
    class="preview flex"
    :class="{ changed: isDiffFromChain }"
    :href="info.blockchain?.id ? `${ONLINE_DOMAIN}/exhibition/creator/${info.blockchain?.id}` : ''"
    target="_blank"
  >
    <div
      v-if="info.avatar"
      class="avatar"
      :style="{ backgroundImage: `url(${info.avatar})` }"
    />
    <div>
      <div class="name">
        {{ info.name }}
      </div>
      <div class="desc">
        {{ info.desc }}
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
</template>

<style lang="scss" scoped>
.preview {
  justify-content: flex-start;
  gap: 4rem;
  position: relative;
  padding: 4rem 5.2rem;
  background: #fff;
  margin-bottom: 2rem;
  border-radius: 0.4rem;

  &.changed {
    padding-bottom: 5.3rem;
  }
  .avatar {
    width: 8rem;
    min-width: 8rem;
    height: 8rem;
    border-radius: 4rem;
    background-size: cover;
  }
  .desc {
    font-size: 1.2rem;
    color: #666;
    margin-top: 1.6rem;
    line-height: 1.4;
    white-space: pre-wrap;
  }
  .update-chain {
    box-shadow: 0.075rem 0.369rem 0.413rem 0.025rem rgba(0, 0, 0, 0.2);
    position: absolute;
    right: 1.125rem;
    bottom: 1.125rem;
    .loading {
      margin-left: 0;
    }
  }
}

.btn {
  .loading {
    margin-left: 0.8rem;
  }
}
</style>
