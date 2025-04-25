<script setup lang="ts">
import IconVue from '@/components/Icon.vue';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import CollectVue from './search/Collect.vue';
import { SearchedIcon } from '@/apis/extension';
import { getIconUrl } from '@/utils/icon';

const { t } = useI18n();

const props = defineProps<{
  icon: SearchedIcon
  projectId: string
  projectType: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  collectable?: boolean
}>()

const isImgShow = ref(true)

watch(() => props.icon, () => {
  isImgShow.value = false
  setTimeout(() => {
    isImgShow.value = true
  })
})

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
    <template v-if="isImgShow">
      <template
        v-if="icon.imgs?.length"
      >
        <IconVue
          v-for="(img, i) in icon.imgs"
          :key="i"
          :info="{...icon, img}"
        />
      </template>
      <IconVue
        v-else-if="getIconUrl(icon)"
        :info="icon"
      />
    </template>
    <div class="name">
      {{ icon.name }}
    </div>
    <div class="code">
      <a
        v-if="isLink(icon.code)"
        target="_blank"
        :href="icon.code"
      >{{ icon.code }}</a>
      <span v-else>{{ icon.code }}</span>
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
  <CollectVue
    v-if="collectable"
    :icon="icon"
    :project-id="projectId"
    :project-type="projectType"
  />
</template>

<style scoped lang="scss">
@import "../../styles/var.scss";

.review {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #fff, $alpha: 0.8);
  backdrop-filter: blur(20px);
  overflow: auto;
  padding: 1.5rem;
  justify-content: safe center;  

  .icon {
    width: auto;
    height: auto;
    max-width: 98vw;
    max-height: 92vh;
    margin-bottom: 0.8rem;
    :deep(img) {
      min-height: 50vh;
    }
  }

  .name {
    margin-top: 1.5rem;
    font-size: 1.5rem;
    line-height: 1.5;
    word-break: break-all;
  }

  .code {
    margin-top: 0.5rem;
    font-size: 1.2rem;
    color: #666;
    word-break: break-all;
  }

  .btns {
    margin-top: 5rem;
    color: #aaa;
    transition: $transition;

    &>div {
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
