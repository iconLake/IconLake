export interface Media {
  mimeType: string
  img?: {
    url: string
    originalUrl?: string
  }
  svg?: {
    url: string
  }
  name?: string
  code?: string
  referer: string
}

export enum Site {
  iconfont = 'iconfont',
  huaban = 'huaban',
}

export interface SearchParams {
  keywords: string
  page: number
  site: string
}

export interface SearchResult {
  list: Media[]
  total: number
  page: number
}

export interface SearchError {
  error: string
}
