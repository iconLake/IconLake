import { SearchError, SearchParams, SearchResult } from "./search/types"
import { Site } from "./search/types"
import { handleHuaban } from "./search/huaban"
import { handleIconfont } from "./search/iconfont"

const sites: { [key: string]: (params: SearchParams) => Promise<SearchResult|SearchError> } = {
  [Site.huaban]: handleHuaban,
  [Site.iconfont]: handleIconfont,
}

export async function handleSearch(params: SearchParams): Promise<SearchResult | SearchError> {
  if (!sites[params.site]) {
    return {
      error: 'site not supported'
    }
  }
  return await sites[params.site](params)
}

export function initSearch() {
  
}
