<script setup lang="ts">
import HeaderVue from '../../components/Header.vue'
import { computed, reactive } from "vue";
import { isIconfontResource } from "../../utils/validate";
import { create as createProject, editSource, sync } from "../../apis/project";
import { parseIconfontResourceUrl, parseResourceUrl, toast } from "../../utils";
import router from "../../router";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const fmData = reactive({
  _id: '',
  name: '',
  type: 1,
  resourceUrl: ''
})

const isChecked = computed(() => {
  return fmData.name && isIconfontResource(fmData.resourceUrl)
})

async function create () {
  toast(t('creatingProject'))
  const data = await createProject({
    name: fmData.name,
    sources: [parseIconfontResourceUrl(fmData.resourceUrl)]
  })
  fmData._id = data._id
  await addSource()
  router.replace(`/icons/${data._id}`)
}

async function addSource () {
  const url = parseResourceUrl(fmData.resourceUrl, fmData.type)
  const source = {
    projectId: fmData._id || '',
    _id: '',
    name: '初始源',
    type: fmData.type,
    resourceUrl: url.resourceUrl,
    syncUrl: url.syncUrl,
    prefix: '',
    className: ''
  }
  const { _id } = await editSource(source)
  await sync(fmData._id, _id)
  toast.success(t('creatingProjectDone'))
}

</script>

<template>
  <HeaderVue back="/home" />
  <div class="main flex stretch">
    <!-- form -->
    <div class="project bg-main grow flex center">
      <div class="slogan-left">Make</div>
      <form @submit.prevent="create" class="fm">
        <h1>{{t('newProject')}}</h1>
        <h2>{{t('fillProjectNameAndSource')}}</h2>
        <div class="item">
          <label>{{t('projectName')}}</label>
          <div class="input flex">
            <i class="iconfont icon-name"></i>
            <input class="grow" autocomplete="off" autofocus maxlength="15" type="text" name="name" v-model="fmData.name">
          </div>
        </div>
        <div class="item">
          <label>{{t('iconSourceOfIconfont')}}</label>
          <div class="input flex">
            <i class="iconfont icon-source"></i>
            <input class="grow" autocomplete="off" maxlength="100" type="text" name="resourceUrl" v-model="fmData.resourceUrl">
          </div>
          <p class="t-right">
            <router-link to="/help" class="link">{{t('howToGetOnlineLink')}}</router-link>
          </p>
        </div>
        <button class="bg-danger" type="submit" :disabled="!isChecked">{{t('createNow')}}</button>
      </form>
    </div>
    <!-- illus -->
    <div class="illus flex">
      <div class="slogan-right">icon in control</div>
      <div class="img">
        <img :src="'/imgs/illus-2.png'" alt="iconLake">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  z-index: 1;
  color: #fff;
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
    .input {
      width: 100%;
      height: 5.063rem;
      background-color: #3354bd;
	    border-radius: 0.625rem;
      overflow: hidden;
      i {
        padding: 0 0.938rem;
      }
      input {
        width: 100%;
        height: 100%;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        padding-right: 0.938rem;
      }
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