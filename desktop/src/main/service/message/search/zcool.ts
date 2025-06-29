import { BrowserWindow, WebContentsView } from "electron"
import { createSubWindow, createWindow, retry } from "../../../utils"
import { handleModifyRequestReferer } from "../../modify-request"
import { DetailParams, DetailResult, Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"
import { log } from "../../../utils/log"

let loadedImgs: {
  [key: string]: {
    src: string
    link: string
  }
} = {}

const getImgsScript = `
(() => {
  const imgs = document.querySelectorAll(".cover-img");
  return Array.from(imgs).map(e => ({ src: e.src, link: e.parentNode.href, title: e.alt }));
})()
`

const getDetailScript = `
(() => {
  const imgs = document.querySelectorAll("#newContent img");
  return Array.from(imgs).map(e => ({ url: e.dataset.src, title: e.alt }));
  })()
`

const notLoginScript = `
(() => {
  const login = document.querySelector('.emptyBtn');
  return login && login.innerText === '去登录';
})()
`

interface OriginalImgInfo {
  src: string
  link: string
  title: string
}

async function getImgs({ win }: { win: WebContentsView }) {
  const imgs: OriginalImgInfo[] = await win.webContents
    .executeJavaScript(getImgsScript, true)
    .catch((err) => {
      log.error('Failed to execute JavaScript to get images', err)
      return [] as OriginalImgInfo[]
    })
  return imgs
}

export async function handleZcool(params: SearchParams): Promise<SearchResult | SearchError> {
  let url = `https://www.zcool.com.cn/search/content?word=${encodeURIComponent(params.keywords)}&recommendLevel=1`
  if (!params.keywords) {
    url = `https://www.zcool.com.cn/${params.extra?.type || 'focus'}`
  }
  const win = await createSubWindow({
    url,
    id: 'search:zcool',
  })
  win.setVisible(true)
  if (url !== win.webContents.getURL() || params.page === 1) {
    win.webContents.scrollToTop()
    await win.webContents.loadURL(url)
  }
  if (params.page === 1) {
    loadedImgs = {}
  }
  const list: Media[] = await new Promise(async (resolve, reject) => {
    const res = await retry(async () => {
      const imgs = await getImgs({ win })
      if (!imgs.length) {
        if (await win.webContents.executeJavaScript(notLoginScript, true)) {
          createWindow({
            url,
            width: 1366,
            height: 768,
          })
          win.setVisible(false)
          reject(new Error('Unauthorized'))
          return
        }
        win.webContents.scrollToBottom()
        throw new Error('No images')
      }
      const newImgs = imgs.filter((e) => {
        if (loadedImgs[e.src]) {
          return false
        }
        loadedImgs[e.src] = e
        return true
      })
      if (newImgs.length === 0) {
        win.webContents.scrollToBottom()
        throw new Error('No new images')
      }
      return newImgs
    }).catch((err) => {
      log.error('Failed to get images', err)
      reject(err)
    })
    if (res && res.length) {
      resolve(res.map((e) => {
        return {
          mimeType: 'image/webp',
          img: {
            url: e.src,
          },
          name: e.title,
          code: e.link,
          referer: 'https://www.zcool.com.cn',
        }
      }))
    }
  })

  await handleModifyRequestReferer(list.map((e) => {
    return {
      url: e.img!.url,
      referer: e.referer,
    }
  }))
  win.setVisible(false)
  return {
    list,
    total: 0,
    page: params.page,
  }
}

export async function handleZoolDetail(params: DetailParams): Promise<DetailResult|SearchError> {
  const win = await createSubWindow({
    url: params.url,
    id: 'detail',
  })
  win.webContents.scrollToTop()
  win.setVisible(true)
  win.webContents.loadURL(params.url)
  const imgs = await retry(async () => {
    const res = await win.webContents.executeJavaScript(getDetailScript, true)
    if (!res) {
      throw new Error('Failed to get detail')
    }
    return res
  })
  win.setVisible(false)
  return {
    imgs,
    html: '',
  }
}

export async function handleZcoolOptions(): Promise<OptionResult> {
  return {
    options: [
      {
        label: '类型',
        name: 'type',
        value: 'focus',
        children: [
          {
            label: '关注',
            value: 'focus'
          }, {
            label: '首推',
            value: 'recommend'
          }, {
            label: '推荐',
            value: 'home'
          }
        ]
      }
    ]
  }
}
