import Browser from "webextension-polyfill"
import { handleModifyRequestReferer } from "../modify-request"
import { Media, OptionResult, SearchError, SearchParams, SearchResult } from "./types"

const cachedImgs = new Set()

export async function handleInstagram(params: SearchParams): Promise<SearchResult|SearchError> {
  if (params.page === 1) {
    cachedImgs.clear()
  }
  const activeTabs = await Browser.tabs.query({
    active: true,
  })
  const isSearch = !!params.keywords
  const url = isSearch ? `https://www.instagram.com/explore/search/keyword/?q=${params.keywords}` : 'https://www.instagram.com/'
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
      selector: isSearch ? {
        item: 'main>div>div>div>div>div',
        img: 'img',
        link: 'a',
      } : {
        item: 'article',
        img: 'div>img',
        link: 'a[href*="/p/"]',
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
    cachedImgs.add(e.img.url.replace(/\?.*/, ''))
    return {
      img: {
        ...e.img,
        url: e.img.url,
      },
      referer: e.referer,
      name: e.title || '',
      code: (e.link || '').replace(/liked_by\/?/, ''),
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

export async function handleInstagramOptions(): Promise<OptionResult> {
  return {
    options: []
  }
}
