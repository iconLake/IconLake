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

export interface ProjectInfo {
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
  project: {
    id: string
    getNfts: (id?: string) => Promise<Nfts>
    getInfo: (id?: string) => Promise<ProjectInfo>
  }
  nft: {
    id: string
    getInfo: (id?: string) => Promise<Nft>
  }
}

((globalThis: Window & { iconlakeAPI: IconLakeAPI }) => {
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
   * Project
   */
  const project = {
    id: ''
  } as IconLakeAPI['project']
  Object.defineProperties(project, {
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
  project.getNfts = async (id?: string) => {
    const pid = id ?? project.id
    return await fetch(`${lcd}/iconlake/icon/nfts?class_id=${pid}`).then(res => res.json()).then(transferKey)
  }
  project.getInfo = async (id?: string) => {
    const pid = id ?? project.id
    return await fetch(`${lcd}/iconlake/icon/class?id=${pid}`).then(res => res.json()).then(res => transferKey(res.class))
  }

  /**
   * Nft
   */
  const nft = {
    id: ''
  } as IconLakeAPI['nft']
  Object.defineProperties(nft, {
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
  nft.getInfo = async (id?: string) => {
    const nid = id ?? nft.id
    return await fetch(`${lcd}/iconlake/icon/nft?class_id=${project.id}&id=${nid}`).then(res => res.json()).then(res => transferKey(res.nft))
  }

  globalThis.iconlakeAPI = {
    version: 1,
    isProduction,
    config: {
      lcd
    },
    loading,
    project,
    nft
  }
})(window as never)
