<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { delMember, projectApis, Member, updateInviteCode } from '../../../apis/project';
import { confirm, copy, toast } from '../../../utils';
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/hooks/router';

const { t } = useI18n()
const pageLoading = usePageLoading()

const route = useRoute()
const projectId = route.params.id as string
const projectUserId = ref('')
const inviteCode = ref('')
const members = ref<Member[]>([])

const inviteLink = computed(() => `${location.origin}/manage/project/${projectId}/invite?code=${inviteCode.value}`)

async function getProject() {
  projectApis.info(projectId, 'userId invite').onUpdate(async data => {
    projectUserId.value = data.userId
    if (!data.invite) {
      updateCode()
    } else {
      const t = +new Date(data.invite.expired)
      if (t - Date.now() < 60 * 1000) {
        updateCode()
      } else {
        inviteCode.value = data.invite.code
      }
    }
  })
}

async function getList() {
  projectApis.getMembers(projectId).onUpdate(async data => {
    members.value = data
  })
}

onMounted(() => {
  Promise.all([getProject(), getList()]).finally(() => {
    pageLoading.end()
  })
})

async function updateCode() {
  const data = await updateInviteCode(projectId)
  inviteCode.value = data.code
}

function copyLink() {
  copy(inviteLink.value)
  toast(t('copyDone'))
}

function del(i: number) {
  const m = members.value[i]
  confirm(`${t('removeConfirm')}${m.user.name || ''}？`, () => {
    delMember(projectId, m._id)
    members.value.splice(i, 1)
  })
}
</script>

<template>
  <div class="member">
    <div class="invite flex start">
      <div class="m-right">
        <svg
          t="1640187477633"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8789"
          width="32"
          height="32"
        ><path
          d="M515.7888 690.3296L860.2624 486.4V162.7136c0-48.1792-37.9392-87.2448-84.6848-87.2448H256c-46.7968 0-84.6848 39.0656-84.6848 87.2448V486.4l344.4736 203.9296z"
          fill="#FFE37B"
          p-id="8790"
        /><path
          d="M890.6752 454.7584l-363.3664 228.3008c-7.0656 4.4032-16.0256 4.4032-23.04 0L140.9024 454.7584c-17.8688-11.264-40.192 2.8672-40.192 25.4464v319.7952c0 84.8384 62.8736 153.6 140.4416 153.6h549.2736c77.568 0 140.4416-68.7616 140.4416-153.6V480.2048c0-22.528-22.3232-36.6592-40.192-25.4464zM661.8624 270.592H323.072c-28.2624 0-51.2-22.9376-51.2-51.2s22.9376-51.2 51.2-51.2h338.7392c28.2624 0 51.2 22.9376 51.2 51.2s-22.8864 51.2-51.1488 51.2z"
          fill="#8C7BFD"
          p-id="8791"
        /><path
          d="M515.7888 449.536H323.072c-28.2624 0-51.2-22.9376-51.2-51.2s22.9376-51.2 51.2-51.2h192.7168c28.2624 0 51.2 22.9376 51.2 51.2s-22.9376 51.2-51.2 51.2z"
          fill="#8C7BFD"
          p-id="8792"
        /></svg>
      </div>
      <div>
        <p>{{ t('inviteLink') }}</p>
        <p
          class="c-main pointer"
          @click="copyLink"
        >
          {{ inviteLink }}<i class="iconfont icon-copy m-left" />
        </p>
      </div>
    </div>
    <div class="list">
      <div
        v-for="item, i in members"
        :key="item._id"
        class="item flex"
      >
        <span>{{ item.user.name || item.userId }}</span>
        <div>
          <i
            v-if="item.isAdmin"
            class="iconfont icon-admin c-danger"
            :title="t('admin')"
          />
          <i
            v-if="projectUserId !== item.userId"
            class="iconfont icon-delete c-danger m-left pointer"
            @click="del(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.invite {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 2.3rem 5.2rem;
  margin-bottom: 2.2rem;
  p {
    line-height: 2.5;
  }
}
.list {
  .item {
    height: 5rem;
    padding: 0 5.2rem;
    background-color: #fff;
	  border-radius: 0.4rem;
    margin-top: 0.3rem;
  }
  .iconfont {
    font-size: 1.6rem;
  }
}
</style>