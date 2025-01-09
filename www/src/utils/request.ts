import i18n from '@/i18n'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { isPagePublic, toast } from './index'
import { clearCache } from './cache'

function showErrorMsg (res: any) {
  const redirectError = {
    tokenExpired: true,
    userNotLogin: true
  }
  if (res.error in redirectError) {
    if (!isPagePublic()) {
      clearCache()
      location.href = `/login?referer=${encodeURIComponent(location.href.replace(location.origin, ''))}`
    }
    return
  }
  if (typeof res.error === 'string') {
    toast.error(i18n.global.t(res.error))
  }
}

const axiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

export default function q(options: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    axiosInstance(options).then(res => {
      handleResponse(res, resolve, reject)
    }).catch(err => {
      showErrorMsg(err)
      reject(err)
    })
  })
}

export function handleResponse<T>(res: AxiosResponse, resolve: (value: T) => void, reject: (reason?: any) => void) {
  if (res.status === 200 && !res.data.error) {
    resolve(res.data)
  } else if (res.data.error) {
    showErrorMsg(res.data)
    reject(res.data)
  } else {
    showErrorMsg(res)
    reject(res)
  }
}
