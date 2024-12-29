import { handleModifyRequestReferer } from "../modify-request"
import { MediaType, SearchParams, SearchResult } from "./types"

let seq = ''

export async function handleHuaban(params: SearchParams): Promise<SearchResult> {
  let isFeeds = false
  let url = `https://huaban.com/v3/search/file?text=${params.keywords}&sort=all&limit=40&page=${params.page}&position=search_pin&fields=pins:PIN%7Ctotal,facets,split_words,relations,rec_topic_material,topics`
  if (!params.keywords) {
    url = 'https://huaban.com/v3/feeds/list?limit=40&fields=feeds:FEEDS'
    if (params.page > 1) {
      url += `&max=${seq}`
    }
    isFeeds = true
  }
  const res = await fetch(url)
    .then(e => e.json())
    .catch(err => {
      console.error(err)
      return {
        err
      }
    })
  const originalList = isFeeds ? res.feeds : res.pins
  const list = originalList.map((e: { file: { bucket: string, key: string }, raw_text: string, pin_id: string }) => {
    return {
      type: MediaType.Image,
      img: {
        url: `https://${e.file.bucket}.huaban.com/${e.file.key}_fw240webp`,
        originalUrl: `https://${e.file.bucket}.huaban.com/${e.file.key}_fw1200webp`,
      },
      name: e.raw_text,
      code: `https://huaban.com/pins/${e.pin_id}`,
      referer: 'https://huaban.com',
    }
  })
  if (isFeeds) {
    seq = originalList[originalList.length - 1].seq
  }
  handleModifyRequestReferer(list.map((e: { img: { url: string }; referer: string }) => {
    return {
      url: e.img.url,
      referer: e.referer,
    }
  }))
  return {
    list,
    total: res.total,
    page: params.page,
  }
}
