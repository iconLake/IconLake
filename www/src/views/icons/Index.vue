<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Group, Icon, info as getProjectInfo, delIcon, batchGroupIcon, editGroup } from '../../apis/project'
import IconVue from '../../components/Icon.vue'
import { confirm, toast } from '../../utils'
import Detail from './Detail.vue'
import HeaderVue from '../../components/Header.vue'
import UserVue from '../../components/User.vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/Select.vue'

const { t } = useI18n()

const $route = useRoute()

const data = reactive({
  _id: $route.params.id as string,
  name: '',
  icons: [] as Icon[],
  groups: [] as Group[],
  groupMap: {} as {[x: string]: any},
  list: [] as Group[],
  detail: {
    info: {} as Icon,
    top: '-50rem',
    left: '-50rem',
    isShow: false
  },
  isBatching: false,
  selectedIcons: new Map<string, Icon>(),
  keyword: '',
  batchGroupId: ''
})

const batchGroupFormDom = ref<Element>()

const groupOptions = computed(() => [
  { label: t('ungrouped'), value: '' },
  ...data.groups.map(e => ({ label: e.name, value: e._id }))
])

async function getIcons () {
  const res = await getProjectInfo(data._id, 'name icons groups')
  data.name = res.name
  if (res.groups instanceof Array) {
    data.groups = res.groups.sort((a, b) => b.num - a.num)
    res.groups.forEach(e => {
      data.groupMap[e._id] = e
    })
  }
  if (res.icons instanceof Array) {
    data.icons = res.icons.reverse()
    getList()
    nextTick(updateMainWidth)
  }
}

function getList () {
  const groups = data.groups.map(e => {
    e.icons = []
    return e
  })
  const ungroupIcons: Icon[] = []
  data.icons.forEach(e => {
    if (iconFilter(e)) {
      if (e.groupId && e.groupId in data.groupMap) {
        data.groupMap[e.groupId].icons.push(e)
      } else {
        ungroupIcons.push(e)
      }
    }
  })
  if (ungroupIcons.length > 0) {
    if (groups.length === 0 || groups[0]._id) {
      groups.unshift({
        _id: '',
        name: '',
        num: groups.length,
        icons: ungroupIcons
      })
    } else {
      groups[0].icons = ungroupIcons
    }
  }
  data.list = groups.sort((a, b) => b.num - a.num).filter(groupFilter)
}

function iconFilter (icon: Icon) {
  if (!data.keyword) {
    return true
  }
  const reg = new RegExp(data.keyword, 'i')
  return reg.test(icon.name) || reg.test(icon.code)
}

function groupFilter (group: Group) {
  return data.keyword ? group.icons.length > 0 : true
}

getIcons()

const mainDom = ref<HTMLElement>()
const iconListDom = ref<Element>()
const detailDom = ref<{ root: Element }>()
let detailWidth = 0
let hideDetailTimer: NodeJS.Timeout

function showDetail (icon: Icon, e: Event) {
  if (!iconListDom.value) {
    return
  }
  if (hideDetailTimer) {
    clearTimeout(hideDetailTimer)
  }
  const iconPosition = (e.target as Element).getBoundingClientRect()
  const listPosition = iconListDom.value.getBoundingClientRect()
  const top = iconPosition.top - listPosition.top + iconPosition.height
  const right = (iconPosition.left + detailWidth) - listPosition.right
  const left = iconPosition.left + (right > 0 ? -right : 0) - listPosition.left
  data.detail = {
    info: icon,
    top: `${top}px`,
    left: `${left}px`,
    isShow: true
  }
}

function holdDetail() {
  if (hideDetailTimer) {
    clearTimeout(hideDetailTimer)
  }
}

function hideDetail () {
  hideDetailTimer = setTimeout(() => {
    data.detail.isShow = false
  }, 300)
}

function updateMainWidth () {
  if (!iconListDom.value || !mainDom.value) {
    return
  }
  if (typeof iconListDom.value.querySelector === 'function') {
    const icon = iconListDom.value.querySelector('.icon-item')
    if (icon) {
      const w = icon.getBoundingClientRect().width * 3 / 2
      // - 20 用于消除滚动条的影响
      mainDom.value.style.width = `${Math.floor((window.innerWidth - 20) / w) * w}px`
    }
  }
}

onMounted(() => {
  detailWidth = detailDom.value?.root.getBoundingClientRect().width || 200
})

