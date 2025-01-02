import Browser from "webextension-polyfill";
import { SearchError, SearchParams, SearchResult } from "./types";

export async function handleIconfont(params: SearchParams): Promise<SearchResult|SearchError> {
  const cookies = await Browser.cookies.getAll({
    url: 'https://www.iconfont.cn'
  })
  const ctoken = cookies.find(e => e.name === 'ctoken')?.value || ''
  const q = params.keywords || 'icon'
  const body = new URLSearchParams()
  body.append('q', q)
  body.append('sortType', 'updated_at')
  body.append('page', `${params.page}`)
  body.append('pageSize', '54')
  body.append('sType', '')
  body.append('fromCollection', '-1')
  body.append('fills', '')
  body.append('t', `${Date.now()}`)
  body.append('ctoken', ctoken)
  const res = await fetch('https://www.iconfont.cn/api/icon/search.json', {
    method: 'POST',
    body,
    headers: {
      'x-csrf-token': ctoken
    }
  })
    .then(e => e.json())
    .catch(err => {
      console.error(err)
      return {
        err
      }
    })
  if (res.err) {
    return {
      error: res.err.toString()
    }
  }
  const list = await Promise.all(
    res.data.icons.map(async (e: { show_svg: string; name: string; unicode: string; }) => {
      const url = await new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(new Blob([e.show_svg], { type: 'image/svg+xml' }))
        fileReader.onload = () => {
          resolve(fileReader.result as string)
        }
        fileReader.onerror = () => {
          reject(fileReader.error)
        }
      })
      return {
        mimeType: 'image/svg+xml',
        svg: {
          url,
        },
        name: e.name,
        code: `https://www.iconfont.cn/search/index?searchType=icon&q=${q}&page=${params.page}#${e.unicode}`,
        referer: 'https://www.iconfont.cn',
      }
    })
  )
  return {
    list,
    total: res.data.count,
    page: params.page
  }
}
