<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getExt, toast } from '../../../utils'
import { ElUpload } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { UPLOAD_DIR, UPLOAD_FILE_SIZE_LIMIT, ONLINE_DOMAIN } from '@/utils/const'
import { usePageLoading } from '@/hooks/router'
import Loading from '@/components/Loading.vue'
import { uploadFile, userApis, UserInfo } from '@/apis/user'
import { getCreator, getHash, updateCreator } from '@/apis/blockchain'

const { t } = useI18n()
const pageLoading = usePageLoading()

const info = ref<UserInfo>({
  _id: '',
  name: '',
  desc: '',
  avatar: '',
  medias: [],
  tokenExpire: new Date(),
})
const isCoverUploading = ref(false)
const isSaving = ref(false)
const isDiffFromChain = ref(false)
const isUpdatingChain = ref(false)

async function save() {
  if (!info.value.name || isSaving.value) {
    return
  }
  isSaving.value = true
  try {
    await userApis.editInfo({
      name: info.value.name,
      desc: info.value.desc,
      avatar: info.value.avatar,
      medias: info.value.medias?.filter(e => e.content),
      sex: info.value.sex,
      birthday: info.value.birthday,
      location: info.value.location,
    })
  } catch (err) {
    isSaving.value = false
    return
  }
  toast(t('saveDone'))
  isSaving.value = false
  getInfoOnChain()
}

async function handleUpload(file: UploadFile) {
  if (!file.raw || !/^image\//i.test(file.raw?.type)) {
    toast(t('pleaseSelectFile', { type: t('img') }))
    return
  }
  if (!file.size || file.size > UPLOAD_FILE_SIZE_LIMIT) {
    toast(t('fileSizeLimitExceeded'))
    return
  }
  if (!info.value._id) {
    return
  }
  isCoverUploading.value = true
  const res = await uploadFile({
    _id: `${Date.now()}${getExt(file.name)}`,
    data: await file.raw.arrayBuffer(),
    dir: UPLOAD_DIR.AVATAR
  }).catch(() => {
    toast(t('fileUploadFailed'))
  })
  isCoverUploading.value = false
  if (res) {
    info.value.avatar = res.url
  }
}

const addMedia = () => {
  if (!info.value.medias) {
    info.value.medias = []
  }
  info.value.medias.push({
    name: '',
    content: '',
  })
}

const delMedia = (index: number) => {
  info.value.medias!.splice(index, 1)
}

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
    pageLoading.end()
    info.value = {
      ...user,
      medias: (!user.medias || user.medias.length === 0) ? [{ name: '', content: '' }] : user.medias,
    }
  })
  await getInfoOnChain()
})
</script>

<template>
  <a
    v-if="info.name || info.avatar"
    class="info preview flex"
    :class="{ changed: isDiffFromChain }"
    :href="info.blockchain?.id ? `${ONLINE_DOMAIN}/exhibition/creator/${info.blockchain?.id}` : ''"
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
  <form
    class="info"
    @submit.prevent=""
  >
    <p>{{ t('userName') }}</p>
    <input
      v-model="info.name"
      type="text"
      class="input"
      maxlength="16"
    >
    <p>{{ t('userDesc') }}</p>
    <textarea
      v-model="info.desc"
      rows="16"
      class="input"
      maxlength="1024"
    />
    <p>{{ t('avatar') }}</p>
    <ElUpload
      :show-file-list="false"
      :auto-upload="false"
      accept="image/*"
      class="upload-input"
      @change="handleUpload"
    >
      <div
        v-if="info.avatar && !isCoverUploading"
        class="preview-cnt"
      >
        <img
          :src="info.avatar"
          class="upload-preview"
        >
        <div class="preview-mask flex center">
          <i class="iconfont icon-edit" />
        </div>
      </div>
      <div
        v-else
        class="upload-add flex center"
      >
        <Loading v-if="isCoverUploading" />
        <i
          v-else
          class="iconfont icon-plus"
        />
      </div>
    </ElUpload>
    <p class="flex between">
      {{ t('userMedias') }}
      <button
        type="button"
        class="iconfont icon-plus btn-add"
        @click="addMedia"
      />
    </p>
    <ul class="medias">
      <li
        v-for="(media, index) in info.medias"
        :key="index"
        class="item"
      >
        <div class="flex center">
          <input
            v-model="media.name"
            type="text"
            class="input name"
            :placeholder="t('userMediaNamePlaceholder')"
            maxlength="16"
          >
          <input
            v-model="media.content"
            type="text"
            class="input"
            :placeholder="t('userMediaContentPlaceholder')"
            maxlength="128"
          >
          <button
            type="button"
            class="btn-del iconfont icon-delete"
            @click="delMedia(index)"
          />
        </div>
      </li>
    </ul>
    <p>{{ t('userSex') }}</p>
    <input
      v-model="info.sex"
      type="text"
      class="input"
      maxlength="8"
    >
    <p>{{ t('userBirthday') }}</p>
    <input
      v-model="info.birthday"
      type="text"
      class="input"
      maxlength="32"
    >
    <p>{{ t('userLocation') }}</p>
    <input
      v-model="info.location"
      type="text"
      class="input"
      maxlength="64"
    >
    <div class="flex center">
      <button
        type="submit"
        class="btn"
        :disabled="!info.name"
        @click="save"
      >
        {{ t('save') }}
        <Loading v-if="isSaving" />
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.preview {
  justify-content: flex-start;
  gap: 4rem;
  position: relative;
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

.info {
  background-color: #fff;
  border-radius: 0.4rem;
  padding: 4rem 5.2rem;
  margin-bottom: 2rem;

  .input {
    height: 4rem;
    width: 100%;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    margin: 0.8rem 0 2.4rem;
  }

  textarea.input {
    height: 16rem;
    padding: 1.4rem;
  }

  .upload-input {
    margin: 0.8rem 0 2.4rem;
  }

  .upload-add {
    height: 4rem;
    width: 4rem;
    border: #ccc 1px solid;
    border-radius: 0.625rem;
    color: var(--el-color-black);
    &:hover {
      color: var(--color-main);
      border-color: var(--color-main);
      transition: var(--transition);
    }

    .loading {
      color: var(--color-main);
    }
  }

  .upload-preview {
    height: 10rem;
  }
}

.preview-cnt {
  position: relative;
  overflow: hidden;
  border-radius: 0.625rem;

  &:hover {
    .preview-mask {
      opacity: 1;
    }
  }
}

.preview-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: rgba($color: #000, $alpha: 0.1);
  opacity: 0;
  transition: var(--transition);
  color: #fff;
  transition: var(--transition);

  .iconfont {
    font-size: 2rem;
  }
}

.medias {
  margin: 0 0 3.5rem;
  padding-left: 2rem;
  list-style: circle;
  .item {
    margin-top: 0.8rem;
    .flex {
      gap: 0.5rem;
    }
  }
  .input {
    margin: 0;
    &.name {
      width: 20rem;
    }
  }
  .btn-del {
    &:hover {
      transition: var(--transition);
      color: var(--color-danger);
    }
  }
}

.btn-add {
  &:hover {
    transition: var(--transition);
    color: var(--color-main);
  }
}

.btn {
  .loading {
    margin-left: 0.8rem;
  }
}
</style>
