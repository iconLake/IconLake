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
(async () => {
  const items = document.querySelectorAll('article');
  const imgs = []
  await Promise.all(Array.from(items).map(async e => {
    const multiImgs = new Map()
    const img = e.querySelector('div>img');
    const link = e.querySelector('a[href*="/p/"]')?.href;
    if (img && link) {
      const title = e.querySelector('span>div>span')?.innerText
      multiImgs.set(img.src, { src: img.src, link, title })
      const slide = e.querySelector('[role="presentation"]')
      if (slide) {
        let btns
        let run = true
        let n = 0
        while (run && n < 10) {
          btns = slide.parentElement.querySelectorAll('button')
          btns[btns.length - 1].click()
          await new Promise((resolve) => setTimeout(resolve, 100))
          const imgs = slide.querySelectorAll('img')
          Array.from(imgs).forEach((e) => {
            multiImgs.set(e.src, { src: e.src, link, title })
          })
          if (btns.length === 1) {
            run = false
          }
          ++n
        }
      }
      imgs.push(...Array.from(multiImgs.values()))
    }
  }));
  return imgs
})()
`

const getImgsScriptForSearch = `
(() => {
  const items = document.querySelectorAll('a[href*="/p/"]');
  return Array.from(items).map(e => {
    const img = e.querySelector('img')
    return { src: img?.src, link: e.href, title: img?.alt }
  });
})()
`

const notLoginScript = `
(() => {
  const login = document.querySelector('[name="username"]');
  return !!login;
})()
`

interface OriginalImgInfo {
  src: string
  link: string
  title: string
}

async function getImgs({ win, isSearch }: {
  win: WebContentsView
  isSearch?: boolean
}) {
  const imgs: OriginalImgInfo[] = await win.webContents
    .executeJavaScript(isSearch ? getImgsScriptForSearch : getImgsScript, true)
    .catch((err) => {
      console.error('Failed to execute JavaScript to get images', err)
      return [] as OriginalImgInfo[]
    })

  return imgs
}

async function scrollToBottom({ win }: { win: WebContentsView }) {
  await win.webContents.executeJavaScript('window.scrollTo(0, window.pageYOffset + window.innerHeight * 2)')
}

export async function handleInstagram(params: SearchParams): Promise<SearchResult | SearchError> {
  const url = params.keywords ? `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(params.keywords)}` : 'https://www.instagram.com/'
  const win = await createSubWindow({
    url,
    id: 'search:instagram',
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
        isSearch: !!params.keywords,
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
          referer: 'https://www.instagram.com',
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

export async function handleInstagramDetail(params: DetailParams): Promise<DetailResult | SearchError> {
  const win = await createSubWindow({
    url: params.url,
    id: 'detail',
  })
  win.webContents.scrollToTop()
  win.setVisible(true)
  win.webContents.loadURL(params.url)
  win.setVisible(false)
  return {
    imgs: [],
    html: '',
  }
}

export async function handleInstagramOptions(): Promise<OptionResult> {
  return {
    options: []
  }
}
