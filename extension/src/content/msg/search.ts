interface SearchParams {
  init?: {
    click?: string
  }
  selector: {
    item: string
    img: string
    title?: string
    link?: string
  }
  nextPage: string
  count: number
  imgs?: string[]
}

async function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export async function handleSearchMsg(params: SearchParams) {
  let scrollTop = 0
  const list = new Map<string, any>()

  if (params.init?.click) {
    const dom = await new Promise<HTMLAnchorElement>((resolve) => {
      setInterval(() => {
        const dom = document.querySelector<HTMLAnchorElement>(params.init!.click!)
        if (dom) {
          resolve(dom)
        }
      }, 100)
    });
    dom.click()
  }

  const oldImgs = new Set(params.imgs)

  while (list.size < params.count) {
    const items = document.querySelectorAll(params.selector.item)
    for (const item of Array.from(items)) {
      let title, link
      if (params.selector.title) {
        title = item.querySelector(params.selector.title)
      }
      if (params.selector.link) {
        link = item.querySelector(params.selector.link) as HTMLAnchorElement
      }
      const imgs = item.querySelectorAll<HTMLImageElement>(params.selector.img)
      if (!imgs.length) {
        continue
      }
      for (const img of Array.from(imgs)) {
        const url = img.getAttribute('src')
        if (url) {
          if (oldImgs.has(url)) {
            continue
          }
          list.set(url, {
            title: title?.textContent ?? '',
            link: link?.href ?? '',
            referer: location.href,
            img: {
              url,
              width: img.naturalWidth || img.width || 0,
              height: img.naturalHeight || img.height || 0,
            },
          })
        }
      }
    }

    if (list.size < params.count) {
      if (params.nextPage === 'scroll') {
        scrollTop += window.innerHeight
        window.scrollTo(0, scrollTop)
      } else if (params.nextPage) {
        const a = document.querySelector(params.nextPage)
        if (a) {
          (a as HTMLAnchorElement).click()
        }
      }
      await wait(300)
    }
  }

  return Array.from(list.values())
}
