<script setup lang="ts">
import { ElTooltip } from 'element-plus'
import { ref, useAttrs, watchEffect } from 'vue'

const emit = defineEmits(['update:visible'])

const attrs = useAttrs()

const visible = ref(false)

let timer: any

watchEffect(() => {
  visible.value = attrs.visible as boolean || false
  if (visible.value) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      visible.value = false
      emit('update:visible', false)
    }, 3000)
  }
})
</script>

<template>
  <ElTooltip :manual="true" :visible="visible" v-bind="attrs">
    <slot></slot>
  </ElTooltip>
</template>

<style lang="scss">
.el-popper.is-success,
.el-popper.is-success .el-popper__arrow::before {
  background-color: var(--el-color-success);
  color: var(--el-color-white);
}
.el-popper.is-danger,
.el-popper.is-danger .el-popper__arrow::before {
  background-color: var(--el-color-danger);
  color: var(--el-color-white);
}
</style>
