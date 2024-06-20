<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

interface Option {
  label?: string
  value: string
}

const props = defineProps<{
  options: Option[]
  modelValue: string
  addable?: boolean
  placeholder?: string
  size?: 'default'
}>()

const emits = defineEmits(['update:modelValue', 'change', 'add'])

const text = computed(() => {
  const option = props.options.find(e => e.value === props.modelValue)
  return option ? (option.label || option.value) : (props.placeholder || '')
})

const isActive = ref(false)
const isAdding = ref(false)
const addValue = ref('')
const valueInputDom = ref()
const addInputDom = ref()
let isHold = false

watch(isActive, v => {
  if (!v) {
    isHold = false
    isAdding.value = false
  }
})

const onSelect = (item: Option) => {
  const isChanged = props.modelValue !== item.value
  isActive.value = false
  emits('update:modelValue', item.value)
  isChanged && emits('change', item)
}

const onFocus = () => {
  isActive.value = true
  isHold = false
}

const onBlur = () => {
  setTimeout(() => {
    if (!isHold) {
      isActive.value = false
    }
    isHold = false
  }, 20);
}

const onAdd = () => {
  isActive.value = true
  isAdding.value = true
  isHold = true
  nextTick(() => {
    addInputDom.value.focus()
  })
}

const onAddSubmit = () => {
  if (!addValue.value) {
    return
  }
  isAdding.value = false
  emits('add', addValue.value)
  addValue.value = ''
  focus()
}

const focus = () => {
  !isActive.value && valueInputDom.value.focus()
}

const onArrowClick = () => {
  isActive.value = !isActive.value
  isActive.value && valueInputDom.value.focus()
}
</script>

<template>
  <div
    class="select"
    :class="{active: isActive, 'size-default': size === 'default'}"
  >
    <div class="value">
      <input
        ref="valueInputDom"
        class="text pointer flex start"
        :value="text"
        type="text"
        readonly
        @focus="onFocus"
        @blur="onBlur"
      >
      <i
        class="iconfont icon-back flex pointer"
        @click="onArrowClick"
      />
    </div>
    <div class="dropdown">
      <div
        v-for="item in props.options"
        :key="item.value"
        class="option pointer"
        @click="onSelect(item)"
      >
        {{ item.label || item.value }}
      </div>
      <div
        v-if="addable && !isAdding"
        class="add pointer"
        @click="onAdd"
      >
        <i class="iconfont icon-plus" />
      </div>
      <div
        v-if="isAdding"
        class="add-form"
      >
        <input
          ref="addInputDom"
          v-model="addValue"
          type="text"
          @submit="onAddSubmit"
        >
        <i
          class="iconfont icon-checked flex pointer"
          :class="{active: !!addValue}"
          @click="onAddSubmit"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/var.scss";

.select {
  position: relative;
  line-height: 1;
  z-index: 100;
  &.size-default {
    height: 4rem;
    .value {
      .text {
        padding: 0 1.4rem;
      }
    }
  }

  .value {
    position: relative;
    z-index: 101;
    height: 100%;
    .text {
      padding: 0 0.5rem;
      height: 100%;
      width: 100%;
      background: #fff;
    }
    .icon-back {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      transform: rotate(-90deg) scale(0.9);
      font-size: 1rem;
      padding: 0 0.6rem;
      transition: $transition;
    }
  }
  .dropdown {
    visibility: hidden;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: rgba($color: #000000, $alpha: 0.1) 0 0 2rem;
    background: #fff;
    margin-top: 3px;
    transform: translateY(-10px);
    opacity: 0;
    transition: $transition;
    border-radius: 0.625rem;
    padding: 0.8rem 0;
    .option {
      padding: 0.8rem;
      text-align: left;
      &:hover {
        background: #f8f8f8;
      }
    }
    .add {
      text-align: center;
      padding: 0.8rem;
      margin-bottom: -0.8rem;
    }
    .add-form {
      position: relative;
      margin: 0.8rem 0.8rem 0;
      input {
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 2.5rem 0 0.8rem;
      }
      .icon-checked {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 0 0.6rem;
        &.active {
          color: $color-main;
        }
      }
    }
  }
  &.active {
    .icon-back {
      transform: rotate(-270deg) scale(0.9);
    }
    .dropdown {
      visibility: visible;
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
