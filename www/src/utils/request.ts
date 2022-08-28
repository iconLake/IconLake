import i18n from '@/i18n'
import axios, { AxiosRequestConfig } from 'axios'
import { toast } from './index'

function showErrorMsg (res: any) {
  console.error(res)
  if (typeof res.error === 'string') {
    toast.error(i18n.global.t(res.error))
  }
  const redirectError = {
    tokenExpired: true,
    userNotLogin: true
  }
  if (res.error in redirectError) {
    location.href = `/login?referer=${encodeURIComponent(location.href.replace(location.origin, ''))}`
  }
}

export default function q(options: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    axios(options).then(res => {
      if (res.status === 200 && !res.data.error) {
        resolve(res.data)
      } else if (res.data.error) {
        showErrorMsg(res.data)
        reject(res.data)
      } else {
        showErrorMsg(res)
        reject(res)
      }
    }).catch(err => {
      showErrorMsg(err)
      reject(err)
    })
  })
}
