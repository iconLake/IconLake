export const IS_PRODUCTION = !/test|debug|dev|localhost|127\.0\.0\.1/i.test(location.href)

export const ONE_DAY_SECONDS = 24 * 3600 * 1000
export const CACHE_MAX_AGE = 3 * 1000

export const PERMANENT_FILE_EXPIRE = 9999
export const TEMPORARY_FILE_EXPIRE = 30

export const CHAIN_ID = IS_PRODUCTION ? 'iconlake-1' : 'iconlake-testnet-1'

export const DROP_DENOM = 'DROP'
export const DROP_DENOM_MINI = 'udrop'
export const LAKE_DENOM = 'LAKE'
export const LAKE_DENOM_MINI = 'ulake'

export const MINT_DROP_AMOUNT_MIN = 10000
export const MINT_DROP_AMOUNT_MAX = 600000

export const UPLOAD_DIR = {
  COVER: 'cover',
  ICON: 'icon',
  THEME: 'theme',
}

export const PUBLIC_PAGES = [
  /^\/manage\/icons\/[^\/]+(\/use)?/i
]

export const PROJECT_TYPE = {
  SVG: 1,
  IMG: 2,
}

export const PROJECT_TYPE_STRING = {
  [PROJECT_TYPE.SVG]: 'svg',
  [PROJECT_TYPE.IMG]: 'img',
}

export const PROJECT_STYLE = {
  DEFAULT: 0,
  TIDY: 1,
}

export const PROJECT_STYLE_STRING = {
  [PROJECT_STYLE.DEFAULT]: 'default',
  [PROJECT_STYLE.TIDY]: 'tidy',
}

export const UPLOAD_FILE_SIZE_LIMIT = 20 * 1024 * 1024

export const ONLINE_DOMAIN = IS_PRODUCTION ? 'https://iconlake.online' : window.location.origin

export const NOT_COMPRESS_EXTS: Record<string, boolean> = {
  '.svg': true,
}

export const SEARCH_SITES = [
  { name: 'iconfont', code: 'iconfont', url: 'https://www.iconfont.cn/' },
  { name: '花瓣', code: 'huaban', url: 'https://huaban.com/' },
  { name: '站酷', code: 'zcool', url: 'https://www.zcool.com.cn/' },
  { name: '涂鸦王国', code: 'gracg', url: 'https://www.gracg.com/' },
]
