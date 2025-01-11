<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderVue from '@/components/Header.vue'
import UserVue from '@/components/User.vue'
import { useI18n } from 'vue-i18n'

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
        to="/user/setting/bind"
      >
        <i class="iconfont icon-bind" />
        <span>{{ t('bind') }}</span>
      </RouterLink>
    </div>
    <div class="view">
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
