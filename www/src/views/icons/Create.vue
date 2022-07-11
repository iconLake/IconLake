<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { info } from '../../apis/project'
import HeaderVue from '../../components/Header.vue'

const $route = useRoute()

const data = reactive({
  _id: <string>$route.params.id,
  name: ''
})

async function getInfo () {
  const res = await info(data._id, 'name icons')
  Object.assign(data, res)
}

getInfo()
</script>

<template>
  <HeaderVue :back="`/icons/${data._id}`">
    <div class="name">{{data.name}}</div>
  </HeaderVue>
  创作
</template>
