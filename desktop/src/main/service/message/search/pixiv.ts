import { WebContentsView } from "electron"
import { createSubWindow, createWindow } from "../../../utils"
import { handleModifyRequestReferer } from "../../modify-request"
import { DetailParams, DetailResult, Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"

const fetchInHost = ({ url, win }: { url: string; win: WebContentsView }) => {
  return win.webContents
    .executeJavaScript(`fetch("${url}").then(r => r.json())`, true)
}

export async function handlePixiv(params: SearchParams): Promise<SearchResult | SearchError> {
  let isFollow = false
  let isSearch = !!params.keywords
  let url = `https://www.pixiv.net/ajax/search/artworks/${encodeURIComponent(params.keywords)}?word=${encodeURIComponent(params.keywords)}&order=date_d&mode=all&p=${params.page}&csw=0&s_mode=s_tag_full&type=all`
  let pageUrl = `https://www.pixiv.net/tags/${encodeURIComponent(params.keywords)}/artworks`
  if (!isSearch) {
    if (params.extra?.type === 'rank') {
      url = `https://www.pixiv.net/ranking.php?mode=${params.extra.mode || 'daily'}&p=${params.page}&format=json`
      pageUrl = 'https://www.pixiv.net/ranking.php'
    } else {
      url = `https://www.pixiv.net/ajax/follow_latest/illust?p=${params.page}&mode=all`
      pageUrl = 'https://www.pixiv.net/'
      isFollow = true
    }
  }
  const win = await createSubWindow({
    url: pageUrl,
    id: 'search:pixiv',
  })
  win.setVisible(true)
  if (pageUrl !== win.webContents.getURL()) {
    win.webContents.scrollToTop()
    win.webContents.loadURL(pageUrl)
  }
  const res = await fetchInHost({ url, win })
    .catch(err => {
      console.error(err)
      return {
        error: true,
        message: err.message || 'Unknown Error'
      }
    })
  if (res.error) {
    createWindow({
      url: 'https://www.pixiv.net',
      width: 1366,
      height: 768,
    })
    win.setVisible(false)
    throw new Error('Unauthorized')
  }
  let originalList = res.contents
  if (isSearch) {
    originalList = res.body.illustManga.data
  } else if (isFollow) {
    originalList = res.body.thumbnails.illust
  }
  const list: Media[] = originalList.map((e: {
    title: string
    url: string
    illust_id?: number
    id?: string
  }) => {
    return {
      mimeType: 'image/jpeg',
      img: {
        url: e.url.replace('250x250_80_a2', '540x540_70').replace('square1200', 'master1200'),
      },
      name: e.title,
      code: `https://www.pixiv.net/artworks/${e.id || e.illust_id}`,
      referer: 'https://www.pixiv.net',
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

export async function handlePixivDetail(params: DetailParams): Promise<DetailResult|SearchError> {
  const win = await createSubWindow({
    url: params.url,
    id: 'detail',
  })
  win.webContents.scrollToTop()
  win.setVisible(true)
  win.webContents.loadURL(params.url)
  const id = params.url.split('/').pop()
  const res = await fetchInHost({
    url: `https://www.pixiv.net/ajax/illust/${id}/pages`,
    win,
  })
    .catch(err => {
      console.error(err)
      return {
        error: true,
        message: err.message || 'Unknown Error',
        body: []
      } as any
    })
  if (res.error) {
    return {
      error: res.message || 'Unknown Error'
    }
  }
  const imgs = res.body.map((e: {
    urls: {
      original: string
    }
  }) => {
    return {
      url: e.urls.original
    }
  })
  win.setVisible(false)
  return {
    imgs,
    html: '',
  }
}

export async function handlePixivOptions(): Promise<OptionResult> {
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
            label: '排行榜',
            value: 'rank',
            options: [
              {
                label: '排行榜类型',
                name: 'mode',
                value: 'daily',
                children: [
                  {
                    label: '日榜',
                    value: 'daily'
                  }, {
                    label: '周榜',
                    value: 'weekly'
                  }, {
                    label: '月榜',
                    value: 'monthly'
                  }, {
                    label: '新人榜',
                    value: 'rookie'
                  }, {
                    label: '原创榜',
                    value: 'original'
                  }, {
                    label: 'AI榜',
                    value: 'daily_ai'
                  }, {
                    label: '受男性欢迎榜',
                    value: 'male'
                  }, {
                    label: '受女性欢迎榜',
                    value: 'female'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
