import { DetailParams, DetailResult, OptionParams, OptionResult, SearchError, SearchParams, SearchResult } from "./search/types"
import { Site } from "./search/types"
import { handleHuaban, handleHuabanOptions } from "./search/huaban"
import { handleIconfont, handleIconfontOptions } from "./search/iconfont"
import { handleZcool, handleZcoolOptions, handleZoolDetail } from "./search/zcool"
import { handleGracg, handleGracgDetail, handleGracgOptions } from "./search/gracg"
import { handleX, handleXDetail, handleXOptions } from "./search/x"
// import { handlePinterest, handlePinterestOptions } from "./search/pinterest"
// import { handleInstagram, handleInstagramOptions } from "./search/instagram"
// import { handlePixiv, handlePixivDetail, handlePixivOptions } from "./search/pixiv"

const searchSites: { [key: string]: (params: SearchParams) => Promise<SearchResult|SearchError> } = {
  [Site.huaban]: handleHuaban,
  [Site.iconfont]: handleIconfont,
  [Site.zcool]: handleZcool,
  [Site.gracg]: handleGracg,
  [Site.x]: handleX,
  // [Site.pinterest]: handlePinterest,
  // [Site.instagram]: handleInstagram,
  // [Site.pixiv]: handlePixiv,
}

export async function handleSearch(params: SearchParams): Promise<SearchResult | SearchError> {
  if (!searchSites[params.site]) {
    return {
      error: 'site not supported'
    }
  }
  return await searchSites[params.site](params)
}

const detailSites: { [key: string]: (params: DetailParams) => Promise<DetailResult|SearchError> } = {
  [Site.gracg]: handleGracgDetail,
  [Site.zcool]: handleZoolDetail,
  [Site.x]: handleXDetail,
  // [Site.pixiv]: handlePixivDetail,
}

export async function handleDetail(params: DetailParams): Promise<DetailResult | SearchError> {
  if (!detailSites[params.site]) {
    return {
      error: 'site not supported'
    }
  }
  return await detailSites[params.site](params)
}

const optionSites: { [key: string]: (params: OptionParams) => Promise<OptionResult | SearchError> } = {
  [Site.huaban]: handleHuabanOptions,
  [Site.iconfont]: handleIconfontOptions,
  [Site.zcool]: handleZcoolOptions,
  [Site.gracg]: handleGracgOptions,
  [Site.x]: handleXOptions,
  // [Site.pinterest]: handlePinterestOptions,
  // [Site.instagram]: handleInstagramOptions,
  // [Site.pixiv]: handlePixivOptions,
}

export async function handleOption(params: OptionParams): Promise<OptionResult | SearchError> {
  if (!optionSites[params.site]) {
    return {
      error: 'site not supported'
    }
  }
  return await optionSites[params.site](params)
}

export function initSearch() {
  
}

