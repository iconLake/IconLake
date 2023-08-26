<template>
  <span
    class="loading iconfont icon-loading"
  />
</template>

<style scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading {
  animation: rotate 2s linear 0s infinite;
  display: inline-block;
  line-height: 0;
}
</style>
