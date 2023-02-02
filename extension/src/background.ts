import Browser from 'webextension-polyfill'

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
