import Browser from 'webextension-polyfill'
import { initModifyRequest, handleModifyRequestReferer } from './background/modify-request'
import { handleSearch, initSearch } from './background/search'
import { MsgType } from './background/types'

if (import.meta.env.DEV) {
  const ws = new WebSocket('ws://127.0.0.1:35729')

  const reload = async (): Promise<void> => {
    const tabs = await Browser.tabs.query({
      active: true,
      lastFocusedWindow: true
    })
    if (tabs.length > 0) {
      Browser.tabs.reload(tabs[0].id).catch(console.error)
    }
    Browser.runtime.reload()
  }

  let timer: string | number | NodeJS.Timeout | undefined

  ws.onmessage = async event => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      void reload()
    }, 1000)
  }
}

initModifyRequest()
initSearch()

Browser.runtime.onMessage.addListener(async (message, sender) => {
  const type = (message.type as MsgType).toString().toLowerCase()
  const params: any[] = message.params instanceof Array ? message.params : [message.params]

  let result

  console.log('receive message', type, params)
  switch (type) {
    case MsgType.ModifyRequestReferer.toString().toLowerCase():
      result = await handleModifyRequestReferer(params[0])
      break
    case MsgType.Search.toString().toLowerCase():
      result = await handleSearch(params[0])
      break
    case MsgType.Ping.toString().toLowerCase():
      result = { timestamp: Date.now() }
      break
    default:
      result = {
        error: 'unknown message type'
      }
  }

  console.log('send message', result)
  return result
});
