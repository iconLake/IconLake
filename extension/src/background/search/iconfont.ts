import Browser from "webextension-polyfill";
import { Media, SearchError, OptionGroup, SearchParams, SearchResult, OptionResult } from "./types";
import { handleModifyRequestReferer } from "../modify-request";

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
  if (params.extra && params.extra.tag) {
    body.append(params.extra.tag, '1')
  }
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
  const list: Media[] = await Promise.all(
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
  await handleModifyRequestReferer(list.map((e) => {
    return {
      url: e.svg!.url,
      referer: e.referer,
    }
  }))
  return {
    list,
    total: res.data.count,
    page: params.page
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
