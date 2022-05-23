(() => {
  interface SpiderItem {
    elem: Element
    code: string
    prefix: string
    className: string
  }

  interface Visit {
    code: string
    prefix: string
    className: string
    url?: string
    count: string
    time: number
  }

  const diySpider = '{{SPIDER}}'
  const host = '{{HOST}}' || 'https://iconlake.com'
  const _id = encodeURIComponent('{{_ID}}')
  const localRecordKey = 'iconlakeRecord'

  // 抓取方法
  const spider = typeof diySpider === 'function'
    ? diySpider
    : () => {
        const list:SpiderItem[] = []
        const className = 'iconfont'
        const prefix = 'icon-'
        const iconReg = new RegExp(`${prefix}(\\S+)`, 'i')
        document.body.querySelectorAll(`.${className}`).forEach(elem => {
          const m = elem.className.match(iconReg)
          const code = m ? m[1] : null
          if (code) {
            list.push({
              elem,
              code,
              prefix,
              className
            })
          }
        })
        return list
      }

  // 统计
  let url = location.href
  const pages = {}
  /**
   * 记录图标
   */
  function record () {
    const url = location.href
    if (!(url in pages)) {
      pages[url] = {}
    }
    const list = spider()
    list.forEach(e => {
      const key = `${e.className}${e.prefix}${e.code}`
      if (!(key in pages[url])) {
        pages[url][key] = {
          ...e,
          elems: new Set(),
          time: 0
        }
      }
      pages[url][key].elems.add(e.elem)
      pages[url][key].time = Date.now()
    })
  }
  /**
   * 向服务器发送统计数据
   * @param body
   */
  function sendData (body: string) {
    fetch(`${host}/visit/record/${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body
    })
  }
  /**
   * 发送记录
   * @param url
   * @param isLocale 是否暂存在本地
   */
  function sendRecord (url: string, isLocale = false) {
    const icons = pages[url]
    pages[url] = {}
    const records:Visit[] = []
    Object.keys(icons).forEach(k => {
      const icon = icons[k]
      records.push({
        code: icon.code,
        prefix: icon.prefix,
        className: icon.className,
        count: icon.elems.size,
        time: icon.time
      })
    })
    if (records.length > 0) {
      const body = JSON.stringify({ records, url })
      if (isLocale) {
        localStorage.setItem(localRecordKey, body)
      } else {
        sendData(body)
      }
    }
  }
  // 监听
  const observer = new MutationObserver(record)
  observer.observe(document.body, {
    subtree: true,
    childList: true
  })
  // 监听页面跳转
  setInterval(() => {
    if (url !== location.href) {
      sendRecord(url)
      url = location.href
    }
  }, 20)
  // 监听页面退出
  window.addEventListener('unload', () => {
    sendRecord(location.href, true)
  })
  // 读取本地暂存的数据
  const localRecord = localStorage.getItem(localRecordKey)
  if (localRecord) {
    try {
      const body = JSON.parse(localRecord)
      if (body.records instanceof Array && body.records.length > 0) {
        sendData(localRecord)
        localStorage.removeItem(localRecordKey)
      }
    } catch (err) {
      console.error(err)
    }
  }
})()
