<script setup lang="ts">
import { ElButton, Placement } from 'element-plus'
import { computed, ref, useAttrs, watch } from 'vue'
import { ButtonTooltipType } from '../types'
import TooltipVue from './Tooltip.vue'

const props = defineProps<{
  tooltip?: {
    visible?: boolean
    placement?: Placement | undefined
  }
  tooltipType?: ButtonTooltipType
}>()

const emit = defineEmits(['update:tooltipVisible'])

const tooltipVisible = ref(false)

const attrs = useAttrs()

const tooltopOptions = computed(() => {
  const {
    placement,
    ...options
  } = props.tooltip ?? {}
  return options
})

watch(() => props.tooltip?.visible, () => {
  tooltipVisible.value = props.tooltip?.visible || false
})

watch(() => tooltipVisible.value, v => {
  emit('update:tooltipVisible', v)
})
</script>

<template>
  <TooltipVue :effect="props.tooltipType" :placement="props.tooltip?.placement ?? 'top'" :manual="true" v-model:visible="tooltipVisible" v-bind="tooltopOptions">
    <ElButton v-bind="attrs">
      <slot></slot>
    </ElButton>
  </TooltipVue>
</template>
