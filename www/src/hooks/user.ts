import { reactive, onMounted, ref, watch } from 'vue'
import { userApis, type UserInfo } from '@/apis/user'

const userInfo = reactive<UserInfo>({
  _id: '',
  tokenExpire: new Date(),
})

let isLoading = ref(false)

export function useUser() {
  const fetchUserInfo = async () => {
    if (isLoading.value) {
      await new Promise(resolve => {
        const unwatch = watch(isLoading, () => {
          if (!isLoading.value) {
            unwatch()
            resolve(true)
          }
        }, {
          immediate: true
        })
      })
      return
    }
    isLoading.value = true
    await userApis.info().onUpdate(async info => {
      Object.assign(userInfo, info)
    })
    isLoading.value = false
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
    !userInfo._id && fetchUserInfo()
  })

  return {
    userInfo,
    getUserInfo,
    fetchUserInfo,
    refreshUserInfo,
    hasBlockchainAccount
  }
}
