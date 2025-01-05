import { handleModifyRequestReferer } from "../modify-request";
import { Media, SearchError, SearchParams, SearchResult } from "./types";

export async function handleZcool(params: SearchParams): Promise<SearchResult|SearchError> {
  let res
  if (!params.keywords) {
    res = await fetch(`https://www.zcool.com.cn/p1/discover/first?p=${params.page}&ps=20&column=4`)
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
  if (res.err) {
    return {
      error: res.err.toString()
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
