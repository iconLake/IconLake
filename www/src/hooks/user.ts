import { reactive, onMounted } from 'vue'
import { userApis, type UserInfo } from '@/apis/user'

const userInfo = reactive<UserInfo>({
  _id: '',
  tokenExpire: new Date(),
})

let isLoading = false

export function useUser() {
  const fetchUserInfo = async () => {
    isLoading = true
    await userApis.info().onUpdate(async info => {
      Object.assign(userInfo, info)
    })
    isLoading = false
  }

  const refreshUserInfo = async () => {
    await fetchUserInfo()
  }

  const hasBlockchainAccount = () => {
    return !!userInfo?.blockchain?.id
  }

  const getUserInfo = async () => {
    if (!userInfo._id) {
      await fetchUserInfo()
    }
    return userInfo
  }

  onMounted(() => {
    !userInfo._id && !isLoading && fetchUserInfo()
  })

  return {
    userInfo,
    getUserInfo,
    fetchUserInfo,
    refreshUserInfo,
    hasBlockchainAccount
  }
}
