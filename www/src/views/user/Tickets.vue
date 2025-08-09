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
import { ONLINE_DOMAIN } from '@/utils/const'
import { dayjs } from 'element-plus'

const pageLoading = usePageLoading()
const { t } = useI18n()
const route = useRoute()
const tickets = ref<IUserTicket[]>([])
const claimedTicket = ref<IUserTicket>()

const jsConfetti = new JSConfetti()

function celebrate() {
  setInterval(() => {
    jsConfetti.addConfetti({
      emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸', '🌷', '🌹', '🌺', '💐', '🎉', '🎊', '🌟', '💖', '🌼', '🌻', '🔥', '👏', '🙌', '😍', '🥰', '😘', '🤩', '🥳'],
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

function gotoExhibition() {
  location.href = `${ONLINE_DOMAIN}/exhibition/${claimedTicket.value?.projectId}`
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
    @click="gotoExhibition"
  >
    <div
      v-if="claimedTicket.project.cover"
      class="cover"
    >
      <img
        :src="claimedTicket.project.cover || '/imgs/img-error.svg'"
        onerror="this.src='/imgs/img-error.svg'"
      >
    </div>
    <div class="info">
      <div
        v-if="claimedTicket.project.name"
        class="title"
      >
        {{ claimedTicket.project.name }}
      </div>
      <div
        v-if="claimedTicket.project.desc"
        class="desc"
      >
        {{ claimedTicket.project.desc }}
      </div>
    </div>
    <div class="ok">
      {{ t('go') }}
    </div>
  </div>
  <div class="tickets">
    <a
      v-for="ticket in tickets"
      :key="ticket._id"
      class="ticket"
      :href="`${ONLINE_DOMAIN}/exhibition/${ticket.projectId}`"
      target="_blank"
    >
      <div class="cover">
        <img
          :src="ticket.project.cover || '/imgs/img-error.svg'"
          :alt="ticket.project.name"
          onerror="this.src='/imgs/img-error.svg'"
        >
      </div>
      <div class="info flex column center">
        <div class="dots flex">
          <div
            v-for="v in new Array(15).map((_, i) => i)"
            :key="v"
            class="dot"
          />
        </div>
        <div
          v-if="ticket.project.name"
          class="title"
        >
          {{ ticket.project.name }}
        </div>
        <div
          v-if="ticket.project.desc"
          class="desc"
        >
          {{ ticket.project.desc }}
        </div>
      </div>
      <div class="expire flex">
        有效期截止：{{ dayjs(ticket.expired).format('YYYY-MM-DD HH:mm') }}
      </div>
    </a>
  </div>
</template>

<style scoped lang="scss">
.ticket,
.claimed {
  color: rgba(255, 255, 255, 0.8);
  background: #fff;
  cursor: pointer;
  border-radius: 40px;
  overflow: hidden;
  text-align: center;

  .cover {
    max-height: calc(100vh - 20rem);
    overflow: hidden;
  }
  img {
    width: 100%;
  }
  .info {
    background: #000;
    padding: 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    height: 6rem;
  }
  .title,
  .desc {
    padding: 0;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title {
    font-size: 1.3rem;
  }
  .desc {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
  }
}

.claimed {
  position: fixed;
  z-index: 1001;
  left: 0;
  right: 0;
  bottom: 5rem;
  width: 320px;
  margin: 0 auto;
  background-color: #000;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
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

.ticket {
  min-width: 260px;
  img {
    aspect-ratio: 16/9;
    object-fit: cover;
    object-position: center top;
  }
  .info {
    position: relative;
    overflow: hidden;
    .dots {
      $height: 1rem;
      position: absolute;
      top: -$height / 2;
      left: -$height / 2;
      right: -$height / 2;
      .dot {
        width: $height;
        height: $height;
        border-radius: 50%;
        background: var(--color-bg);
      }
    }
  }
  .expire {
    background: #fff;
    color: #000;
    padding: 2rem;
    font-size: 1rem;
    &::before,
    &::after {
      content: "";
      display: block;
      background: var(--color-bg);
      width: 2rem;
      height: 2rem;
      border-radius: 1rem;
    }
  }
}

.tickets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  padding: 3rem;
}
</style>
