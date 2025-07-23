<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '../../../utils'
import { ONLINE_DOMAIN } from '@/utils/const'
import Loading from '@/components/Loading.vue'
import { getCreator, getHash, updateCreator } from '@/apis/blockchain'
import { useUser } from '@/hooks/user'

const { t } = useI18n()
const { userInfo, getUserInfo } = useUser()

const isDiffFromChain = ref(false)
const isUpdatingChain = ref(false)

async function updateChain(e: Event) {
  e.preventDefault()
  const avatar = userInfo.avatar
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
  if (!userInfo.blockchain?.id) {
    toast.error(t('bindBlockchainFirst'))
    isUpdatingChain.value = false
    return
  }
  const res = await updateCreator({
    address: userInfo.blockchain?.id,
    name: userInfo.name ?? '',
    description: userInfo.desc ?? '',
    avatar,
    avatarHash: hash.fileHash ?? '',
    medias: userInfo.medias ?? [],
    sex: userInfo.sex ?? '',
    birthday: userInfo.birthday ?? '',
    location: userInfo.location ?? '',
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
  if (!userInfo.blockchain?.id) {
    return
  }
  const infoOnChain = await getCreator(userInfo.blockchain?.id)
  isDiffFromChain.value = !infoOnChain
    || infoOnChain.creator?.name !== userInfo.name
    || infoOnChain.creator?.description !== userInfo.desc
    || infoOnChain.creator?.avatar !== userInfo.avatar
    || JSON.stringify(infoOnChain.creator?.medias) !== JSON.stringify(userInfo.medias?.map(e => ({ name: e.name, content: e.content })))
    || infoOnChain.creator?.sex !== userInfo.sex
    || infoOnChain.creator?.birthday !== userInfo.birthday
    || infoOnChain.creator?.location !== userInfo.location
}

watch(userInfo, () => {
  getInfoOnChain()
}, {
  immediate: true
})
</script>

<template>
  <a
    v-if="userInfo.name || userInfo.avatar"
    class="preview flex"
    :class="{ changed: isDiffFromChain }"
    :href="userInfo.blockchain?.id ? `${ONLINE_DOMAIN}/exhibition/creator/${userInfo.blockchain?.id}` : ''"
    target="_blank"
  >
    <div
      v-if="userInfo.avatar"
      class="avatar"
      :style="{ backgroundImage: `url(${userInfo.avatar})` }"
    />
    <div>
      <div class="name">
        {{ userInfo.name }}
      </div>
      <div class="desc">
        {{ userInfo.desc }}
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
