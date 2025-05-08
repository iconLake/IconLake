<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderVue from '@/components/Header.vue'
import UserVue from '@/components/User.vue'
import { useI18n } from 'vue-i18n'
import InfoCard from './setting/InfoCard.vue'

const { t } = useI18n()

</script>

<template>
  <HeaderVue :back="true" />
  <UserVue />
  <div class="flex start main">
    <div class="menu">
      <RouterLink
        class="item"
        active-class="active"
        to="/user/setting/info"
      >
        <i class="iconfont icon-user" />
        <span>{{ t('info') }}</span>
      </RouterLink>
      <RouterLink
        class="item"
        active-class="active"
        to="./theme"
      >
        <i class="iconfont icon-theme" />
        <span>{{ t('theme') }}</span>
      </RouterLink>
      <RouterLink
        class="item"
        active-class="active"
        to="/user/setting/bind"
      >
        <i class="iconfont icon-bind" />
        <span>{{ t('bind') }}</span>
      </RouterLink>
      <RouterLink
        class="item"
        active-class="active"
        to="/user/setting/usage"
      >
        <i class="iconfont icon-usage" />
        <span>{{ t('usage') }}</span>
      </RouterLink>
    </div>
    <div class="view">
      <InfoCard />
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../styles/var.scss';

.header {
  margin-bottom: 2rem;
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
      width: 2rem;
      text-align: center;
      &.icon-bind {
        font-size: 1.3rem;
      }
    }

    &:hover,
    &.active {
      color: $color-main;
    }
  }
}

.view {
  flex: 1;
}
</style>
