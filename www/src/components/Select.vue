<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  options: {
    label?: string
    value: string
  }[]
  value: string
  addable?: boolean
}>()

const emits = defineEmits(['update:value'])

const label = computed(() => {
  const option = props.options.find(e => e.value === props.value)
  return option ? (option.label || option.value) : ''
})
</script>

<template>
  <div class="select">
    <div class="value flex pointer">
      <div class="label">{{label}}</div>
      <i class="iconfont icon-back"></i>
    </div>
    <div class="dropdown">
      <div v-for="item in props.options" :key="item.value" class="option">{{item.value}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select {
  position: relative;
  line-height: 1;
}
.value {
  padding: 8px 0 8px 12px;
  .iconfont {
    transform: rotate(-90deg);
  }
}
.dropdown {
  visibility: hidden;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  box-shadow: rgba($color: #000000, $alpha: 0.1) 0 0 2rem;
  background: #fff;
}
</style>
