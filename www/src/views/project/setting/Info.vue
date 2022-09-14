<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { editInfo, info } from '../../../apis/project';
import { toast } from '../../../utils';

const { t } = useI18n()

const $route = useRoute()

const projectId = $route.params.id as string
const project = ref({
  name: '',
  desc: '',
  class: '',
  prefix: '',
})

async function getProject() {
  project.value = await info(projectId, 'name desc class prefix')
}

async function save() {
  if (!project.value) {
    return
  }
  await editInfo(projectId, project.value)
  toast(t('saveDone'))
  setTimeout(() => {
    location.reload()
  }, 1000)
}

getProject()
</script>

<template>
  <form class="info" @submit.prevent="">
    <p>{{t('name')}}</p>
    <input type="text" class="input" maxlength="15" v-model="project.name">
    <p>{{t('desc')}}</p>
    <textarea rows="10" class="input" maxlength="300" v-model="project.desc"></textarea>
    <p>{{t('class')}}</p>
    <input type="text" class="input" maxlength="15" v-model="project.class">
    <p>{{t('prefix')}}</p>
    <input type="text" class="input" maxlength="15" v-model="project.prefix">
    <div class="flex center">
      <button type="submit" class="btn" :disabled="!project.name" @click="save">{{t('save')}}</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.info {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 4rem 5.2rem;
  .input {
    height: 4rem;
    width: 100%;
    border: solid 0.1rem #ccc;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    margin: 0.8rem 0 2.4rem;
  }
  textarea.input {
    height: 12rem;
    padding: 1.4rem;
  }
}
</style>