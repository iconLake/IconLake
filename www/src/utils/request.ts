import i18n from '@/i18n'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { isPagePublic, toast } from './index'

function showErrorMsg (res: any) {
  const redirectError = {
    tokenExpired: true,
    userNotLogin: true
  }
  if (res.error in redirectError) {
    if (!isPagePublic()) {
      location.href = `/login?referer=${encodeURIComponent(location.href.replace(location.origin, ''))}`
    }
    return
  }
  if (typeof res.error === 'string') {
    toast.error(i18n.global.t(res.error))
  }
}

export default function q(options: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    axios(options).then(res => {
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
