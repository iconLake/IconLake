/**
 * 缓存
 */
export const cache = new Map()

/**
 * 资源类型
 */
export const TYPE = {
  ICONFONT: 1
}

/**
 * 解析资源
 * @param url
 * @param type
 */
export async function parse (url: string, type = 1) {
  if (cache.has(url)) {
    return cache.get(url)
  }
  const fn = [() => {}, parseIconfont][type]
  const icons = await fn(url)
  cache.set(url, icons)
  return icons
}

/**
 * 解析iconfont
 * @param url
 */
export async function parseIconfont (url: string) {
  const text = await req(url)
  const icons: any = {}
  const matches = text.match(/<symbol.+?<\/symbol>/ig)
  if (matches instanceof Array) {
    matches.forEach(t => {
      const m = t.match(/<symbol id="(.+?)".*?>(.+?)<\/symbol>/i)
      if (m) {
        icons[m[1]] = m[2]
      }
    })
  }
  return icons
}

const loading = new Map()
/**
 * 请求
 * @param url
 */
export async function req(url: string) {
  if (loading.has(url)) {
    // 0: done, 1: loading, 2: fail
    const isLoading = loading.get(url).isLoading
    if (isLoading === 1) {
      return await new Promise((resolve, reject) => {
        const t = setInterval(() => {
          const data = loading.get(url)
          if (data.isLoading === 0) {
            clearInterval(t)
            resolve(data.text)
          } else if (data.isLoading === 2) {
            clearInterval(t)
            reject()
          }
        }, 20)
      })
    } else if (isLoading === 0) {
      return loading.get(url).text
    } else if (isLoading === 2) {
      loading.delete(url)
    }
  }
  const data = {
    isLoading: 1,
    text: ''
  }
  loading.set(url, data)
  try {
    const text = await (await fetch(url)).text()
    data.isLoading = 0
    data.text = text
  } catch {
    data.isLoading = 2
  }
  return data.text
}
