import Browser from "webextension-polyfill"
import { handleModifyRequestReferer } from "../modify-request"
import { Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"

const cachedImgs = new Set()

export async function handlePinterest(params: SearchParams): Promise<SearchResult|SearchError> {
  if (params.page === 1) {
    cachedImgs.clear()
  }
  const activeTabs = await Browser.tabs.query({
    active: true,
  })
  const isSearch = !!params.keywords
  const url = isSearch ? `https://www.pinterest.com/search/pins/?q=${params.keywords}` : 'https://www.pinterest.com/'
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
      selector: {
        item: '[data-test-id="pinWrapper"]',
        img: '[data-test-id="non-story-pin-image"] img',
        link: 'a[href*="/pin/"]',
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
        url: e.img.url.replace(/\/\d*x\//, '/236x/'),
        originalUrl: e.img.url.replace(/\/\d*x\//, '/originals/'),
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

export async function handlePinterestOptions(): Promise<OptionResult> {
  return {
    options: []
  }
}