function selectIcon(icon:Icon, e:MouseEvent) {
  if (!data.isBatching) {
    return
  }
  if (data.selectedIcons.has(icon._id)) {
    data.selectedIcons.delete(icon._id)
    return
  } else {
    data.selectedIcons.set(icon._id, icon)
  }
  if (e.shiftKey && data.selectedIcons.size > 1) {
    const list = Array.from(data.selectedIcons.values())
    const startItem = list[list.length - 2]
    const endItem = list[list.length - 1]
    if (startItem.groupId === endItem.groupId) {
      const icons = (data.groupMap[startItem.groupId] || data.list[0]).icons
      const startI = icons.findIndex((e:Icon) => e._id === startItem._id)
      const endI = icons.findIndex((e:Icon) => e._id === endItem._id)
      if (Math.abs(startI - endI) > 1) {
        for (let i = Math.min(startI, endI) + 1, n = Math.max(startI, endI); i < n; ++i) {
          data.selectedIcons.set(icons[i]._id, icons[i])
        }
      }
    }
  }
}

function selectGroup (group: Group) {
  if (!data.isBatching) {
    return
  }
  const isAllSelected = group.icons.every((icon: Icon) => data.selectedIcons.has(icon._id))
  const deal = isAllSelected ? 'delete' : 'set'
  group.icons.forEach((icon: Icon) => {
    data.selectedIcons[deal](icon._id, icon)
  })
}

async function batchDelete() {
  confirm(t('batchDeleteConfirm', { n: data.selectedIcons.size }), async () => {
    const ids: string[] = []
    data.selectedIcons.forEach(e => {
      ids.push(e._id)
    })
    await delIcon(data._id, ids)
    data.selectedIcons.clear()
    toast(t('deleteDone'))
    getIcons()
  })
}

async function batchGroup() {
  if (!batchGroupFormDom.value) {
    return
  }
  confirm(batchGroupFormDom.value, async () => {
    const ids: string[] = []
    data.selectedIcons.forEach(e => {
      ids.push(e._id)
    })
    await batchGroupIcon(data._id, ids, data.batchGroupId)
    data.selectedIcons.clear()
    toast(t('batchGroupDone'))
    getIcons()
  })
}

function updateIcon(eData: {
  name?: string
  groupId?: string
  tags?: string[]
}) {
  Object.assign(data.detail.info, eData)
  if ('groupId' in eData) {
    getList()
  }
}

async function saveGroup(name:string) {
  const g:Group = {
    _id: '',
    name,
    num: 0,
    icons: []
  }
  const res = await editGroup(data._id, g)
  g._id = res._id
  toast(t('saveDone'))
  addGroup(g)
}

function addGroup(group: Group) {
  data.groups.push(group)
  data.groupMap[group._id] = group
  getList()
}

async function batchDownload() {
  const zip = new JSZip()
  data.selectedIcons.forEach(e => {
    zip.file(`${e.code}.svg`, `<svg class="icon-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="${e.svg.viewBox}">${e.svg.path}</svg>`)
  })
  const content = await zip.generateAsync({
    type: 'blob'
  })
  saveAs(content, `${data.name}_${Date.now()}.zip`)
}

// search
watch(() => data.keyword, () => {
  getList()
})
</script>

