export enum MediaType {
  Svg = 'svg',
  Image = 'image',
  Video = 'video',
}

export interface Media {
  type: MediaType
  src: string
  name?: string
  description?: string
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
