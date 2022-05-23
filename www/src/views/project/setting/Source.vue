<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { info, Source } from '../../../apis/project';
import FormVue from './source/Form.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Item extends Source {
  isFormShow: boolean
}

const route = useRoute()

const projectId = <string>route.params.id

const newSource = ref(<Item>{
  isFormShow: false
})

const list = ref(<Item[]>[])

async function getList() {
  const data = await info(projectId, 'sources')
  list.value = data.sources.map(e => ({
    isFormShow: false,
    ...e
  })).reverse()
}

function delItem (i:number) {
  list.value.splice(i, 1)
}

function createDone () {
  newSource.value.isFormShow = false
  getList()
}

function updateItem (i: number, source: Source) {
  list.value[i].name = source.name
}

getList()
</script>

<template>
  <div class="list">
    <div class="item add" :class="{active: newSource.isFormShow}">
      <div class="header flex center c-main" @click="newSource.isFormShow=!newSource.isFormShow">
        <span>{{t('addIconSource')}}</span>
        <i class="iconfont icon-plus"></i>
      </div>
      <FormVue v-if="newSource.isFormShow" :project-id="projectId" @save="createDone" />
    </div>
    <div class="item" :class="{active: item.isFormShow}" v-for="item, i in list" :key="item._id">
      <div class="header flex" @click="item.isFormShow=!item.isFormShow">
        <span>{{item.name}}</span>
        <i class="iconfont icon-angle"></i>
      </div>
      <FormVue
        v-if="item.isFormShow"
        :project-id="projectId"
        :info="item"
        :deletable="true"
        @delete="delItem(i)"
        @save="updateItem(i, $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  margin-bottom: 0.5rem;
  .header {
    height: 5rem;
    background: #fff;
    border-radius: 0.4rem;
    font-size: 1.4rem;
    cursor: pointer;
    position: relative;
    z-index: 1;
    padding: 0 5.3rem;
  }
  &.add {
    .header {
      .iconfont {
        margin-left: 0.6rem;
      }
    }
  }
  &.active {
    .icon-angle {
      transform: rotate(180deg);
    }
    .header {
      box-shadow: rgba($color: #000000, $alpha: 0.1) 0 0 1rem;
    }
  }
}
</style>