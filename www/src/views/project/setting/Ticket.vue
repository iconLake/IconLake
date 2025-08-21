<script lang="ts" setup>
import type { IProjectTicket } from '@/apis/project';
import { projectApis } from '@/apis/project';
import { usePageLoading } from '@/hooks/router';
import { confirm, copy, toast } from '@/utils';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Loading from '@/components/Loading.vue'
import Icon from '@/components/Icon.vue';
import { toIcon } from '@/utils/icon';
import { dayjs } from 'element-plus';
import { ONLINE_DOMAIN } from '@/utils/const';

interface Ticket {
  code: string
  quantity: number
  days: number
}

const { t } = useI18n()
const pageLoading = usePageLoading()

const ticket = reactive<Ticket>({ code: '', quantity: 0, days: 1 })
const route = useRoute()
const projectId = route.params.id as string
const tickets = ref<IProjectTicket[]>([])
const emptyTickets = ref<(IProjectTicket & { isDeleting: boolean })[]>([])
const isSaving = ref(false)
const isRefreshing = ref(false)
const isCreatingEmptyTicket = ref(false)

const claimLink = computed(() => `${window.location.origin}/manage/user/tickets?pid=${projectId}&code=${ticket.code}`)

const genClaimLink = (ticket: IProjectTicket) => {
  return `${window.location.origin}/manage/user/tickets?tid=${ticket._id}&code=${ticket.code}`
}

function copyLink(link: string) {
  copy(link)
  toast(t('copyDone'))
}

async function updateCode() {
  if (isRefreshing.value) {
    return
  }
  isRefreshing.value = true
  const data = await projectApis.editTicket({
    projectId,
    code: 'new'
  }).finally(() => {
    isRefreshing.value = false
  })
  ticket.code = data.code
}

async function getProject(isUpdated?: boolean) {
  await projectApis.info(projectId, 'ticket').onUpdate(async data => {
    if (!isUpdated && (!data.ticket || !data.ticket.code)) {
      await updateCode()
      await getProject(true)
    } else if (data.ticket) {
      Object.assign(ticket, data.ticket)
    }
  })
}

async function getList() {
  await projectApis.getTickets({
    projectId
  }).onUpdate(async data => {
    tickets.value = data.tickets
  })
}

async function getEmptyTicketsList() {
  await projectApis.getEmptyTickets({
    projectId
  }).onUpdate(async data => {
    emptyTickets.value = data.tickets.map(t => ({
      ...t,
      isDeleting: false
    }))
  })
}

async function save() {
  if (isSaving.value) {
    return
  }
  isSaving.value = true
  await projectApis.editTicket({
    projectId,
    code: ticket.code,
    quantity: Number(ticket.quantity),
    days: Number(ticket.days)
  }).finally(() => {
    isSaving.value = false
  })
  toast(t('saveDone'))
}

async function createEmptyTicket() {
  if (isCreatingEmptyTicket.value) {
    return
  }
  isCreatingEmptyTicket.value = true
  await projectApis.createEmptyTicket({
    projectId,
    quantity: Number(ticket.quantity),
    days: Number(ticket.days)
  }).finally(() => {
    isCreatingEmptyTicket.value = false
  })
  toast(t('saveDone'))
  await getEmptyTicketsList()
}

async function deleteEmptyTicket(ticket: IProjectTicket & { isDeleting: boolean }) {
  if (ticket.isDeleting) {
    return
  }
  confirm(t('deleteConfirm'), async () => {
    ticket.isDeleting = true
    await projectApis.deleteEmptyTicket({
      _id: ticket._id
    }).finally(() => {
      ticket.isDeleting = false
    })
    toast(t('deleteDone'))
    emptyTickets.value = emptyTickets.value.filter(t => t._id !== ticket._id)
  })
}

onMounted(() => {
  Promise.all([getProject(), getList(), getEmptyTicketsList()]).finally(() => {
    pageLoading.end()
  })
})
</script>

