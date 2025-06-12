<script setup>
import { onMounted, ref } from 'vue';

const info = ref({})
const nfts = ref([])

async function getClassInfo() {
  info.value = await iconlakeAPI.class.getInfo(iconlakeAPI.class.id)
}

async function getNfts() {
  const res = await iconlakeAPI.class.getNfts(iconlakeAPI.class.id)
  nfts.value = res.nfts
}

function scrollToNfts() {
  document.querySelector('.list').scrollIntoView({ behavior: 'smooth' })
}

function loadShare() {
  iconlakeAPI.share.load(document.querySelector('.share'), {
    classId: info.value.id
  })
}

onMounted(() => {
  getClassInfo().then(() => {
    iconlakeAPI.loading.isShow = false
    loadShare()
  })
  getNfts()
})
</script>

<template>
  <div v-if="info.uri || info.name" class="class" @click="scrollToNfts">
    <div class="cover" :style="`background-image: url(${info.uri})`"></div>
    <div class="title">{{ info.name }}</div>
    <div class="desc">{{ info.description }}</div>
    <div class="author">Created by <a :href="`/exhibition/creator/${info.data?.author}`">{{ info.data?.author }}</a> <span class="share"></span></div>
  </div>
  <div class="list">
    <a v-for="nft in nfts" class="item" :href="`/exhibition/${info.id}/${nft.id}`">
      <div class="cover" :style="`background-image: url(${nft.uri})`"></div>
      <p class="title">{{ nft.data?.name }}</p>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.class {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-family: sans-serif;
  line-height: 1.8;
  padding: 0 80px;

  .cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
  }

  .title {
    font-size: 50px;
    font-weight: bold;
    position: relative;
  }

  .desc {
    font-size: 18px;
    margin-bottom: 40px;
    position: relative;
  }

  .author {
    font-size: 12px;
    position: absolute;
    left: 0;
    bottom: 20px;
    right: 0;
    text-align: center;

    a {
      color: #fff;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .share {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    cursor: pointer;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  font-family: sans-serif;
}

.item {
  width: 12.5vw;
  text-align: center;
  color: #000;
  margin-bottom: 30px;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  .cover {
    width: 8vw;
    height: 8vw;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0 auto;
  }

  .title {
    margin: 0;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
  }
}
</style>

<style lang="scss">
.st-inline-share-buttons {
  .st-btn {
    background-color: transparent !important;
  }
}
</style>