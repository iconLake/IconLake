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

export interface Creator {
  address: string
  avatar: string
  avatarHash: string
  name: string
  description: string
  sex: string
  location: string
  birthday: string
  medias: {
    name: string
    content: string
  }[]
}

export interface IconlakeAPI {
  version: number
  isProduction: boolean
  config: {
    lcd: string
    cdn: string
  }
  domain: {
    master: string
    online: string
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
  creator: {
    address: string
    getInfo: (address?: string) => Promise<Creator>
  }
  share: {
    load: (container: string, options?: { nftId?: string, classId?: string }) => Promise<void>
  }
  auth: {
    url: string
    ticket?: string
    passkey?: string
    getParams: () => {
      ticket?: string
      passkey?: string
    }
    getSearchParams: () => string
  }
  verifyHash: (uri: string, uriHash: string) => Promise<number>
}

export interface Sharethis {
  load: (type: string, options?: { [key: string]: string }) => Promise<void>
}

((globalThis: Window & { iconlakeAPI: IconlakeAPI, __sharethis__: Sharethis }) => {
  const isProduction = !/test|localhost|127\.0\.0\.1/i.test(location.href)
  const lcd = isProduction ? 'https://lcd.iconlake.com' : 'https://lcd.testnet.iconlake.com'
  const cdn = isProduction ? 'https://cdn.iconlake.com' : 'https://iconlake-sh-test-1304929357.cos.ap-shanghai.myqcloud.com'

  const domain = {
    master: isProduction ? 'https://iconlake.com' : location.origin,
    online: isProduction ? 'https://iconlake.online' : location.origin
  }

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
   * Cache
   */
  const cache = {
    data: new Map<string, unknown>()
  }

  /**
   * Class
   */
  const classAPI = {
    id: ''
  } as IconlakeAPI['class']
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
    const cacheKey = `class:getNfts:${pid}`
    const cachedRes = cache.data.get(cacheKey)
    if (cachedRes) {
      return cachedRes
    }
    let res = await fetch(`${lcd}/iconlake/icon/nfts?class_id=${pid}`).then(res => res.json()).then(transferKey)
    if (!res || +res.pagination?.total === 0) {
      const authSearchParams = authAPI.getSearchParams()
      res = await fetch(`/api/exhibition/nftList/${pid}${authSearchParams ? `?${authSearchParams}` : ''}`).then(res => res.json())
    }
    cache.data.set(cacheKey, res)
    return res
  }
  classAPI.getInfo = async (id?: string) => {
    const pid = id ?? classAPI.id
    const cacheKey = `class:getInfo:${pid}`
    const cachedRes = cache.data.get(cacheKey)
    if (cachedRes) {
      return cachedRes
    }
    let res = await fetch(`${lcd}/iconlake/icon/class?id=${pid}`).then(res => res.json()).then(transferKey)
    if (!res?.class) {
      res = {
        class: await fetch(`/api/exhibition/classInfo/${pid}`).then(res => res.json())
      }
    }
    cache.data.set(cacheKey, res.class)
    return res.class
  }

  /**
   * Nft
   */
  const nftAPI = {
    id: ''
  } as IconlakeAPI['nft']
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
    const cacheKey = `nft:getInfo:${nid}`
    const cachedRes = cache.data.get(cacheKey)
    if (cachedRes) {
      return cachedRes
    }
    let res = await fetch(`${lcd}/iconlake/icon/nft?class_id=${classAPI.id}&id=${nid}`).then(res => res.json()).then(transferKey)
    if (!res?.nft) {
      const authSearchParams = authAPI.getSearchParams()
      res = {
        nft: await fetch(`/api/exhibition/nftInfo/${classAPI.id}/${nid}${authSearchParams ? `?${authSearchParams}` : ''}`).then(res => res.json())
      }
    }
    cache.data.set(cacheKey, res.nft)
    return res.nft
  }

  /**
   * Creator
   */
  const creatorAPI = {
    address: ''
  } as IconlakeAPI['creator']
  Object.defineProperties(creatorAPI, {
    address: {
      get () {
        const matches = location.pathname.match(/^\/exhibition\/creator\/([^/?#]+).*/)
        return matches?.[1]
      },
      set () {
        console.log('address is readonly')
      }
    }
  })
  creatorAPI.getInfo = async (address?: string) => {
    const addr = address ?? creatorAPI.address
    const cacheKey = `creator:getInfo:${addr}`
    const cachedRes = cache.data.get(cacheKey)
    if (cachedRes) {
      return cachedRes
    }
    let res = await fetch(`${lcd}/iconlake/icon/creator/${addr}`).then(res => res.json()).then(res => {
      if (res.error) {
        throw new Error(res.error)
      }
      return transferKey(res)
    })
    if (!res?.creator) {
      res = {
        creator: await fetch(`/api/exhibition/creatorInfo/${addr}`).then(res => res.json())
      }
    }
    cache.data.set(cacheKey, res.creator)
    return res.creator
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
            clearInterval(timer as unknown as number)
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
        } else if (options.creator) {
          const creator = await creatorAPI.getInfo(options.creator)
          shareInfo.url = window.location.href
          shareInfo.image = creator.avatar
          shareInfo.title = creator.name
          shareInfo.description = creator.description
        }
      }
      globalThis.__sharethis__.load('inline-share-buttons', {
        container,
        ...this.config,
        ...shareInfo
      })
    }
  }

  /**
   * Auth
   */
  const authAPI = {
    url: globalThis.location.href,
    ticket: '',
    passkey: '',
    getParams () {
      const url = new URL(authAPI.url)
      return {
        ticket: url.searchParams.get('ticket') || undefined,
        passkey: url.searchParams.get('passkey') || undefined
      }
    },
    getSearchParams () {
      const params = authAPI.getParams()
      const init: Record<string, string> = {}
      if (params.ticket) {
        init.ticket = params.ticket
      }
      if (params.passkey) {
        init.passkey = params.passkey
      }
      return new URLSearchParams(init).toString()
    }
  }

  Object.assign(authAPI, authAPI.getParams())

  function verifyHash (uri: string, uriHash: string) {
    if (!uri || !uriHash) {
      return Promise.resolve(0)
    }
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
      lcd,
      cdn
    },
    domain,
    loading,
    class: classAPI,
    nft: nftAPI,
    creator: creatorAPI,
    share: shareAPI,
    auth: authAPI,
    verifyHash
  }
})(window as never)
