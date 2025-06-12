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

enum TweetType {
  Recommend = 'recommend',
  Follow = 'follow',
}

const getImgsScript = ({ type }: { type?: TweetType }) => {
  let prepare = ''
  if (type) {
    prepare += `
if (!document.querySelector('[data-testid="ScrollSnap-List"]')) {
    return []
}
`
    let index = 0
    switch (type) {
      case TweetType.Recommend:
        index = 1
        break
      case TweetType.Follow:
        index = 2
        break
    }
    prepare += `
const tabDom = document.querySelector('[data-testid="ScrollSnap-List"]>div:nth-child(${index})>a');
if (tabDom.getAttribute('aria-selected') !== 'true') {
  tabDom.click();
}
`
  }
  return `
(() => {
  ${prepare}
  const items = document.querySelectorAll('[data-testid="tweet"]');
  const imgs = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const link = item.querySelector('a[href*="/status/"]').href;
    const title = item.querySelector('[data-testid="tweetText"]')?.innerText;
    const imgDoms = item.querySelectorAll('[data-testid="tweetPhoto"] img');
    for (let j = 0; j < imgDoms.length; j++) {
      const img = imgDoms[j];
      imgs.push({
        src: img.src,
        link,
        title,
      });
    }
  }
  return imgs;
})()
`
}

const getDetailScript = `
(() => {
  const item = document.querySelector('[data-testid="tweet"]');
  const title = item.querySelector('[data-testid="tweetText"]')?.innerText;
  const imgs = item.querySelectorAll('[data-testid="tweetPhoto"] img');
  return Array.from(imgs).map(e => ({ url: e.src.replace(/&name=[^&]*/, '&name=large'), title }));
  })()
`

const notLoginScript = `
(() => {
  const login = document.querySelector('[data-testid="google_sign_in_container"]');
  return !!login;
})()
`

interface OriginalImgInfo {
  src: string
  link: string
  title: string
}

async function getImgs({ type, win }: {
  type?: TweetType
  win: WebContentsView
}) {
  const imgs: OriginalImgInfo[] = await win.webContents
    .executeJavaScript(getImgsScript({ type }), true)
    .catch((err) => {
      console.error('Failed to execute JavaScript to get images', err)
      return [] as OriginalImgInfo[]
    })
  return imgs
}

async function scrollToBottom({ win }: { win: WebContentsView }) {
  await win.webContents.executeJavaScript('window.scrollTo(0, window.pageYOffset + window.innerHeight * 2)')
}

export async function handleX(params: SearchParams): Promise<SearchResult | SearchError> {
  let url = `https://x.com/search?q=${encodeURIComponent(params.keywords)}&src=typed_query&f=top`
  if (!params.keywords) {
    url = 'https://x.com/home'
  }
  const win = await createSubWindow({
    url,
    id: 'search:x',
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
        type: params.keywords ? undefined : ((params.extra?.type || TweetType.Recommend) as TweetType),
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
          referer: 'https://www.x.com',
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

export async function handleXDetail(params: DetailParams): Promise<DetailResult | SearchError> {
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

export async function handleXOptions(): Promise<OptionResult> {
  return {
    options: [
      {
        label: '类型',
        name: 'type',
        value: 'recommend',
        children: [
          {
            label: '推荐',
            value: 'recommend'
          }, {
            label: '关注',
            value: 'follow'
          }
        ]
      }
    ]
  }
}
