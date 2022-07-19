<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Group, Icon, info as getProjectInfo, delIcon, batchGroupIcon, genIcon } from "../../apis/project";
import IconVue from "../../components/Icon.vue";
import { confirm, toast } from '../../utils';
import Detail from "./Detail.vue";
import HeaderVue from '../../components/Header.vue'
import UserVue from '../../components/User.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const $route = useRoute()

const data = reactive({
  _id: <string>$route.params.id,
  name: '',
  icons: <Icon[]>[],
  groups: <Group[]>[],
  groupMap: <any>{},
  list: <Group[]>[],
  detail: {
    info: <Icon>{},
    top: '-50rem',
    left: '-50rem',
    isShow: false
  },
  isBatching: false,
  selectedIcons: <Map<string, Icon>>new Map(),
  keyword: '',
  batchGroupId: ''
})

const batchGroupFormDom = ref(<Element>{})

async function getIcons () {
  const res = await getProjectInfo(data._id, 'name icons sources groups')
  data.name = res.name
  if (res.groups instanceof Array) {
    data.groups = res.groups.sort((a, b) => b.num - a.num)
    res.groups.forEach(e => {
      data.groupMap[e._id] = e
    })
  }
  if (res.icons instanceof Array) {
    data.icons = res.icons
    if (res.icons.length > 0) {
      getList()
      nextTick(updateMainWidth)
    }
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

// dev
genIcon(data._id, 'js')

const mainDom = ref(<HTMLElement>{})
const iconListDom = ref(<Element>{})
const detailDom = ref(<{ root: Element }>{})
let detailWidth = 0
let hideDetailTimer = 0

function showDetail (icon: Icon, e: Event) {
  if (hideDetailTimer) {
    clearTimeout(hideDetailTimer)
  }
  const iconPosition = (<Element>e.target).getBoundingClientRect()
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
  detailWidth = detailDom.value.root.getBoundingClientRect().width
})

function selectIcon(icon:Icon) {
  if (!data.isBatching) {
    return
  }
  if (data.selectedIcons.has(icon._id)) {
    data.selectedIcons.delete(icon._id)
  } else {
    data.selectedIcons.set(icon._id, icon)
  }
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

// search
watch(() => data.keyword, () => {
  getList()
})
</script>

<template>
  <HeaderVue back="/home">
    <div class="name">{{data.name}}</div>
    <router-link :to="`/project/${data._id}/setting`" class="setting flex">
      <span>{{t('setting')}}</span>
      <i class="iconfont icon-setting-plain"></i>
    </router-link>
  </HeaderVue>
  <UserVue />
  <div class="main" ref="mainDom">
    <div class="search flex center">
      <div class="input">
        <i class="iconfont icon-search"></i>
        <input type="text" :placeholder="t('search')" v-model="data.keyword">
      </div>
    </div>
    <div class="operate flex">
      <router-link :to="`/icons/${data._id}/create`" class="operate-item flex">
        <span>{{t('createIcons')}}</span>
        <i class="iconfont icon-plus"></i>
      </router-link>
      <div class="operate-item flex" @click="data.isBatching=!data.isBatching">
        <span>{{t(data.isBatching ? 'cancelBatchOperation' : 'batchOperation')}}</span>
        <i class="iconfont icon-batch"></i>
      </div>
    </div>
    <div class="operate-batch" v-if="data.isBatching">
      <button class="btn" @click="batchDelete" :disabled="data.selectedIcons.size===0">
        <span>{{t('batchDelete')}}</span>
        <i class="iconfont icon-delete"></i>
      </button>
      <button class="btn" @click="batchGroup" :disabled="data.selectedIcons.size===0">
        <span>{{t('batchGroup')}}</span>
        <i class="iconfont icon-group-open"></i>
      </button>
    </div>
    <div class="list" ref="iconListDom">
      <div class="group" v-for="item in data.list" :key="item._id">
        <div class="group-title">{{item.name}}</div>
        <div class="icons">
          <div
            class="icon-item t-center"
            :class="{selectable:data.isBatching, selected:data.selectedIcons.has(icon._id)}"
            v-for="icon in item.icons"
            :key="icon._id"
            @mouseenter="showDetail(icon, $event)"
            @mouseleave="hideDetail()"
            @click="selectIcon(icon)"
          >
            <IconVue :info="icon"/>
            <div class="name">{{icon.name}}</div>
            <div class="code">{{icon.code}}</div>
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
        @update="updateIcon"
        @mouseenter="holdDetail"
        @mouseleave="hideDetail"
      />
    </div>
  </div>
  <!-- 批量分组 -->
  <div class="group-select" ref="batchGroupFormDom">
    <div class="label">{{t('batchSetGroup', { n: data.selectedIcons.size })}}</div>
    <select v-model="data.batchGroupId">
      <option value="">{{t('ungrouped')}}</option>
      <option v-for="g in data.groups" :key="g._id" :value="g._id">{{g.name}}</option>
    </select>
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
  select {
    width: 15rem;
    padding: 1rem;
  }
}
:global(.confirm .group-select) {
  display: block;
}
</style>