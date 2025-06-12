import { handleModifyRequestReferer } from "../modify-request"
import { DetailParams, DetailResult, Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"

export async function handlePixiv(params: SearchParams): Promise<SearchResult|SearchError> {
  let isFollow = false
  let isSearch = !!params.keywords
  let url = `https://www.pixiv.net/ajax/search/artworks/${encodeURIComponent(params.keywords)}?word=${encodeURIComponent(params.keywords)}&order=date_d&mode=all&p=${params.page}&csw=0&s_mode=s_tag_full&type=all`
  if (!isSearch) {
    if (params.extra?.type === 'rank') {
      url = `https://www.pixiv.net/ranking.php?mode=${params.extra.mode || 'daily'}&p=${params.page}&format=json`
    } else {
      url = `https://www.pixiv.net/ajax/follow_latest/illust?p=${params.page}&mode=all`
      isFollow = true
    }
  }
  const res = await fetch(url)
    .then(e => {
      if (e.status === 400) {
        return {
          error: 400,
        }
      }
      return e.json()
    })
    .catch(err => {
      console.error(err)
      return {
        error: true,
        message: err.message || 'Unknown Error'
      }
    })
  if (res.error) {
    return {
      error: res.error === 400 ? 'Unauthorized' : (res.message || res.error)
    }
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
  return {
    list,
    total: res.total,
    page: params.page,
  }
}

export async function handlePixivDetail(params: DetailParams): Promise<DetailResult|SearchError> {
  const id = params.url.split('/').pop()
  const res = await fetch(`https://www.pixiv.net/ajax/illust/${id}/pages`)
    .then(e => e.json())
    .catch(err => {
      console.error(err)
      return {
        error: true,
        message: err.message || 'Unknown Error',
        body: []
      }
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
