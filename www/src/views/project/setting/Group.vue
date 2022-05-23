<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { confirm } from '../../../utils'
import { delGroup, editGroup, Group, info as getProjectInfo } from '../../../apis/project'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()

const projectId = <string>route.params.id

const list = ref(<Group[]>[])

let movingItem: HTMLDivElement
let startY = 0
let isMoving = false
let itemHeight = 0

async function getList() {
  const res = await getProjectInfo(projectId, 'groups')
  list.value = res.groups.sort((a, b) => b.num - a.num)
}

getList()

function add () {
  const g:Group = {
    _id: '',
    name: t('newGroup'),
    num: list.value.length,
    icons: []
  }
  list.value.unshift(g)
  save(g)
}

function del (i: number) {
  confirm(`${t('delGroupConfirm')}：${list.value[i].name}？`, async () => {
    await delGroup(projectId, list.value[i]._id)
    list.value.splice(i, 1)
  })
}

function dragStart (e: MouseEvent) {
  const item = <HTMLDivElement>(<HTMLDivElement>e.target).parentNode
  movingItem = item
  startY = e.y
  isMoving = true
  item.style.zIndex = '10'
  itemHeight = item.offsetHeight
  item.classList.add('active')
}

function dragMove (e: MouseEvent) {
  if (isMoving) {
    movingItem.style.top = `${e.y - startY}px`
  }
}

function dragEnd (e: MouseEvent) {
  if (isMoving) {
    isMoving = false
    movingItem.style.top = '0'
    movingItem.style.zIndex = '0'
    movingItem.classList.remove('active')
    const n = Math.floor((e.y - startY) / itemHeight)
    const i = +<string>movingItem.dataset.i
    const insertI = Math.max(0, i + n)
    if (Math.abs(n) > 0) {
      list.value.splice(insertI, 0, ...list.value.splice(i, 1))
      list.value.forEach((g, i) => {
        const num = list.value.length - i - 1
        if (num !== g.num) {
          g.num = num
          save(g)
        }
      })
    }
  }
}

async function save (item: Group) {
  const res = await editGroup(projectId, item)
  if (!item._id) {
    item._id = res._id
  }
}
</script>

<template>
  <div class="item flex center c-main pointer" @click="add">
    <span>{{t('addGroup')}}</span>
    <i class="iconfont icon-plus m-left"></i>
  </div>
  <div class="list">
    <div class="item flex stretch" v-for="item, i in list" :data-i="i" draggable="true">
      <div class="drag iconfont icon-drag" @mousedown.prevent="dragStart" @mousemove="dragMove" @mouseup.prevent="dragEnd" @mouseleave="dragEnd"></div>
      <input class="grow" type="text" v-model="item.name" @change="save(item)">
      <div class="opt iconfont icon-delete c-danger" @click="del(i)"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  position: relative;
  height: 5rem;
  background: #fff;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  position: relative;
  z-index: 1;
  margin-bottom: 0.5rem;
  &.active {
    box-shadow: rgba($color: #000000, $alpha: 0.1) 0 0 1rem;
  }
  input {
    height: 100%;
    border: none;
    font-size: 1.4rem;
  }
  .drag,
  .opt {
    line-height: 5rem;
    padding: 0 2rem;
    cursor: pointer;
    font-size: 1.6rem;
  }
  .drag {
    font-size: 1.7rem;
    color: #b2b2b2;
    cursor: move;
  }
}
</style>