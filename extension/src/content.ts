import { Msg, MsgType } from './types'

const handler = {
  [MsgType.GetIcons]: async () => {
    const svgDoms = document.querySelectorAll('svg')
    const icons = Array.from(svgDoms).map(e => {
      return {
        svg: `<svg viewBox="${e.getAttribute('viewBox')}">${e.innerHTML}</svg>`,
        name: (e.getAttribute('title') ?? e.parentElement?.getAttribute('title')) ?? ''
      }
    })
    return {
      icons,
      url: location.href
    }
  }
}

browser.runtime.onMessage.addListener(async (msg: Msg) => {
  if (typeof msg.type !== 'string' || !(msg.type in handler)) {
    throw new Error('Message Type is unknown.')
  }
  return await handler[msg.type]()
})

export {}
