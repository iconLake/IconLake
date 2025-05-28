import type { Icon } from './project'

interface PingResult {
  timestamp: number
  search?: {
    sites: string[]
  }
  isDesktop?: boolean
}

let isExtensionReady = false
let pingResult: PingResult | undefined

const IconlakeRequestMsgTypePrefix = 'iconlakeRequest:'
const IconlakeResponseMsgTypePrefix = 'iconlakeResponse:'

const pingTimer = setInterval(() => {
  requestExtension({
    type: 'ping',
    ignoreReady: true,
    timeout: 200,
  }).then((res: PingResult) => {
    clearInterval(pingTimer)
    isExtensionReady = true
    pingResult = res
  }).catch(console.error)
}, 50)

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
  extra?: {
    [key: string]: string
  }
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

interface Option {
  label?: string
  value: string
  options?: OptionGroup[]
}

export interface OptionGroup {
  label?: string
  name: string
  value: string
  children: Option[]
}

export function option(params: {
  site: string
}): Promise<{
  options: OptionGroup[]
  error?: string
}> {
  return requestExtension({type: 'option', params})
}

export enum StorageMethod {
  SaveFiles = 'saveFiles',
  GetFiles = 'getFiles',
}

export interface StorageParams {
  files?: {
    key: string
    data?: string
  }[]
  keys?: string[]
}

export interface StorageResult {
  error?: string
  files?: {
    key: string
    url?: string
    data?: string
  }[]
}

export function storage(params: {
  method: StorageMethod
  params: StorageParams
}): Promise<StorageResult> {
  return requestExtension({type: 'storage', params})
}

storage.getFile = async ({key}: {key: string}) => {
  const res = await storage({
    method: StorageMethod.GetFiles,
    params: {
      keys: [key]
    },
  })
  if (!res.files || res.files?.length === 0) {
    throw new Error('get file failed')
  }
  return res.files[0]
}

storage.saveFile = async ({key, data}: {key: string, data: string}) => {
  const res = await storage({
    method: StorageMethod.SaveFiles,
    params: {
      files: [{
        key,
        data,
      }]
    },
  })
  if (!res.files || res.files?.length === 0) {
    throw new Error('upload file failed')
  }
  return res.files[0]
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
    isReady: isExtensionReady,
    search: pingResult?.search,
    isDesktop: pingResult?.isDesktop,
  }
}

export function isReady() {
  return isExtensionReady
}

export function onReady(callback: Function) {
  if (isExtensionReady) {
    callback()
  } else {
    const timer = setInterval(() => {
      if (isExtensionReady) {
        clearInterval(timer)
        callback()
      }
    }, 50)
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

export function buildTheme(params: {
  codes: string
  type: string
}): Promise<{
  codes?: string
  error?: string
}> {
  return requestExtension({type: 'buildTheme', params})
}

export const extensionApis = {
  search,
  detail,
  option,
  getExtensionInfo,
  storage,
  isReady,
  onReady,
  buildTheme,
}
