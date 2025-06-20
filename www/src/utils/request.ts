import i18n from '@/i18n'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { isPagePublic, toast } from './index'
import { clearCache } from './cache'
import Cookies from 'js-cookie'

function showErrorMsg (res: any) {
  const redirectError = {
    tokenExpired: true,
    userNotLogin: true
  }
  if (res.error in redirectError) {
    if (!isPagePublic()) {
      clearCache().finally(() => {
        location.href = `/login?referer=${encodeURIComponent(location.href.replace(location.origin, ''))}`
      })
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

export default function q<T>(options: AxiosRequestConfig) {
  return new Promise<T>((resolve, reject) => {
    axiosInstance(options).then(res => {
      handleResponse<T>(res, resolve, reject)
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
