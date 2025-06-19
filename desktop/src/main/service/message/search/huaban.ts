import { WebContentsView } from "electron"
import { createSubWindow, createWindow, retry } from "../../../utils"
import { handleModifyRequestReferer } from "../../modify-request"
import { Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"
import { log } from "../../../utils/log"

let loadedImgs: {
  [key: string]: {
    src: string
    link: string
  }
} = {}

const getImgsScript = `
(() => {
  const imgs = document.querySelectorAll(".hb-image.transparent-img-bg");
  return Array.from(imgs).map(e => ({ src: e.src, link: e.parentNode.href, title: e.nextElementSibling.innerText }));
})()
`

const notLoginScript = `
(() => {
  const login = document.querySelector('[data-button-name="登陆注册"]');
  return !!login;
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

export async function handleHuaban(params: SearchParams): Promise<SearchResult | SearchError> {
  let url = `https://huaban.com/search?q=${encodeURIComponent(params.keywords)}`
  if (!params.keywords) {
    if (params.extra?.type === 'discovery') {
      url = 'https://huaban.com/discovery'
    } else {
      url = 'https://huaban.com/follow'
    }
  }
  const win = await createSubWindow({
    url,
    id: 'search:huaban',
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
            originalUrl: e.src.replace('_fw240webp', '_fw1200webp').replace('_fw480webp', '_fw1200webp'),
          },
          name: e.title,
          code: e.link,
          referer: 'https://huaban.com',
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

export async function handleHuabanOptions(): Promise<OptionResult> {
  return {
    options: [
      {
        label: '类型',
        name: 'type',
        value: 'follow',
        children: [
          {
            label: '关注',
            value: 'follow'
          }, {
            label: '发现',
            value: 'discovery'
          }
        ]
      }
    ]
  }
}