<template>
  <div class="ticket">
    <div class="claim flex start">
      <div class="m-right">
        <svg
          viewBox="0 0 1115 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
        ><path
          d="M84.836796 530.002235a136.14898 136.14898 0 0 1 21.526408 20.52776 136.038019 136.038019 0 0 1-16.755091 191.51845 135.261293 135.261293 0 0 1-51.152958 26.741569l196.62265 234.460304 726.460775-609.618984-295.155898-351.745938z"
          fill="#F6EB73"
        /><path
          d="M547.811633 357.457463m-66.385745 55.704253a86.660435 86.660435 0 1 0 132.771489-111.408507 86.660435 86.660435 0 1 0-132.771489 111.408507Z"
          fill="#ED7751"
        /><path
          d="M536.003668 739.718267L229.640723 996.814588a20.083916 20.083916 0 0 1-28.29502-2.441139L4.723052 760.024105a20.083916 20.083916 0 0 1 9.986478-32.289611 114.955455 114.955455 0 0 0 43.60762-22.857938 116.065063 116.065063 0 0 0 14.424912-163.334391 116.508907 116.508907 0 0 0-18.419504-17.531817 20.083916 20.083916 0 0 1-0.665765-31.290963l70.127266-58.809258a20.083916 20.083916 0 0 1 25.853881 30.736159l-52.484488 44.384346q3.328826 3.439787 6.324769 7.101495a156.232896 156.232896 0 0 1-19.30719 219.480588 154.457522 154.457522 0 0 1-30.625199 20.083917l165.66457 197.399376 291.272267-244.1139a20.083916 20.083916 0 0 1 25.853881 30.736159zM956.101497 387.195604L605.243246 681.685736a20.083916 20.083916 0 1 1-25.853881-30.73616l335.545652-281.618672L645.633001 48.432087l-454.939541 381.59441a20.083916 20.083916 0 0 1-25.520999-30.514238L635.20268 4.713507a20.083916 20.083916 0 0 1 28.29502 2.441139l295.155897 351.745937a20.083916 20.083916 0 0 1-2.5521 28.295021z"
          fill="#4E3D3A"
        /><path
          d="M399.521805 534.662591l-198.287063 166.441296a20.083916 20.083916 0 0 1-25.853881-30.736159l198.287063-166.441296A20.083916 20.083916 0 1 1 399.521805 534.662591zM577.059187 555.634195L284.899233 800.968664a20.083916 20.083916 0 1 1-25.853881-30.736159L551.316267 524.898035A20.083916 20.083916 0 1 1 577.059187 555.634195zM606.907659 126.770457a20.083916 20.083916 0 0 1-28.29502-2.441139l-22.192173-26.852529a20.083916 20.083916 0 1 1 30.73616-25.853882l22.192172 26.852529a20.083916 20.083916 0 0 1-2.441139 28.295021zM806.859136 365.114392a20.083916 20.083916 0 0 1-28.295021-2.441139l-50.043349-59.585984A20.083916 20.083916 0 1 1 759.367886 277.455309l50.04335 59.585984a20.083916 20.083916 0 0 1-2.5521 28.073099z m-99.864778-119.171968a20.083916 20.083916 0 0 1-28.29502-2.441139l-50.043349-59.585984a20.083916 20.083916 0 0 1 30.736159-25.853881l50.043349 59.585984a20.083916 20.083916 0 0 1-2.552099 28.29502zM879.427541 451.552904a20.083916 20.083916 0 0 1-28.295021-2.441139l-22.192172-26.852529a20.083916 20.083916 0 1 1 30.736159-25.853881l22.192173 26.852529a20.083916 20.083916 0 0 1-2.441139 28.29502zM606.574777 443.896605a117.174672 117.174672 0 1 1-150.573892-179.756599 20.083916 20.083916 0 1 1 25.853881 30.736159A77.006839 77.006839 0 1 0 523.243168 277.455309a20.083916 20.083916 0 0 1-4.216513-39.945911A117.174672 117.174672 0 0 1 606.574777 443.896605z"
          fill="#4E3D3A"
        /><path
          d="M234.744923 527.893979a135.816097 135.816097 0 0 1-125.274815 208.606423l104.636094 287.499598L1105.232898 699.106591 948.223276 268.134597z"
          fill="#F6EB73"
        /><path
          d="M729.02644 524.272238m-81.434171 29.639614a86.660435 86.660435 0 1 0 162.868342-59.279228 86.660435 86.660435 0 1 0-162.868342 59.279228Z"
          fill="#ED7751"
        /><path
          d="M587.045665 879.307034L210.888337 1016.121779a20.083916 20.083916 0 0 1-25.74292-11.983774l-104.303212-287.499597a20.083916 20.083916 0 0 1 20.416799-26.852529 115.732181 115.732181 0 0 0 118.062359-155.345209 116.508907 116.508907 0 0 0-11.096087-22.192173 20.083916 20.083916 0 0 1 10.097439-29.626551l85.994669-31.290963A20.083916 20.083916 0 0 1 317.96557 488.28095l-64.3573 23.412743q1.886335 4.438435 3.550747 8.876869a156.232896 156.232896 0 0 1-93.318086 199.729554 154.457522 154.457522 0 0 1-35.618437 8.322065l88.102925 242.227565 356.961099-129.269406a20.083916 20.083916 0 0 1 13.759147 37.726694zM1102.347916 691.783174L671.930726 848.459914a20.083916 20.083916 0 1 1-13.759148-37.726694l411.664805-149.797166-143.361436-393.800105-557.800262 203.058381A20.083916 20.083916 0 0 1 355.13746 432.800518l576.996491-210.270836a20.083916 20.083916 0 0 1 25.74292 11.983773L1114.44265 665.818332a20.083916 20.083916 0 0 1-12.094734 25.964842z"
          fill="#4E3D3A"
        /><path
          d="M528.680251 639.85349l-243.226214 88.768691a20.083916 20.083916 0 1 1-13.759147-37.726694l243.226213-88.768691a20.083916 20.083916 0 0 1 13.759148 37.726694zM688.685816 720.411077L330.060305 850.901053a20.083916 20.083916 0 0 1-13.759147-37.726694l358.625511-130.489976a20.083916 20.083916 0 1 1 13.759147 37.726694zM863.227254 327.60962a20.083916 20.083916 0 0 1-25.74292-11.983774l-11.983773-33.288259a20.083916 20.083916 0 1 1 37.726693-13.759147l11.983774 33.288259a20.083916 20.083916 0 0 1-11.983774 25.742921zM969.638723 619.880535a20.083916 20.083916 0 0 1-25.742921-11.983774l-26.630607-73.123209a20.083916 20.083916 0 1 1 37.726694-13.204343l26.630607 73.12321a20.083916 20.083916 0 0 1-11.983773 25.188116z m-53.150254-146.135458a20.083916 20.083916 0 0 1-25.74292-11.983773L864.114941 388.416173a20.083916 20.083916 0 0 1 37.726694-13.759147l26.630607 73.123209a20.083916 20.083916 0 0 1-11.983773 25.964842zM1008.253103 725.95912a20.083916 20.083916 0 0 1-25.74292-11.983773l-11.983773-33.288259a20.083916 20.083916 0 0 1 37.726693-13.759147l11.983774 33.288259a20.083916 20.083916 0 0 1-11.983774 25.74292zM754.596569 625.206656a117.174672 117.174672 0 1 1-80.113744-220.146353A20.083916 20.083916 0 1 1 688.020051 442.786996a77.006839 77.006839 0 1 0 44.384345-2.330178 20.083916 20.083916 0 0 1 9.764556-38.947263A117.174672 117.174672 0 0 1 754.596569 625.206656z"
          fill="#4E3D3A"
        /></svg>
      </div>
      <div>
        <p>{{ t('claimTicketLink') }}</p>
        <p
          class="c-main pointer"
          @click="copyLink(claimLink)"
        >
          {{ claimLink }}<i
            class="iconfont icon-copy m-left"
            :title="t('copy')"
          /><i
            class="iconfont icon-sync m-left"
            :class="{
              loading: isRefreshing
            }"
            :title="t('refreshTicketCode')"
            @click.stop="updateCode()"
          />
        </p>
      </div>
    </div>
    <div class="info">
      <p>{{ t('ticketQuantity') }}</p>
      <input
        v-model="ticket.quantity"
        type="number"
        class="input"
        min="0"
        max="999999999"
      >
      <p>{{ t('ticketDays') }}</p>
      <input
        v-model="ticket.days"
        type="number"
        class="input"
        min="0"
        max="999999999"
      >
      <div class="flex center">
        <button
          type="submit"
          class="btn"
          @click="createEmptyTicket"
        >
          {{ t('createNoUserEmptyTicket') }}
          <Loading v-if="isCreatingEmptyTicket" />
        </button>
        <button
          type="submit"
          class="btn"
          @click="save"
        >
          {{ t('save') }}
          <Loading v-if="isSaving" />
        </button>
      </div>
    </div>
    <div
      v-if="emptyTickets.length"
      class="list"
    >
      <div
        v-for="(item, index) in emptyTickets"
        :key="item._id"
        class="item flex"
      >
        <div class="flex link-container">
          <span class="rank">{{ index + 1 }}.</span>
          <span
            class="link-content c-main pointer"
            @click="copyLink(genClaimLink(item))"
          >
            {{ genClaimLink(item) }}
          </span>
          <i
            class="iconfont icon-copy m-left c-main pointer"
            :title="t('copy')"
            @click="copyLink(genClaimLink(item))"
          />
        </div>
        <div class="m-left flex center">
          <span>
            {{ item.quantity }}
          </span>
          <span class="x"> × </span>
          <span>
            {{ item.days }}D
          </span>
          <i
            v-if="!item.isDeleting"
            class="iconfont icon-delete m-left c-danger pointer"
            @click="deleteEmptyTicket(item)"
          />
          <Loading
            v-else
            class="m-left c-danger"
          />
        </div>
      </div>
    </div>
    <div class="list">
      <div
        v-for="(item, index) in tickets"
        :key="item._id"
        class="item flex"
      >
        <div class="flex">
          <span class="rank">{{ index + 1 }}.</span>
          <Icon
            :info="toIcon({ img: { url: item.user.avatar }})"
          />
          <a
            :href="`${ONLINE_DOMAIN}/exhibition/creator/${item.user._id}`"
            class="name"
            target="_blank"
          >{{ item.user.name }}</a>
        </div>
        <div>
          <i
            v-if="item.like.isLike"
            class="iconfont icon-heart"
          />
          <span :class="{ expired: +new Date(item.expired) <= Date.now() }">
            {{ dayjs(item.expired).format('YYYY/MM/DD HH:mm') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.claim,
.list {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 2.3rem 5.2rem;
  margin-bottom: 2.2rem;
  p {
    line-height: 2.5;
  }
}
.info {
  background-color: #fff;
	border-radius: 0.4rem;
  padding: 4rem 5.2rem;
  margin-bottom: 2.2rem;
  .input {
    height: 4rem;
    width: 100%;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    margin: 0.8rem 0 2.4rem;
  }
}
.btn {
  margin: 0 0.8rem;
  .loading {
    margin-left: 0.8rem;
  }
}

.list {
  .icon {
    margin-right: 0.8rem;
    :deep(img) {
      height: 2rem;
      background: var(--color-bg);
      border-radius: 1rem;
    }
  }
  .item {
    margin-bottom: 1.6rem;
    position: relative;
    .icon-heart {
      color: var(--color-danger);
      margin-right: 0.8rem;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &:hover::after {
      content: "";
      position: absolute;
      width: 100%;
      bottom: -0.8rem;
      height: 2px;
      background-color: var(--color-bg);
    }
    .expired {
      text-decoration: line-through;
    }
    .rank {
      font-size: 1rem;
      color: var(--color-main);
      margin-right: 0.8rem;
    }
    .link-container {
      justify-content: start;
    }
    .link-content {
      word-break: break-all;
      font-size: 1.2rem;
    }
    .x {
      opacity: 0.2;
      margin: 0 0.3rem;
    }
  }
}
</style>
