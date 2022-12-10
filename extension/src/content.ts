enum MsgType {
  GetIcons = 'getIcons'
}

interface Msg {
  type: MsgType
  data: any
}

const handler = {
  [MsgType.GetIcons]: async () => {
    const svgDoms = document.querySelectorAll('svg')
    const icons = Array.from(svgDoms).map(e => {
      return {
        svg: {
          viewBox: e.getAttribute('viewBox'),
          path: e.innerHTML
        },
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
