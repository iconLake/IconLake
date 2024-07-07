<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { editMonitor, projectApis, Monitor } from '../../../apis/project'
import { copy, toast } from '../../../utils'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/hooks/router';

const { t } = useI18n()
const pageLoading = usePageLoading()

const route = useRoute()
const projectId = route.params.id as string

const monitor = ref<Monitor>({
  isOn: false,
  spider: ''
})

const jsSRC = computed(() => `${location.origin}/visit/monitor/${projectId}.js`)

async function getProject() {
  projectApis.info(projectId, 'monitor').onUpdate(async res => {
    monitor.value = res.monitor
  })
}

onMounted(() => {
  getProject().finally(() => {
    pageLoading.end()
  })
})

async function switchStatus() {
  monitor.value.isOn = !monitor.value.isOn
  await editMonitor(projectId, {
    isOn: monitor.value.isOn
  } as Monitor)
  toast(t('saveDone'))
}

function copyJS() {
  copy(jsSRC.value)
  toast(t('copyDone'))
}

async function saveSpider() {
  await editMonitor(projectId, {
    spider: monitor.value.spider
  } as Monitor)
  toast(t('saveDone'))
}
</script>

<template>
  <div class="monitor">
    <div>
      <div
        class="switch"
        :class="{off: !monitor.isOn}"
        @click="switchStatus"
      />
    </div>
    <p>{{ t('monitorUsingGuide') }}</p>
    <div
      class="file flex section"
      @click="copyJS"
    >
      <span>{{ jsSRC }}</span>
      <i class="iconfont icon-copy" />
    </div>
    <p>{{ t('iconFindFunction') }}</p>
    <div class="function section">
      <div>
        <p>funcation  spider() {</p>
        <p>const  list=[]</p>
        <p class="flex">
          <textarea
            v-model="monitor.spider"
            class="m-right"
            placeholder="不填则使用默认的抓取方法"
          />
          <textarea readonly>
/** 
 * 注：以下代码为默认抓取方法。
 *
 * list元素的数据类型为：
 *   elem: Element
 *   code: String
 *   prefix: String
 *   class: String
 */
const className = 'iconlake'
const prefix = 'icon-'
const iconReg = new RegExp(`${prefix}(\\S+)`, 'i')
document.body.querySelectorAll(`.${className}`).forEach(elem => {
  const m = elem.className.match(iconReg)
  const code = m ? m[1] : null
  if (code) {
    list.push({
      elem,
      code,
      prefix,
      class: className
    })
  }
})</textarea>
        </p>
        <p>return list;</p>
        <p>}</p>
      </div>
      <div class="operate flex center">
        <button
          class="btn"
          @click="saveSpider"
        >
          {{ t('save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.monitor {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 3.6rem 5.2rem;
}
p {
  margin: 1.7rem 0;
}
.section {
  background: #f5f7fd;
  color: #476de8;
  padding: 1.8rem 2.8rem;
  border-radius: 0.4rem;
}
.file {
  cursor: pointer;
  margin-bottom: 3.5rem;
}
.function {
  p {
    padding-left: 2em;
    &:first-child,
    &:last-child {
      padding-left: 0;
    }
  }
  textarea {
    width: 100%;
    height: 30rem;
    border-radius: 0;
    padding: 1rem;
    background: #fff;
    line-height: 1.6;
  }
}
</style>