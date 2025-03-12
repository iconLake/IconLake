import Browser from "webextension-polyfill"
import { handleModifyRequestReferer } from "../modify-request"
import { Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"

const cachedImgs = new Set()

export async function handleX(params: SearchParams): Promise<SearchResult|SearchError> {
  if (params.page === 1) {
    cachedImgs.clear()
  }
  const activeTabs = await Browser.tabs.query({
    active: true,
  })
  const isSearch = !!params.keywords
  const url = isSearch ? `https://x.com/search?q=${params.keywords}&src=typed_query&f=top` : 'https://x.com'
  const win = await Browser.windows.create({
    focused: true,
    url,
    height: 1024,
    width: 360,
    top: 0,
    left: 0,
    type: "popup",
  })
  const tabId = win.tabs![0].id!
  await new Promise((resolve) => {
    const handler = (id: number, changeInfo: Browser.Tabs.OnUpdatedChangeInfoType) => {
      if (id === tabId && changeInfo.status === 'complete') {
        resolve(true)
        Browser.tabs.onUpdated.removeListener(handler)
      }
    }
    Browser.tabs.onUpdated.addListener(handler)
  })
  const res = await Browser.tabs.sendMessage(tabId, {
    type: 'search',
    data: {
      init: isSearch ? {} : {
        click: `[data-testid="ScrollSnap-List"]>div:nth-child(${params.extra?.type === 'follow' ? 2 : 1})>a`,
      },
      selector: {
        item: '[data-testid="tweet"]',
        img: '[data-testid="tweetPhoto"] img',
        title: '[data-testid="tweetText"]',
        link: 'a[href*="/status/"]',
      },
      count: 20,
      nextPage: 'scroll',
      imgs: Array.from(cachedImgs),
    }
  })
  await Browser.windows.remove(win.id!)
  await Browser.windows.update(activeTabs[0].windowId!, {
    focused: true,
  })
  const list: Media[] = res.map((e: any) => {
    cachedImgs.add(e.img.url)
    return {
      img: {
        ...e.img,
        url: e.img.url.replace(/&name=[^&]*/, '&name=900x900'),
        originalUrl: e.img.url.replace(/&name=[^&]*/, '&name=large'),
      },
      referer: e.referer,
      name: e.title || '',
      code: e.link || '',
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
    total: 0,
    page: params.page,
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
