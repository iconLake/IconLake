<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UserVue from '@/components/User.vue'
import HeaderVue from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import type { IUserTicket } from '@/apis/user'
import { userApis } from '@/apis/user'
import { onMounted, ref } from 'vue'
import { usePageLoading } from '@/hooks/router'

const pageLoading = usePageLoading()
const { t } = useI18n()
const route = useRoute()
const tickets = ref<IUserTicket[]>([])

async function claimTicket() {
  if (route.query.id && route.query.code) {
    const res = await userApis.claimTicket({
      projectId: route.query.id as string,
      code: route.query.code as string,
    }).catch((err) => {
      console.error(err)
      return err
    })
    if (!res.error) {
      console.log(res)
    }
    history.replaceState('', '', `${window.location.origin}${window.location.pathname}`)
  }
}

async function getTickets() {
  await userApis.getTickets().onUpdate(async (data) => {
    console.log(tickets)
    tickets.value = data.tickets
  })
}

onMounted(async () => {
  await claimTicket()
  await getTickets()
  pageLoading.end()
})
</script>

<template>
  <HeaderVue
    :back="true"
  />
  <UserVue />
  <div class="tickets">
    <div
      v-for="ticket in tickets"
      :key="ticket._id"
      class="ticket"
    >
      {{ ticket._id }}
    </div>
  </div>
</template>

