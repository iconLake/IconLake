import { DetailParams, DetailResult, SearchError, SearchParams, SearchResult } from "./search/types"
import { Site } from "./search/types"
import { handleHuaban } from "./search/huaban"
import { handleIconfont } from "./search/iconfont"
import { handleZcool } from "./search/zcool"
import { handleGracg, handleGracgDetail } from "./search/gracg"

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
  [Site.gracg]: handleGracgDetail
}

export async function handleDetail(params: DetailParams): Promise<DetailResult | SearchError> {
  if (!detailSites[params.site]) {
    return {
      error: 'site not supported'
    }
  }
  return await detailSites[params.site](params)
}

export function initSearch() {
  
}
