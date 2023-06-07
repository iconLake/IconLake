<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { del as delProject, clean as cleanProject, info, Project } from '../../../apis/project'
import { toast } from '../../../utils';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string
const name = ref('')
const project = ref<Project>()

async function getProject() {
  project.value = await info(projectId, 'name desc')
}

getProject()

async function del() {
  await delProject(projectId, name.value)
  router.push('/home')
}

async function clean() {
  await cleanProject(projectId, name.value)
  toast.success(t('cleanDone'))
}
</script>

<template>
  <div class="advance">
    <div class="warn">
      <p>{{ t('delProjectWarning') }}</p>
      <p>{{ t('inputForSafe') }}&nbsp;[<span class="name">{{ project?.name }}</span>]&nbsp;。</p>
    </div>
    <p>
      <input
        v-model="name"
        type="text"
        :placeholder="t('fillProjectName')"
      >
    </p>
    <div class="flex center">
      <button
        class="btn"
        :disabled="name !== project?.name"
        @click="clean"
      >
        {{ t('cleanProject') }}
      </button>
      <button
        class="btn"
        :disabled="name !== project?.name"
        @click="del"
      >
        {{ t('deleteProject') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.advance {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 4rem 5.2rem;
}
.warn {
  background-color: #fff1f1;
  color: #e8474f;
	border-radius: 0.4rem;
  padding: 2.6rem 3.8rem;
  font-size: 1.6rem;
  p {
    line-height: 2;
  }
  .name {
    margin: 0 0.5rem;
    font-weight: bold;
  }
}
input {
  height: 5rem;
  width: 100%;
  margin: 2.2rem 0 3.5rem;
  border: solid 0.1rem #ccc;
  padding: 0 4rem;
  font-size: 1.4rem;
}
.btn {
  margin: 0 1rem;
}
</style>
