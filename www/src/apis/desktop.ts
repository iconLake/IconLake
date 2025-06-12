import request from '@/utils/request'
import { extensionApis, type PingResult } from './extension'

const domain = 'https://localhost.iconlake.com'

declare global {
  interface Window {
    iconlake?: {
      isDesktop?: boolean
    }
  }
}

async function isDesktop() {
  if (window.iconlake?.isDesktop) {
    return true
  }
  const info = await extensionApis.getExtensionInfo()
  return info?.isDesktop
}

let port = 0

function baseUrl(p?: number) {
  return `${domain}:${p || port}/desktop/api`
}

async function ping() {
  let p = 19090
  while (true) {
    const res = await request({
      url: '/ping',
      method: 'GET',
      baseURL: baseUrl(p),
    }).catch(() => false)
    if (res) {
      port = p
      return res as PingResult
    }
    p += 1
    if (p > 19100) {
      throw new Error('ping failed')
    }
  }
}

async function isReady() {
  if (port) {
    return true
  }
  const res = await ping().catch(() => false)
  if (res) {
    return true
  }
  return false
}

async function buildTheme(data: { codes: string; type: string }): Promise<{ codes?: string; error?: string }> {
  return request({
    url: '/theme/build',
    method: 'POST',
    baseURL: baseUrl(),
    data,
  })
}

export const desktopApis = {
  isDesktop,
  ping,
  isReady,
  buildTheme,
}
