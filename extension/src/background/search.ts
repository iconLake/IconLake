import { SearchError, SearchParams, SearchResult } from "./search/types"
import { Site } from "./search/types"
import { handleHuaban } from "./search/huaban"

const sites: { [key: string]: (params: SearchParams) => Promise<SearchResult> } = {
  [Site.huaban]: handleHuaban,
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
