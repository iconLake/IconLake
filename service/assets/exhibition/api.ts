export interface Pagination {
  total: number
  nextKey: string
}

export interface Nft {
  classId: string
  id: string
  uri: string
  uriHash: string
  data: {
    author: string
    name: string
    description: string
    createTime: string
  }
}

export interface Nfts {
  pagination: Pagination
  nfts: Nft[]
}

export interface ClassInfo {
  id: string
  symbol: string
  uri: string
  uriHash: string
  name: string
  description: string
  data: {
    author: string
    createTime: string
  }
}

export interface ShareInfo {
  url: string
  image: string
  title: string
  description: string
}

export interface IconLakeAPI {
  version: number
  isProduction: boolean
  config: {
    lcd: string
  }
  loading: {
    dom: Element
    isShow: boolean
  },
  class: {
    id: string
    getNfts: (id?: string) => Promise<Nfts>
    getInfo: (id?: string) => Promise<ClassInfo>
  }
  nft: {
    id: string
    getInfo: (id?: string) => Promise<Nft>
  }
  share: {
    load: (container: string, options?: { nftId?: string, classId?: string }) => Promise<void>
  }
  verifyHash: (uri: string, uriHash: string) => Promise<number>
}

((globalThis: Window & { iconlakeAPI: IconLakeAPI, __sharethis__: any }) => {
  const isProduction = !/test|localhost|127\.0\.0\.1/i.test(location.href)
  const lcd = isProduction ? 'https://lcd.iconlake.com' : 'https://lcd.testnet.iconlake.com'

  /**
   * Loading
   */
  const loadingDom = document.querySelector('.loading')
  if (!loadingDom) {
    return
  }
  const loading = {
    isShow: false,
    dom: loadingDom
  }
  Object.defineProperties(loading, {
    isShow: {
      get () {
        return loading.dom?.classList.contains('show')
      },
      set (value) {
        if (value) {
          loading.dom?.classList.add('show')
        } else {
          loading.dom?.classList.remove('show')
        }
      }
    }
  })

  /**
   * Transfer key
   */
  const transferKey = (obj: unknown) => {
    if (obj instanceof Object) {
      if (obj instanceof Array) {
        return obj.map(transferKey)
      }
      const newObj = {}
      Object.keys(obj).forEach(key => {
        if (key[0] === '_') {
          return
        }
        newObj[key.replace(/_([a-z])/g, match => match[1].toUpperCase())] = transferKey(obj[key])
      })
      return newObj
    }
    return obj
  }

  /**
   * Class
   */
  const classAPI = {
    id: ''
  } as IconLakeAPI['class']
  Object.defineProperties(classAPI, {
    id: {
      get () {
        const matches = location.pathname.match(/^\/exhibition\/([^/?#]+).*/)
        return matches?.[1]
      },
      set () {
        console.log('id is readonly')
      }
    }
  })
  classAPI.getNfts = async (id?: string) => {
    const pid = id ?? classAPI.id
    return await fetch(`${lcd}/iconlake/icon/nfts?class_id=${pid}`).then(res => res.json()).then(transferKey)
  }
  classAPI.getInfo = async (id?: string) => {
    const pid = id ?? classAPI.id
    return await fetch(`${lcd}/iconlake/icon/class?id=${pid}`).then(res => res.json()).then(res => transferKey(res.class))
  }

  /**
   * Nft
   */
  const nftAPI = {
    id: ''
  } as IconLakeAPI['nft']
  Object.defineProperties(nftAPI, {
    id: {
      get () {
        const matches = location.pathname.match(/^\/exhibition\/[^/?#]+\/([^/?#]+).*/)
        return matches?.[1]
      },
      set () {
        console.log('id is readonly')
      }
    }
  })
  nftAPI.getInfo = async (id?: string) => {
    const nid = id ?? nftAPI.id
    return await fetch(`${lcd}/iconlake/icon/nft?class_id=${classAPI.id}&id=${nid}`).then(res => res.json()).then(res => transferKey(res.nft))
  }

  /**
   * Share
   */
  const shareAPI = {
    config: {
      alignment: 'center',
      background_color: '#B581A3',
      color: 'social',
      enabled: true,
      font_size: 12,
      has_spacing: true,
      is_ssb: false,
      labels: 'none',
      language: 'en',
      min_count: 0,
      networks: ['sharethis'],
      num_networks: 5,
      num_ssb_networks: 3,
      padding: 10,
      radius: 10,
      show_total: false,
      size: 32,
      size_label: 'small',
      spacing: 8,
      text_color: '#fff',
      use_native_counts: true
    },
    async load (container, options) {
      await new Promise<void>((resolve) => {
        if (globalThis.__sharethis__) {
          return resolve()
        }
        const timer = setInterval(() => {
          if (globalThis.__sharethis__) {
            clearInterval(timer)
            return resolve()
          }
        }, 50)
      })
      const shareInfo: ShareInfo = {} as ShareInfo
      if (options) {
        if (options.nftId) {
          const nft = await nftAPI.getInfo(options.nftId)
          shareInfo.url = globalThis.location.href
          shareInfo.image = nft.uri
          shareInfo.title = nft.data.name
          shareInfo.description = nft.data.description
        } else if (options.classId) {
          const classInfo = await classAPI.getInfo(options.classId)
          shareInfo.url = window.location.href
          shareInfo.image = classInfo.uri
          shareInfo.title = classInfo.name
          shareInfo.description = classInfo.description
        }
      }
      globalThis.__sharethis__.load('inline-share-buttons', {
        container,
        ...this.config,
        ...shareInfo
      })
    }
  }

  function verifyHash (uri: string, uriHash: string) {
    return fetch(uri, {
      mode: 'cors',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).then(res => res.blob()).then(blob => blob.arrayBuffer()).then(async buf => {
      const url = '/libs/js-sha256/sha256.min.js'
      const m = await import(url)
      const hash = m.default.sha256(buf)
      if (hash === uriHash) {
        return 1
      }
      return 0
    }).catch((err) => {
      console.error(err)
      return -1
    })
  }

  globalThis.iconlakeAPI = {
    version: 1,
    isProduction,
    config: {
      lcd
    },
    loading,
    class: classAPI,
    nft: nftAPI,
    share: shareAPI,
    verifyHash
  }
})(window as never)
