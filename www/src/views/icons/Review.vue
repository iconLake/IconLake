<script setup lang="ts">
import { Icon } from '@/apis/project';
import IconVue from '@/components/Icon.vue';
import { onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  info: Icon
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}>()

function isLink(url: string) {
  return /^https?:\/\//i.test(url)
}

const handleKeydown = (e: { key: string; }) => {
  if (e.key === 'Escape') {
    props.onClose();
  } else if (e.key === 'ArrowLeft') {
    props.onPrev();
  } else if (e.key === 'ArrowRight') {
    props.onNext();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
})
</script>

<template>
  <div
    class="review flex center column"
    @click.self="onClose"
  >
    <IconVue :info="info" />
    <div class="name">
      {{ info.name }}
    </div>
    <div class="code">
      <a
        v-if="isLink(info.code)"
        target="_blank"
        :href="info.code"
      >{{ info.code }}</a>
      <span v-else>{{ info.code }}</span>
    </div>
    <div class="btns flex center">
      <div
        class="btn-prev"
        @click="onPrev"
      >
        <p class="iconfont icon-back" />
        <p class="btn-name">
          {{ t('previousBtn') }}
        </p>
      </div>
      <div
        class="btn-close"
        @click="onClose"
      >
        <p class="iconfont icon-close" />
        <p class="btn-name">
          {{ t('closeBtn') }}
        </p>
      </div>
      <div
        class="btn-next"
        @click="onNext"
      >
        <p class="iconfont icon-back rotate" />
        <p class="btn-name">
          {{ t('nextBtn') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../styles/var.scss";

.review {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #fff, $alpha: 0.8);
  backdrop-filter: blur(20px);
  overflow: auto;
  padding: 1.5rem;
  .icon {
    width: auto;
    height: auto;
    max-width: 98vw;
    max-height: 92vh;
  }
  .name {
    margin-top: 1.5rem;
    font-size: 1.5rem;
    line-height: 1.5;
  }
  .code {
    margin-top: 0.5rem;
    font-size: 1.2rem;
    color: #666;
  }

  .btns {
    margin-top: 5rem;
    color: #aaa;
    transition: $transition;
    & > div {
      text-align: center;
      cursor: pointer;
    }
    .btn-close {
      margin: 0 5rem;
    }
    .btn-name {
      font-size: 1rem;
      color: #666;
      margin-top: 0.5rem;
      opacity: 0;
      transition: $transition;
    }
    .iconfont.rotate {
      transform: rotate(180deg);
    }
    &:hover {
      color: #000;
      .btn-name {
        opacity: 1;
      }
    }
  }
}
</style>
