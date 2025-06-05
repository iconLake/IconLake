import { session } from "electron"
import { getRequestReferers, setRequestReferer } from "./store"

const Domains = ['iconlake.com', '127.0.0.1', 'localhost']

async function getRequestRefererFromStorage(): Promise<{
  [key: string]: string
}> {
  const requestReferers = getRequestReferers()
  return {
    'https://huaban.com': 'https://huaban.com',
    'https://www.iconfont.cn': 'https://www.iconfont.cn',
    'https://www.zcool.com.cn': 'https://www.zcool.com.cn',
    ...(requestReferers || {})
  }
}

async function saveRequestReferersToStorage(requestReferers: { [key: string]: string }): Promise<void> {
  Object.keys(requestReferers).forEach(key => {
    setRequestReferer(key, requestReferers[key])
  })
}

export async function handleModifyRequestReferer(params: Array<{
  url: string
  referer: string
}>) {
  const requestReferers = await getRequestRefererFromStorage()
  const newReferers: { [key: string]: string } = {}
  params.forEach(({ url, referer }) => {
    const origin = new URL(url).origin
    if (!requestReferers[origin]) {
      newReferers[origin] = referer
    }
  })
  await saveRequestReferersToStorage(newReferers)
}

export async function modifyHeaders(details: Electron.OnBeforeSendHeadersListenerDetails): Promise<Electron.OnBeforeSendHeadersListenerDetails['requestHeaders']> {
  const { requestHeaders, referrer, url } = details
  if (!referrer) {
    return requestHeaders
  }
  const domain = new URL(referrer).hostname
  if (!Domains.includes(domain)) {
    return requestHeaders
  }
  const requestReferers = await getRequestRefererFromStorage()
  console.log('modifyHeaders', referrer, requestReferers)
  const origin = new URL(url).origin
  if (requestReferers[origin]) {
    requestHeaders.referer = requestReferers[origin]
    requestHeaders.origin = requestReferers[origin]
  }
  return requestHeaders
}

export async function initRequestHandler() {
  session.defaultSession.webRequest.onBeforeSendHeaders(async (details, callback) => {
    if (details.referrer === 'about:blank' || !details.referrer) {
      callback({ cancel: false })
      return
    }
    const domain = new URL(details.referrer).hostname
    if (Domains.includes(domain)) {
      console.log('onBeforeSendHeaders', details.url, details.referrer, details.requestHeaders)
    }
    callback({ cancel: false, requestHeaders: await modifyHeaders(details) })
  })
}
