import { parseHTML } from "linkedom";
import { handleModifyRequestReferer } from "../modify-request";
import { DetailParams, DetailResult, Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types";

export async function handleZcool(params: SearchParams): Promise<SearchResult|SearchError> {
  let res
  if (!params.keywords) {
    let url = `https://www.zcool.com.cn/p1/index/focus?type=3,8,20&p=${params.page}&ps=40`
    if (params.extra?.type === 'recommend') {
      url = `https://www.zcool.com.cn/p1/discover/first?p=${params.page}&ps=20&column=4`
    } else if (params.extra?.type === 'home') {
      url = `https://www.zcool.com.cn/p1/index/data?p=${params.page}&ps=20&column=4&ad=true`
    }
    res = await fetch(url)
      .then(e => e.json())
      .catch(err => {
        console.error(err)
        return {
          err
        }
      })
  } else {
    const body = {
      cate_id: 0,
      city_id: 0,
      college_id: 0,
      column: 4,
      has_video: 0,
      word: params.keywords || '插画',
      obj_type: 0,
      recommend_level: "1",
      sort: 5,
      time: 0,
      p: params.page,
      ps: 60
    }
    res = await fetch('https://www.zcool.com.cn/p1/search/content', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(e => e.json())
      .catch(err => {
        console.error(err)
        return {
          err
        }
      })
  }
  if (res.errorCode !== '0') {
    return {
      error: res.errorCode === 'no login' ? 'Unauthorized' : res.errorCode.toString()
    }
  }
  const list: Media[] = []
  res.datas.forEach((e: { content: { cover: string; cover2x: string; title: string; pageUrl: string; }; }) => {
    if (!e.content || !e.content.cover) {
      return
    }
    let name = e.content.title || ''
    if (name) {
      name = name.replace(/<[^>]+>/g, '')
    }
    list.push({
      mimeType: 'image/jpeg',
      img: {
        url: e.content.cover2x || '',
        originalUrl: e.content.cover || ''
      },
      name,
      code: e.content.pageUrl || '',
      referer: 'https://www.zcool.com.cn',
    })
  })
  await handleModifyRequestReferer(list.map((e) => {
    return {
      url: e.img!.url,
      referer: e.referer,
    }
  }))
  return {
    list,
    total: res.count,
    page: params.page
  }
}

export async function handleZoolDetail(params: DetailParams): Promise<DetailResult|SearchError> {
  const res = await fetch(params.url)
    .then(e => e.text())
    .then(e => {
      return {
        err: 0,
        html: e,
      }
    })
    .catch(err => {
      console.error(err)
      return {
        err: 1,
        msg: err.message || 'Unknown Error',
        html: '',
      }
    })
  if (res.err || !res.html) {
    return {
      error: res.err === 401 ? 'Unauthorized' : res.err.toString()
    }
  }
  const parser = parseHTML(res.html)
  if (!parser) {
    return {
      error: 'Invalid url'
    }
  }
  const dom = parser.window.document
  const imgs = Array.from(dom.querySelectorAll('#newContent img')).map((e: any) => ({
    url: e.dataset.src,
  }))
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
