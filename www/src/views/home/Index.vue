<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { list as getProjects, Project } from '../../apis/project'
import IconVue from '../../components/Icon.vue'
import UserVue from '../../components/User.vue'

const { t } = useI18n()

const data = reactive({
  projects: [] as Project[],
  isLoading: true
})

getProjects().then(res => {
  data.projects = res.list
  data.isLoading = false
})
</script>

<template>
  <UserVue />
  <div
    v-if="!data.isLoading && data.projects.length === 0"
    class="empty flex center column"
  >
    <div class="title">
      {{ t('welcomeAndGuide') }}
    </div>
    <div>
      <router-link
        to="/project/create"
        class="btn"
      >
        <span class="btn-text">{{ t('newProject') }}</span>
        <span class="btn-icon iconfont icon-plus" />
      </router-link>
    </div>
    <img :src="'/imgs/project-empty.png'">
  </div>
  <div
    v-if="!data.isLoading && data.projects.length > 0"
    class="container flex stretch"
  >
    <a
      href="/"
      class="banner flex center"
    >
      <img
        class="bg-c-t"
        :src="'/imgs/project-bg-circle-t.png'"
      >
      <img
        class="bg-c-b"
        :src="'/imgs/project-bg-circle-b.png'"
      >
      <div class="title">iconLake</div>
      <div class="slogan">Make icon in control</div>
    </a>
    <div class="flex column start grow">
      <div class="operate">
        <router-link
          to="/project/create"
          class="btn"
        >
          <span class="btn-text">{{ t('newProject') }}</span>
          <span class="btn-icon iconfont icon-plus" />
        </router-link>
      </div>
      <div class="list flex wrap start">
        <router-link
          v-for="item in data.projects"
          :key="item._id"
          class="item"
          :to="`/icons/${item._id}`"
        >
          <div class="item-title">
            {{ item.name }}
          </div>
          <div class="icons flex wrap center">
            <div
              v-for="icon in item.icons"
              :key="icon._id"
              class="icon-item"
            >
              <IconVue :info="icon" />
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  min-height: 90vh;
  padding: 10rem 0;
  box-sizing: border-box;
  .title {
    font-size: 1.373rem;
    padding: 0 0 2.25rem;
  }
  img {
    height: 34.5rem;
    margin-top: 3rem;
  }
}
.container {
  padding: 1.875rem;
}
.banner {
  position: relative;
  width: 13.813rem;
  min-height: calc(100vh - 3.75rem);
  min-width: 13.813rem;
  background-color: #5f55cb;
	border-radius: 0.625rem;
  overflow: hidden;
  .bg-c {
    &-t,
    &-b {
      position: absolute;
      left: 0;
      right: 0;
    }
    &-t {
      top: 0;
    }
    &-b {
      bottom: 0;
    }
  }
  .title {
    transform: rotate(90deg);
    color: #5349bb;
    font-size: 6.921rem;
    position: relative;
    left: -4rem;
  }
  .slogan {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2rem;
    color: #fff;
    font-size: 1rem;
    text-align: center;
  }
}
.operate {
  margin-left: 3.125rem;
}
.item {
  margin: 3.125rem 0 0 3.125rem;
  padding: 1.875rem;
  width: 21.938rem;
	height: 19.125rem;
	background-color: #ffffff;
	border-radius: 0.625rem;
  box-sizing: border-box;
  &-title {
    font-size: 1.125rem;
	  font-weight: bold;
    margin-bottom: 1.875rem;
  }
}
.icon-item {
  width: 20%;
  padding: 1rem 0;
  text-align: center;
  svg {
    width: 1.8rem;
    height: 1.8rem;
  }
}
</style>