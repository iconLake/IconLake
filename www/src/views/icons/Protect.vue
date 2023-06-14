<script lang="ts" setup>
import { getIcon, Icon as IconType, uploadFile } from '@/apis/project';
import { getHash, mintIcon, getAccount } from '@/apis/blockchain';
import Header from '@/components/Header.vue';
import Icon from '@/components/Icon.vue';
import User from '@/components/User.vue';
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const $route = useRoute()
const projectId = ref($route.params.projectId as string)
const id = ref($route.params.id as string)
const iconInfo = reactive({
  svg: {
    viewBox: '',
    path: '',
  },
} as IconType)

async function getIconInfo() {
  const icon = await getIcon(projectId.value, id.value)
  Object.assign(iconInfo, icon.info)
}

async function publish() {
  const file = await uploadFile(projectId.value, id.value + '.svg', `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="${iconInfo.svg.viewBox}">${iconInfo.svg.path}</svg>`)
  const url = /^http/.test(file.url) ? file.url : `${location.origin}${file.url}`
  const hash = await getHash(url)
  const account = await getAccount()
  if (!account) return
  const res = await mintIcon({
    creator: account.address,
    classId: projectId.value,
    id: hash.graphHash,
    uri: url,
    uriHash: hash.fileHash,
    data: {
      author: account.address,
      name: iconInfo.name,
      description: '',
      createTime: new Date().toISOString()
    },
    supply: 1
  })
  console.log(res)
}

getIconInfo()
</script>

<template>
  <Header :back="true" />
  <User />
  <div class="main">
    <p>上链确权，保护版权</p>
    <div
      v-if="iconInfo.svg.path"
      class="info"
    >
      <Icon :info="iconInfo" />
      <p>{{ iconInfo.name }}</p>
    </div>
    <div class="warn">
      <p>警告⚠️</p>
      <p>请发布原创作品，否则区块链凭证将成为你侵权的证据。</p>
    </div>
    <div class="operate">
      <button
        type="submit"
        class="btn"
        @click="publish"
      >
        发布到区块链
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  text-align: center;
  padding: 5rem 0;
}
.info {
  margin-top: 5rem;
  :deep(.icon-svg) {
    width: 10rem;
    height: 10rem;
  }
}
.warn {
  margin-top: 5rem;
  opacity: 0.5;
}
.operate {
  margin-top: 5rem;
}
</style>
