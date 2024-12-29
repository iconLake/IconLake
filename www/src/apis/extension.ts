let isExtensionReady = false

const IconlakeRequestMsgTypePrefix = 'iconlakeRequest:'
const IconlakeResponseMsgTypePrefix = 'iconlakeResponse:'

requestExtension({
  type: 'ping',
  ignoreReady: true
}).then(res => {
  isExtensionReady = true
}).catch(console.error)

export async function requestExtension({type, params, timeout = 300000, ignoreReady}: {
  type: string
  params?: any
  timeout?: number
  ignoreReady?: boolean
}) {
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
        if (e.data.response && e.data.response.error) {
          reject(e.data.response.error)
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
}): Promise<any> {
  return requestExtension({type: 'search', params})
}

export const extensionApis = {
  search,
}
