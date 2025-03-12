import { handleSearchMsg } from './msg/search'
import { ResponseMsgType } from './types'

interface Msg {
  type: ResponseMsgType
  data: any
}

const handler = {
  [ResponseMsgType.GetSvgs]: async () => {
    const svgDoms = document.querySelectorAll('svg')
    const iconsSet = new Set()
    const icons = Array.from(svgDoms).map(e => {
      return {
        svg: {
          viewBox: e.getAttribute('viewBox'),
          path: e.innerHTML
        },
        name: (e.getAttribute('title') ?? e.parentElement?.getAttribute('title')) ?? ''
      }
    }).filter(e => {
      if (iconsSet.has(e.svg.path)) {
        return false
      }
      iconsSet.add(e.svg.path)
      return true
    })
    return {
      icons,
      url: location.href
    }
  },
  [ResponseMsgType.GetImgs]: async () => {
    const imgDoms = document.querySelectorAll('img')
    const icons = Array.from(imgDoms).map(e => {
      return {
        img: {
          url: e.src,
          width: e.width || e.naturalWidth || 0,
          height: e.height || e.naturalHeight || 0,
        },
        name: (e.getAttribute('alt') ?? e.getAttribute('title')) ?? ''
      }
    })
    return {
      icons,
      url: location.href
    }
  },
  [ResponseMsgType.Search]: handleSearchMsg,
}

export function initMsg() {
  browser.runtime.onMessage.addListener(async (msg: Msg) => {
    if (typeof msg.type !== 'string' || !(msg.type in handler)) {
      throw new Error('Message Type is unknown.')
    }
    return await handler[msg.type](msg.data)
  })
}
