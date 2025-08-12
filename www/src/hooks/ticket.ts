import { projectApis, type IProjectTicket } from '@/apis/project'
import { userApis } from '@/apis/user'
import { ref } from 'vue'

function genPasskey() {
  const len = 32
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = chars.length
  const nums = []
  for (let i = 0; i < len; i++) {
    nums.push(chars.charAt(Math.floor(Math.random() * maxPos)))
  }
  return nums.join('')
}

export function useTicket() {
  const passkey = ref(genPasskey())

  const refreshPasskey = () => {
    passkey.value = genPasskey()
  }

  const setTicketPasskey = async (data: {
    _id: string
    passkey: string
  }) => {
    const passkey = data.passkey
    await userApis.setTicketPasskey(data)
    setTimeout(() => refreshPasskey(), 100)
    return {
      passkey
    }
  }

  const getTicket = async ({ projectId }: {
    projectId: string
  }, callback: (ticket: IProjectTicket) => Promise<void>) => {
    await projectApis.getTicket({
      projectId
    }).onUpdate(callback)
  }

  return {
    passkey,
    refreshPasskey,
    setTicketPasskey,
    getTicket,
  }
}
