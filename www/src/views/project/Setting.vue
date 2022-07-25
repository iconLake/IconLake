<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import UserVue from '../../components/User.vue'
import HeaderVue from '../../components/Header.vue'
import { useI18n } from 'vue-i18n'
import { info } from '../../apis/project';

const { t } = useI18n()

const $route = useRoute()
const projectId = <string>$route.params.id
const project = ref(<{
  name: string
  desc: string
}>{})

async function getProject() {
  project.value = await info(projectId, 'name desc')
}

getProject()
</script>

<template>
  <HeaderVue :back="`/icons/${projectId}`" />
  <UserVue />
  <div class="flex start main">
    <div class="menu">
      <router-link class="item" active-class="active" to="./info">
        <i class="iconfont icon-info"></i>
        <span>{{t('projectInfo')}}</span>
      </router-link>
      <router-link class="item" active-class="active" to="./group">
        <i class="iconfont icon-group"></i>
        <span>{{t('iconGroup')}}</span>
      </router-link>
      <router-link class="item" active-class="active" to="./member">
        <i class="iconfont icon-member"></i>
        <span>{{t('projectMember')}}</span>
      </router-link>
      <router-link class="item" active-class="active" to="./monitor">
        <i class="iconfont icon-monitor"></i>
        <span>{{t('monitor')}}</span>
      </router-link>
      <router-link class="item" active-class="active" to="./advance">
        <i class="iconfont icon-setting"></i>
        <span>{{t('advance')}}</span>
      </router-link>
    </div>
    <div class="content grow">
      <router-link to="./info" class="flex info">
        <div class="grow">
          <div class="flex">
            <div class="title">{{project.name}}</div>
            <i class="iconfont icon-edit"></i>
          </div>
          <div class="desc">{{project.desc}}</div>
        </div>
        <div class="icon"></div>
      </router-link>
      <router-view></router-view>
    </div>
  </div>
  <div class="footer"></div>
</template>

<style lang="scss" scoped>
@import '../../styles/var.scss';
.header {
  margin-bottom: 2rem;
}
.footer {
  height: 8.8rem;
}

.main {
  width: 120rem;
  margin: 0 auto;
}
.menu {
  width: 20rem;
  min-width: 20rem;
  margin-top: -1.8rem;
  .item {
    display: flex;
    align-items: center;
    padding: 1.8rem 0;
    font-size: 1.4rem;
    white-space: nowrap;
    .iconfont {
      font-size: 1.6rem;
      margin-right: 2.9rem;
    }
    &:hover,
    &.active {
      color: $color-main;
    }
  }
}
.info {
  padding: 5rem 5.3rem;
  background: #fff;
  border-radius: 0.4rem;
  margin-bottom: 2.2rem;
  .title {
    font-size: 1.8rem;
    font-weight: bold;
  }
  .icon-edit {
    font-size: 1.4rem;
  }
  .desc {
    color: #4d4d4d;
    font-size: 1.4rem;
    line-height: 2rem;
    margin-top: 1.5rem;
    word-break: break-all;
  }
}
</style>