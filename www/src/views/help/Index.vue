<script lang="ts" setup>
import { computed, ref } from 'vue'
import UserVue from '../../components/User.vue'
import HeaderVue from '../../components/Header.vue'

const searchKeyword = ref('')
const isSearchFocus = ref(false)
const isSearchActive = computed(() => {
  return isSearchFocus.value || searchKeyword.value
})

</script>

<template>
  <HeaderVue :back="true" />
  <UserVue />
  <div class="banner flex center">
    <div class="search" :class="{active: isSearchActive}">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="输入你的问题"
        @focus="isSearchFocus=true"
        @blur="isSearchFocus=false"
      >
      <i class="iconfont icon-search"></i>
    </div>
  </div>
  <div class="list">
    <div class="item">
      <div class="title">如何获取iconfont的在线链接？</div>
      <div class="context">
        <p>前往iconfont的“<a href="https://www.iconfont.cn/manage/index">我的项目</a>”，点击“查看在线链接”即可看到。</p>
        <p>
          <img :src="`/imgs/help-iconfont-online-link.png`" alt="iconfont在线链接">
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  color: #fff;
}
.banner {
  height: 33.8rem;
  background: url(/imgs/help-bg.png) center repeat-x;
  background-size: auto 100%;
}
.search {
  position: relative;
  input {
    width: 75.5rem;
    height: 5rem;
    background: #fff;
    box-sizing: border-box;
    border-radius: 2.45rem;
    padding: 0 2rem 0 8rem;
  }
  .iconfont {
    position: absolute;
    color: #7f7f7f;
    font-size: 2rem;
    left: 4.5rem;
    top: 1.5rem;
  }
  &.active {
    .iconfont {
      color: #000;
    }
  }
}
.list {
  padding: 5rem 0;
  width: 100rem;
  margin: 0 auto;
  .item {
    background: #fff;
    padding: 3.4rem 4.6rem;
    .title {
      font-size: 1.8rem;
      margin-bottom: 1.6rem;
    }
    .context {
      color: #4d4d4d;
      font-size: 1.4rem;
      line-height: 1.6;
      p {
        margin: 0.5em 0;
      }
      img {
        max-width: 100%;
      }
    }
  }
}
</style>