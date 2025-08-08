<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UserVue from '@/components/User.vue'
import HeaderVue from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import type { IUserTicket } from '@/apis/user'
import { userApis } from '@/apis/user'
import { onMounted, ref } from 'vue'
import { usePageLoading } from '@/hooks/router'
import JSConfetti from 'js-confetti'

const pageLoading = usePageLoading()
const { t } = useI18n()
const route = useRoute()
const tickets = ref<IUserTicket[]>([])
const claimedTicket = ref<IUserTicket>()

const jsConfetti = new JSConfetti()
let timer

function celebrate() {
  timer = setInterval(() => {
    jsConfetti.addConfetti({
      emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸', '🌹', '🌺', '💐', '🎉', '🎊', '🌟', '💖'],
      emojiSize: 50,
      confettiNumber: 100,
    })
  }, 500)
}

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
      claimedTicket.value = res
      celebrate()
    }
    history.replaceState('', '', `${window.location.origin}${window.location.pathname}`)
  }
}

async function getTickets() {
  await userApis.getTickets().onUpdate(async (data) => {
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
  <div
    v-if="claimedTicket"
    class="claimed"
  >
    <div
      v-if="claimedTicket.project.cover"
      class="cover"
    >
      <img :src="claimedTicket.project.cover">
    </div>
    <h1
      v-if="claimedTicket.project.name"
      class="h1"
    >
      {{ claimedTicket.project.name }}
    </h1>
    <h2
      v-if="claimedTicket.project.desc"
      class="h2"
    >
      {{ claimedTicket.project.desc }}
    </h2>
    <div class="ok">
      进入
    </div>
  </div>
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

<style scoped lang="scss">
.claimed {
  position: fixed;
  z-index: 1001;
  left: 0;
  right: 0;
  bottom: 5rem;
  width: 320px;
  border-radius: 40px;
  overflow: hidden;
  text-align: center;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  background: #000;
  cursor: pointer;
  .cover {
    max-height: calc(100vh - 20rem);
    overflow: hidden;
  }
  img {
    width: 100%;
  }
  .h1,
  .h2 {
    padding: 0;
    margin-top: 1.5rem;
  }
  .h1 {
    font-size: 1.5rem;
  }
  .h2 {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.5);
  }
  .ok {
    background-color: #fff;
    width: 16%;
    margin: 2rem auto 0;
    color: #000;
    padding: 2rem 1rem 0.5rem;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
  }
}
</style>
