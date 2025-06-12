import { WebContentsView } from "electron"
import { createSubWindow, retry } from "../../../utils"
import { Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"

const getImgsScript = `
(() => {
  const imgs = document.querySelectorAll(".icon-twrap");
  return Array.from(imgs).map(e => ({ src: e.innerHTML.replace(/ class="icon" style=".*?"/, '').replace(/ p-id=".*?"/, ''), link: location.href, title: e.nextElementSibling.title }));
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
      console.error('Failed to execute JavaScript to get images', err)
      return [] as OriginalImgInfo[]
    })
  return imgs
}

export async function handleIconfont(params: SearchParams): Promise<SearchResult | SearchError> {
  let url = `https://www.iconfont.cn/search/index?searchType=icon&q=${encodeURIComponent(params.keywords) || 'icon'}&page=${params.page || 1}`
  if (params.extra) {
    if (params.extra.tag) {
      url += `&tag=${params.extra.tag}`
    }
  }
  const win = await createSubWindow({
    url,
    id: 'search:iconfont',
  })
  win.setVisible(true)
  await win.webContents.loadURL(url)
  const list: Media[] = await new Promise(async (resolve, reject) => {
    const res = await retry(async () => {
      const imgs = await getImgs({ win })
      if (!imgs.length) {
        throw new Error('No images')
      }
      return imgs
    }).catch((err) => {
      console.error('Failed to get images', err)
      reject(err)
    })
    if (res && res.length) {
      resolve(res.map((e) => {
        const url = `data:image/svg+xml;base64,${Buffer.from(e.src).toString('base64')}`
        return {
          mimeType: 'image/svg+xml',
          svg: {
            url,
          },
          name: e.title,
          code: e.link,
          referer: 'https://www.iconfont.cn',
        }
      }))
    }
  })

  win.setVisible(false)
  return {
    list,
    total: 0,
    page: params.page,
  }
}

export async function handleIconfontOptions(): Promise<OptionResult> {
  return {
    options: [
      {
        label: '标签',
        name: 'tag',
        value: '',
        children: [
          {
            label: '全部',
            value: ''
          }, {
            label: '线性',
            value: 'line'
          }, {
            label: '面性',
            value: 'fill'
          }, {
            label: '扁平',
            value: 'flat'
          }, {
            label: '手绘',
            value: 'hand'
          }, {
            label: '简约',
            value: 'simple'
          }, {
            label: '精美',
            value: 'complex'
          }
        ]
      }
    ]
  }
}
