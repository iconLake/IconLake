import { WebContentsView } from "electron"
import { createSubWindow, createWindow, retry } from "../../../utils"
import { handleModifyRequestReferer } from "../../modify-request"
import { DetailParams, DetailResult, Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"

let loadedImgs: {
  [key: string]: {
    src: string
    link: string
  }
} = {}

const getImgsScript = `
(() => {
  const items = document.querySelectorAll('[data-test-id="pinWrapper"]');
  return Array.from(items).map(e => {
    const img = e.querySelector('img');
    return { src: img.src, link: e.querySelector('a[href*="/pin/"]').href, title: '' }
  });
})()
`

const getDetailScript = `
(() => {
  const img = document.querySelector('[data-test-id="closeup-image-main"] img');
  const title = document.querySelector('[data-test-id="closeup-title"]');
  return [{ src: img.src, link: window.location.href, title: title?.innerText }];
})()
`

const notLoginScript = `
(() => {
  const login = document.querySelector('[data-test-id="registerForm"]');
  return !!login;
})()
`

interface OriginalImgInfo {
  src: string
  link: string
  title: string
}

async function getImgs({ win }: {
  win: WebContentsView
}) {
  const imgs: OriginalImgInfo[] = await win.webContents
    .executeJavaScript(getImgsScript, true)
    .catch((err) => {
      console.error('Failed to execute JavaScript to get images', err)
      return [] as OriginalImgInfo[]
    })
  return imgs
}

async function scrollToBottom({ win }: { win: WebContentsView }) {
  await win.webContents.executeJavaScript('window.scrollTo(0, window.pageYOffset + window.innerHeight * 2)')
}

export async function handlePinterest(params: SearchParams): Promise<SearchResult | SearchError> {
  const url = params.keywords ? `https://www.pinterest.com/search/pins/?q=${params.keywords}` : 'https://www.pinterest.com/'
  const win = await createSubWindow({
    url,
    id: 'search:pinterest',
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
    const stackedImgs: { [key: string]: OriginalImgInfo } = {}
    const res = await retry(async () => {
      const tmpImgs = (await getImgs({
        win,
      })).filter((e) => !stackedImgs[e.src] && !loadedImgs[e.src])
      const imgs = [...Object.values(stackedImgs), ...tmpImgs]
      tmpImgs.forEach((e) => {
        stackedImgs[e.src] = e
      })
      if (!imgs.length || imgs.length < 15) {
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
        await scrollToBottom({ win })
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
        await scrollToBottom({ win })
        throw new Error('No new images')
      }
      return newImgs
    }).catch((err) => {
      console.error('Failed to get images', err)
      reject(err)
    })
    if (res && res.length) {
      resolve(res.map((e) => {
        return {
          mimeType: 'image/jpeg',
          img: {
            url: e.src,
          },
          name: e.title,
          code: e.link,
          referer: 'https://www.pinterest.com',
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

export async function handlePinterestDetail(params: DetailParams): Promise<DetailResult | SearchError> {
  const win = await createSubWindow({
    url: params.url,
    id: 'detail',
  })
  win.webContents.scrollToTop()
  win.setVisible(true)
  await win.webContents.loadURL(params.url)
  const imgs = await retry(async () => {
    const res = await win.webContents.executeJavaScript(getDetailScript, true)
    if (!res || res.length === 0) {
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

export async function handlePinterestOptions(): Promise<OptionResult> {
  return {
    options: []
  }
}