<template>
  <HeaderVue back="/home">
    <div class="name">
      {{ data.name }}
    </div>
    <router-link
      :to="`/project/${data._id}/setting`"
      class="setting flex"
    >
      <span>{{ t('setting') }}</span>
      <i class="iconfont icon-setting-plain" />
    </router-link>
  </HeaderVue>
  <UserVue />
  <div
    ref="mainDom"
    class="main"
  >
    <div class="search flex center">
      <div class="input">
        <i class="iconfont icon-search" />
        <input
          v-model="data.keyword"
          type="text"
          :placeholder="t('search')"
        >
      </div>
    </div>
    <div class="operate flex">
      <router-link
        :to="`/icons/${data._id}/create`"
        class="operate-item flex"
      >
        <span>{{ t('createIcons') }}</span>
        <i class="iconfont icon-plus" />
      </router-link>
      <div
        class="operate-item flex"
        @click="data.isBatching=!data.isBatching"
      >
        <span>{{ t(data.isBatching ? 'cancelBatchOperation' : 'batchOperation') }}</span>
        <i class="iconfont icon-batch" />
      </div>
      <router-link
        :to="`/icons/${data._id}/use`"
        class="operate-item flex"
      >
        <span>{{ t('useCode') }}</span>
        <i class="iconfont icon-code" />
      </router-link>
    </div>
    <div
      v-if="data.isBatching"
      class="operate-batch"
    >
      <button
        class="btn"
        :disabled="data.selectedIcons.size===0"
        @click="batchDelete"
      >
        <span>{{ t('batchDelete') }}</span>
        <i class="iconfont icon-delete" />
      </button>
      <button
        class="btn"
        :disabled="data.selectedIcons.size===0"
        @click="batchGroup"
      >
        <span>{{ t('batchGroup') }}</span>
        <i class="iconfont icon-group-open" />
      </button>
      <button
        class="btn"
        :disabled="data.selectedIcons.size===0"
        @click="batchDownload"
      >
        <span>{{ t('batchDownload') }}</span>
        <i class="iconfont icon-download" />
      </button>
    </div>
    <div
      ref="iconListDom"
      class="list"
    >
      <div
        v-for="item in data.list"
        :key="item._id"
        class="group"
      >
        <div
          class="group-title flex"
          :class="{pointer: data.isBatching}"
          @click="selectGroup(item)"
        >
          <span>{{ item.name }}</span>
          <span
            v-if="data.isBatching"
            class="iconfont icon-select-all"
            :title="t('selectAll')"
          />
        </div>
        <div class="icons">
          <div
            v-for="icon in item.icons"
            :key="icon._id"
            class="icon-item t-center"
            :class="{selectable:data.isBatching, selected:data.selectedIcons.has(icon._id)}"
            @mouseenter="showDetail(icon, $event)"
            @mouseleave="hideDetail()"
            @click="selectIcon(icon, $event)"
          >
            <IconVue :info="icon" />
            <div class="name">
              {{ icon.name }}
            </div>
            <div class="code">
              {{ icon.code }}
            </div>
          </div>
        </div>
      </div>
      <Detail
        ref="detailDom"
        :project-id="data._id"
        :info="data.detail.info"
        :top="data.detail.top"
        :left="data.detail.left"
        :is-show="data.detail.isShow"
        :groups="data.groups"
        :icons="data.icons"
        @update="updateIcon"
        @add-group="addGroup"
        @mouseenter="holdDetail"
        @mouseleave="hideDetail"
      />
    </div>
  </div>
  <!-- 批量分组 -->
  <div
    ref="batchGroupFormDom"
    class="group-select"
  >
    <div class="label">
      {{ t('batchSetGroup', { n: data.selectedIcons.size }) }}
    </div>
    <Select
      v-model="data.batchGroupId"
      :options="groupOptions"
      :addable="true"
      :placeholder="t('ungrouped')"
      size="default"
      @add="saveGroup"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "../../styles/var.scss";

.header {
  .name {
    margin-left: 2.2rem;
  }
  .setting {
    color: #fff;
    height: 3rem;
    background-color: #cfd5e6;
	  border-radius: 1.5rem;
    padding: 0 1.5rem;
    margin-left: 1.3rem;
    &:hover {
      background: $color-main;
    }
    .iconfont {
      font-size: 1.5rem;
      margin-left: 0.3rem;
    }
  }
}
.main {
  margin: 0 auto;
  width: 90%;
  padding-bottom: 25rem;
}
.search {
  .input {
    position: relative;
    width: 75.5rem;
    height: 5rem;
    background-color: #fff;
    border-radius: 2.45rem;
    overflow: hidden;
    .iconfont {
      position: absolute;
      top: 1.5rem;
      left: 4rem;
      font-size: 2rem;
    }
    input {
      width: 100%;
      height: 100%;
      border: none;
      padding: 0 2rem 0 8rem;
      font-size: 1.4rem;
    }
  }
}
.operate {
  justify-content: flex-end;
  padding: 3rem 0;
  &-item {
    cursor: pointer;
    height: 3rem;
    font-size: 1.4rem;
    margin-left: 4rem;
    color: #4d4b4b;
    &:hover {
      color: #000;
    }
    .iconfont {
      font-size: 1.6rem;
      margin-left: 1rem;
    }
  }
}
.list {
  position: relative;
  .group {
    &-title {
      line-height: 2;
    }
  }
  .icons {
    display: flex;
    flex-wrap: wrap;
  }
}
.icon-item {
  margin: 2.5rem;
  padding: 1.2rem 0;
  cursor: pointer;
  color: #808080;
  font-size: 1.4rem;
  width: 10rem;
  border-radius: 0.4rem;
  box-sizing: border-box;
  border: solid 0.1rem transparent;
  &.selectable {
    background: #e5ecff;
    user-select: none;
    &.selected {
      border-color: $color-main;
      background: #fff;
    }
    .name,
    .code {
      padding: 0 0.5rem;
    }
  }
  :deep(.icon-svg) {
    width: 3.8rem;
    height: 3.8rem;
    margin-bottom: 2.5rem;
  }
  .name,
  .code {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.1;
  }
  .name {
    margin-bottom: 0.6rem;
  }
}

.operate-batch {
  padding: 2rem;
  background: #fff;
  border-radius: 0.4rem;
  text-align: center;
  margin-bottom: 2.5rem;
  .btn {
    height: 3rem;
    margin: 0 1rem;
    .iconfont {
      margin-left: 0.8rem;
    }
  }
}

.group-select {
  display: none;
  .label {
    margin-bottom: 1rem;
  }
  .select {
    width: 15rem;
    margin: 0 auto;
  }
}
:global(.confirm .group-select) {
  display: block;
}
</style>