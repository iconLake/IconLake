import { Icon } from './project'

let isExtensionReady = false

const IconlakeRequestMsgTypePrefix = 'iconlakeRequest:'
const IconlakeResponseMsgTypePrefix = 'iconlakeResponse:'

const pingTimer = setInterval(() => {
  requestExtension({
    type: 'ping',
    ignoreReady: true,
    timeout: 200,
  }).then(() => {
    clearInterval(pingTimer)
    isExtensionReady = true
  }).catch(console.error)
}, 200)

export async function requestExtension({type, params, timeout = 300000, ignoreReady}: {
  type: string
  params?: any
  timeout?: number
  ignoreReady?: boolean
}): Promise<any> {
  if (!isExtensionReady && !ignoreReady) {
    await new Promise(resolve => {
      const timer = setInterval(() => {
        if (isExtensionReady) {
          clearInterval(timer)
          resolve(null)
        }
      }, 100)
    })
  }
  const id = `${Date.now()}:${Math.random().toString().slice(2)}`
  window.postMessage({
    type: IconlakeRequestMsgTypePrefix + type,
    id,
    params,
  })
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      window.removeEventListener('message', listener)
      reject(new Error('timeout'))
    }, timeout)
    const listener = (e: MessageEvent) => {
      if (e.data.type === IconlakeResponseMsgTypePrefix + type && e.data.id === id) {
        clearTimeout(timer)
        window.removeEventListener('message', listener)
        if (e.data.error) {
          reject(e.data.error)
        } else {
          resolve(e.data.response)
        }
      }
    }
    window.addEventListener('message', listener)
  })
}

export function search(params: {
  site: string
  keywords: string
  page: number
}): Promise<{
  list: SearchedIcon[]
  total: number
  page: number
  error?: string
}> {
  return requestExtension({type: 'search', params})
}

export function detail(params: {
  site: string
  url: string
}): Promise<{
  imgs: {
    url: string
  }[]
  html?: string
  error?: string
}> {
  return requestExtension({type: 'detail', params})
}

export async function getExtensionInfo() {
  await new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (isExtensionReady) {
        clearInterval(timer)
        clearTimeout(timeout)
        resolve(null)
      }
    }, 50)
    const timeout = setTimeout(() => {
      clearInterval(timer)
      reject(new Error('timeout'))
    }, 3000)
  })
  return {
    isReady: isExtensionReady
  }
}

export interface SearchedIcon extends Icon {
  img?: {
    url: string
    originalUrl?: string
  }
  imgs?: {
    url: string
    originalUrl?: string
  }[]
  html?: string
}

export const extensionApis = {
  search,
  detail,
  getExtensionInfo,
}
