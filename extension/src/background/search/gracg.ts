import { handleModifyRequestReferer } from "../modify-request"
import { DetailParams, DetailResult, Media, SearchError, SearchParams, SearchResult } from "./types"

let seq = ''

export async function handleGracg(params: SearchParams): Promise<SearchResult|SearchError> {
  let url = `https://www.gracg.com/search?tag=${params.keywords}&page=${params.page}&sort=score`
  if (!params.keywords) {
    url = `https://www.gracg.com/followwork?page=${params.page}`
  }
  const res = await fetch(url)
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
  let reg = "background-image: url\\('([^']*)'\\);"
  const list: Media[] = (res.html.match(new RegExp(reg, 'g')) || []).map((e) => {
    const url = e.match(new RegExp(reg))![1]
    return {
      mimeType: 'image/jpeg',
      img: {
        url,
      },
      name: '',
      code: '',
      referer: 'https://www.gracg.com',
    }
  })
  reg = '<div class="  font-weight-bold font-13 text-truncate  ">([^<]*)</div>'
  const names = (res.html.match(new RegExp(reg, 'g')) || []).map((e) => {
    return e.match(new RegExp(reg))![1]
  })
  reg = 'data-dddd="([^"]*)" data-cccc="v"'
  const codes = (res.html.match(new RegExp(reg, 'g')) || []).map((e) => {
    return 'https://www.gracg.com/v/' + e.match(new RegExp(reg))![1]
  })
  list.forEach((e, i) => {
    e.name = names[i]
    e.code = codes[i]
  })
  await handleModifyRequestReferer(list.map((e) => {
    return {
      url: e.img!.url,
      referer: e.referer,
    }
  }))
  return {
    list,
    total: 0,
    page: params.page,
  }
}

export async function handleGracgDetail(params: DetailParams): Promise<DetailResult|SearchError> {
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
  const match = res.html.match(/Photolist="([^"]*)"/)
  if (!match) {
    return {
      error: 'invalid url'
    }
  }
  const data = JSON.parse(atob(match[1]))
  return {
    imgs: data.map((e: any) => ({
      url: `${e.Photourl}_1200w.jpg`
    })),
    html: '',
  }
}
