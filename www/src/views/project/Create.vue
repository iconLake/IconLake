<script setup lang="ts">
import HeaderVue from '../../components/Header.vue'
import { computed, onMounted, reactive, ref } from "vue";
import { create as createProject } from "../../apis/project";
import { toast } from "../../utils";
import router from "../../router";
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/hooks/router';

const { t } = useI18n()
const pageLoading = usePageLoading()

const fmData = reactive({
  _id: '',
  name: '',
  desc: ''
})

const isLoading = ref(false)

const isChecked = computed(() => {
  return fmData.name
})

async function create () {
  if (isLoading.value) {
    return
  }
  isLoading.value = true
  const data = await createProject({
    name: fmData.name,
    desc: fmData.desc
  })
  fmData._id = data._id
  router.replace(`/icons/${data._id}`)
  toast.success(t('creatingProjectDone'))
}

onMounted(() => {
  pageLoading.end()
})
</script>

<template>
  <HeaderVue
    back="/home"
    :white="true"
  />
  <div class="main flex stretch">
    <!-- form -->
    <div class="project bg-main grow flex center">
      <div class="slogan-left">
        YOU CREATE,
      </div>
      <form
        class="fm"
        @submit.prevent="create"
      >
        <h1>{{ t('newProject') }}</h1>
        <h2>{{ t('fillProjectNameAndDescription') }}</h2>
        <div class="item">
          <label>{{ t('projectName') }}</label>
          <div class="input flex">
            <i class="iconfont icon-name" />
            <input
              v-model="fmData.name"
              class="grow"
              autocomplete="off"
              autofocus
              maxlength="15"
              type="text"
              name="name"
            >
          </div>
        </div>
        <div class="item">
          <label>{{ t('projectDescription') }}</label>
          <div class="input textarea-input flex start">
            <i class="iconfont icon-desc" />
            <textarea
              v-model="fmData.desc"
              class="grow"
              autocomplete="off"
              maxlength="300"
              name="desc"
            />
          </div>
        </div>
        <button
          class="bg-danger"
          type="submit"
          :disabled="!isChecked"
        >
          {{ t('createNow') }}
        </button>
      </form>
    </div>
    <!-- illus -->
    <div class="illus flex">
      <div class="slogan-right">
        YOU OWN!
      </div>
      <div class="img">
        <img
          :src="'/imgs/illus-2.png'"
          alt="iconLake"
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  z-index: 1;
}
.main {
  min-height: 100vh;
}
.slogan-left,
.slogan-right {
  position: absolute;
  top: 10%;
  font-size: 6.8rem;
}
.slogan-left {
  right: 1.2rem;
}
.slogan-right {
  left: 1.2rem;
  color: #b2c3eb;
}
.project {
  position: relative;
  .fm {
    width: 36rem;
    padding-top: 10rem;
    h1 {
      font-size: 2.25rem;
      font-weight: bold;
      margin-bottom: 1.313rem;
    }
    h2 {
      margin-bottom: 2.125rem;
    }
    h2,
    p {
      font-size: 1.125rem;
      color: #b2c3eb;
    }
    p {
      padding: 0.688rem 0.875rem;
    }
    label {
      display: block;
      font-size: 1.125rem;
      padding: 0.75rem;
      margin-top: 0.875rem;
    }
    button[type="submit"] {
      display: block;
      padding: 0;
      height: 4.5rem;
      border-radius: 2.25rem;
      width: 100%;
      margin-top: 2rem;
    }
    .icon-desc {
      margin-top: 1.52rem;
    }
    .input {
      width: 100%;
      height: 5.063rem;
      background-color: #3354bd;
	    border-radius: 0.625rem;
      overflow: hidden;
      i {
        padding: 0 0.938rem;
      }
      input, textarea {
        width: 100%;
        height: 100%;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        padding-right: 0.938rem;
      }
      textarea {
        padding-top: 1.4rem;
      }
    }

    .textarea-input {
      height: 10.063rem;
    }
  }
}

.illus {
  position: relative;
  background: #eff3ff;
  padding: 0 4.56rem 0;
  align-items: flex-end;
  img {
    width: 54.75rem;
  }
}
</style>