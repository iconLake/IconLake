import { DetailParams, DetailResult, OptionParams, OptionResult, SearchError, SearchParams, SearchResult } from "./search/types"
import { Site } from "./search/types"
import { handleHuaban, handleHuabanOptions } from "./search/huaban"
import { handleIconfont, handleIconfontOptions } from "./search/iconfont"
import { handleZcool, handleZcoolOptions, handleZoolDetail } from "./search/zcool"
import { handleGracg, handleGracgDetail, handleGracgOptions } from "./search/gracg"

const searchSites: { [key: string]: (params: SearchParams) => Promise<SearchResult|SearchError> } = {
  [Site.huaban]: handleHuaban,
  [Site.iconfont]: handleIconfont,
  [Site.zcool]: handleZcool,
  [Site.gracg]: handleGracg,
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
  [Site.iconfont]: handleIconfontOptions,
  [Site.huaban]: handleHuabanOptions,
  [Site.zcool]: handleZcoolOptions,
  [Site.gracg]: handleGracgOptions,
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
