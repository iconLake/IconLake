<script lang="ts" setup>
import Header from '@/components/Header.vue';
import User from '@/components/User.vue';

</script>

<template>
  <Header :back="true" />
  <User />
  <div class="info">
    上链确权，保护版权
  </div>
</template>

<style lang="scss" scoped>
.info {
  text-align: center;
  padding: 5rem 0;
}
</style>
