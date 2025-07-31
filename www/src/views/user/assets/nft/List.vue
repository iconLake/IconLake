<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ONLINE_DOMAIN } from '@/utils/const'
import { getNFTs, type INFT } from '@/apis/blockchain'
import { useUser } from '@/hooks/user'
import LoadingVue from '@/components/Loading.vue'
import Icon from '@/components/Icon.vue'

const { t } = useI18n()
const { userInfo } = useUser()

const nfts = reactive<INFT[]>([])
const isLoading = ref(true)

const groupedNfts = computed(() => {
  const groups: Record<string, INFT[]> = {};
  
  const sortedNfts = [...nfts].sort((a, b) => {
    const timeA = a.data.createTime ? +a.data.createTime : 0;
    const timeB = b.data.createTime ? +b.data.createTime : 0;
    return timeB - timeA;
  });
  
  sortedNfts.forEach(nft => {
    if (!nft.data.createTime) {
      const key = 'unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(nft);
    } else {
      const date = new Date(+nft.data.createTime);
      const key = date.toLocaleDateString();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(nft);
    }
  });
  
  return Object.entries(groups).map(([date, items]) => ({
    date,
    items
  }));
})

watch(() => userInfo.blockchain?.id, () => {
  if (!userInfo.blockchain?.id) {
    return
  }
  getNFTs({
    owner: userInfo.blockchain?.id
  }).then(res => {
    nfts.splice(0, nfts.length, ...res.nfts)
  }).finally(() => {
    isLoading.value = false
  })
}, { immediate: true })
</script>

<template>
  <div class="timeline-container">
    <h2 class="timeline-title">
      {{ t('myCreations') }}
    </h2>
    <div class="timeline">
      <div class="timeline-line" />
      <div class="timeline-track">
        <div 
          v-for="(group, groupIndex) in groupedNfts" 
          :key="groupIndex"
          class="timeline-group"
        >
          <div class="timeline-date">
            <div class="timeline-date-dot" />
            <div class="timeline-date-text">
              {{ group.date === 'unknown' ? t('unknown') : group.date }}
            </div>
          </div>
          <div class="timeline-group-items">
            <a
              v-for="item in group.items"
              :key="item.id"
              class="timeline-item"
              :href="`${ONLINE_DOMAIN}/exhibition/${item.classId ? encodeURIComponent(item.classId) : ''}/${item.id ? encodeURIComponent(item.id) : ''}`"
              target="_blank"
            >
              <div class="timeline-item-cover">
                <div class="timeline-item-img flex center">
                  <Icon
                    v-if="item.uri"
                    :info="{
                      name: item.data.description,
                      code: item.data.name,
                      img: {
                        url: item.uri
                      },
                      _id: item.id,
                      groupId: '',
                      tags: [],
                      blockchain: {
                        classId: item.classId,
                        nftId: item.id
                      }
                    }"
                    :compress="{ maxWidth: 400, maxHeight: 400 }"
                    lazy
                  />
                  <i
                    v-else
                    class="iconfont icon-info"
                  />
                </div>
              </div>
              <div class="timeline-item-info">
                <div class="timeline-item-name">
                  {{ item.data.name }}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isLoading"
      class="timeline-empty flex center"
    >
      <LoadingVue />
      <span>{{ t('loading') }}</span>
    </div>
    <div
      v-else-if="nfts.length === 0"
      class="timeline-empty flex center"
    >
      <i class="iconfont icon-warn heartbeat" />
      <span>{{ t('noNFTsFound') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timeline-container {
  padding: 2rem 0 6rem;
  margin: 0 auto;
  max-width: 100%;
  overflow: hidden;
}

.timeline-title {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2rem;
}

.timeline {
  position: relative;
  padding: 0 4rem;
  margin: 0 auto;
}

.timeline-track {
  display: flex;
  flex-direction: column;
  padding: 0 0 2rem 0;
  gap: 4rem;
  position: relative;
  z-index: 2;
}

.timeline-line {
  position: absolute;
  top: -2rem;
  bottom: 0;
  left: 3.85rem;
  width: 0.3rem;
  background-color: #fff;
  z-index: 1;
}

.timeline-group {
  margin-bottom: 4rem;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-date {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  
  &-dot {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: var(--color-main);
    border: 4px solid #fff;
    transform: translateX(-50%);
  }
  
  &-text {
    background-color: #fff;
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
  }
}

.timeline-group-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 2rem;
  padding-left: 4rem;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  position: relative;
  transition: transform 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-5px);
    
    .timeline-item-img {
      transform: scale(1.05);
    }
  }
  
  &-cover {
    width: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    border-radius: 1rem;
    margin-bottom: 0.8rem;
    background: #fff;
  }
  
  &-img {
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
    
    .iconfont {
      font-size: 4rem;
      color: #ddd;
    }
    
    :deep(.icon) {
      width: 100%;
      height: 100%;
    }
    
    :deep(.icon-img) {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  &-info {
    padding: 0.5rem;
    line-height: 1.3;
    text-align: center;
  }
  
  &-name {
    font-size: 1rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.timeline-empty {
  flex-direction: column;
  padding: 4rem 0;
  color: #ccc;
  
  .iconfont{
    font-size: 4rem;
    margin-bottom: 1.5rem;
    &.icon-loading {
      color: var(--color-main);
    }
  }
  
  span {
    font-size: 1.2rem;
  }
}
</style>
