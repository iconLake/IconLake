<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UserVue from '@/components/User.vue'
import HeaderVue from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import type { IUserTicket } from '@/apis/user'
import { userApis } from '@/apis/user'
import { computed, onMounted, ref } from 'vue'
import { usePageLoading } from '@/hooks/router'
import JSConfetti from 'js-confetti'
import { ONLINE_DOMAIN } from '@/utils/const'
import { dayjs } from 'element-plus'
import Icon from '@/components/Icon.vue'
import { toIcon } from '@/utils/icon'
import { toast } from '@/utils'
import { useTicket } from '@/hooks/ticket'

const pageLoading = usePageLoading()
const { t } = useI18n()
const route = useRoute()
const tickets = ref<IUserTicket[]>([])
const claimedTicket = ref<IUserTicket>()
const { passkey, setTicketPasskey } = useTicket()

const jsConfetti = new JSConfetti()

const likedTickets = computed(() => {
  return [...tickets.value.filter(v => v.like.isLike)].sort((a, b) => (+new Date(a.like.time) < +new Date(b.like.time) ? 1 : -1))
})

const unlikedTickets = computed(() => {
  return [...tickets.value.filter(v => !v.like.isLike)].reverse()
})

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

async function gotoExhibition() {
  toast(t('loading'))
  const res = await setTicketPasskey({
    _id: claimedTicket.value!._id,
    passkey: passkey.value,
  })
  location.href = `${ONLINE_DOMAIN}/exhibition/${claimedTicket.value?.projectId}?ticket=${claimedTicket.value?._id}&passkey=${res.passkey}`
}

async function like(ticket: IUserTicket) {
  ticket.like.isLike = !ticket.like.isLike
  ticket.like.time = dayjs().toISOString()
  await userApis.likeTicket({
    _id: ticket._id,
    isLike: ticket.like.isLike,
  }).catch(() => {
    ticket.like.isLike = !ticket.like.isLike
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
    @click="gotoExhibition"
  >
    <div
      v-if="claimedTicket.project.cover"
      class="cover"
    >
      <Icon
        :info="toIcon({ img: { url: claimedTicket.project.cover } })"
        :compress="{ maxWidth: 600, maxHeight: 600 }"
        :lazy="true"
      />
    </div>
    <div class="info flex column center">
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
  <div
    v-for="(list, i) in [likedTickets, unlikedTickets]"
    :key="list[0]?._id"
    class="tickets-wrapper"
    :class="{'tickets-like': i === 0, 'tickets-unlike': i === 1, blur: !!claimedTicket }"
  >
    <div
      v-if="list.length>0"
      class="tickets-title"
    >
      <i class="iconfont icon-heart" />
    </div>
    <div
      v-if="list.length>0"
      class="tickets"
    >
      <a
        v-for="ticket in list"
        :key="ticket._id"
        class="ticket"
        :href="`${ONLINE_DOMAIN}/exhibition/${ticket.projectId}?ticket=${ticket._id}&passkey=${passkey}`"
        target="_blank"
        @click="setTicketPasskey({ _id: ticket._id, passkey })"
      >
        <div class="cover">
          <Icon
            :info="toIcon({ img: { url: ticket.project.cover } })"
            :compress="{ maxWidth: 600, maxHeight: 600 }"
            :lazy="true"
          />
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
        <div class="opts">
          <i
            class="iconfont icon-heart"
            :class="{ 'active heartbeat': ticket.like.isLike }"
            @click.prevent="like(ticket)"
          />
        </div>
        <div class="expire flex">
          {{ t('validUntil') }}{{ dayjs(ticket.expired).format('YYYY-MM-DD HH:mm') }}
        </div>
      </a>
    </div>
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
    .icon {
      width: 100%;
      height: auto;
    }
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
  .cover .icon {
    aspect-ratio: 16/9;
    :deep(img) {
      width: 100%;
      object-fit: cover;
      object-position: center top;
    }
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
  .opts {
    position: relative;
    top: -1rem;
    height: 0;
    color: var(--color-bg);
    opacity: 0;
    transition: var(--transition);
    .iconfont {
      font-size: 2.2rem;
      text-shadow: 0 0 1px #000;
      transition: var(--transition);
      &:hover:not(.active) {
        transform: scale(1.5);
      }
    }
    .icon-heart.active {
      color: var(--color-danger);
      text-shadow: 0 0 1px var(--color-danger);
    }
  }
  &:hover {
    .opts {
      opacity: 1;
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
  &-wrapper.blur {
    filter: blur(10px);
  }
  &-title {
    text-align: center;
    .iconfont {
      font-size: 3rem;
    }
  }
  &-like {
    .tickets-title {
      color: var(--color-danger);
    }
  }
  &-unlike {
    .tickets-title {
      color: var(--color-bg);
      text-shadow: 0 0 1px #000;
    }
  }
}
</style>
