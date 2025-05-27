<script setup>
import { onMounted, ref } from 'vue';

const info = ref({})
const verifyStatus = ref(2)

async function getCreatorInfo() {
  info.value = await iconlakeAPI.creator.getInfo(iconlakeAPI.creator.address)
}

function loadShare() {
  iconlakeAPI.share.config.color = 'gray'
  iconlakeAPI.share.load(document.querySelector('.share'), {
    creator: info.value.address
  })
}

async function verifyFile() {
  verifyStatus.value = await iconlakeAPI.verifyHash(info.value.avatar, info.value.avatarHash)
}

function isLink(url) {
  return url.startsWith('http://') || url.startsWith('https://')
}

onMounted(() => {
  getCreatorInfo().then(() => {
    iconlakeAPI.loading.isShow = false
    // verifyFile()
    loadShare()
  })
})
</script>

<template>
  <div class="creator" v-if="info.name">
    <div class="avatar" v-if="info.avatar">
      <img :src="info.avatar" />
    </div>
    <div class="info">
      <div class="item name">{{info.name}}</div>
      <div class="item addr">{{info.address}}</div>
      <div class="item desc" v-if="info.description">{{info.description}}</div>
      <div class="item media-list" v-if="info.medias && info.medias.length">
        <div class="media" v-for="media in info.medias" :key="media.name">
          <a v-if="isLink(media.content)" :href="media.content" target="_blank">{{media.name}}</a>
          <template v-else>
            <span class="media-name">{{ media.name }}: </span>
            <span>{{ media.content }}</span>
          </template>
        </div>
      </div>
      <div class="item share"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: rgba(255, 255, 255, .95);
    z-index: 1;
    display: block;
    transform: rotate(-30deg);
    transform-origin: top right;
  }
}

.info {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  padding: 50px;
  max-width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 15%;
  .name {
    font-size: 30px;
  }
  .desc {
    margin-top: 30px;
    white-space: pre-wrap;
    line-height: 1.4;
  }
  .addr {
    margin-top: 12px;
    font-size: 12px;
    color: #999;
  }
  .media-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 30px;
    a {
      color: #000;
    }
    .media-name {
      font-size: 10px;
      opacity: 0.6;
    }
  }
  .share {
    margin-top: 30px;
  }
}
</style>

<style lang="scss">
.st-inline-share-buttons {
  .st-btn {
    background-color: transparent !important;
    line-height: 1 !important;
    img {
      width: 24px !important;
      height: 24px !important;
    }
  }
}
</style>
