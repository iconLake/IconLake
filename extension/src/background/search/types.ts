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
  zcool = 'zcool',
  gracg = 'gracg',
  x = 'x',
  pinterest = 'pinterest',
  instagram = 'instagram',
}

export interface SearchParams {
  keywords: string
  page: number
  site: string
  extra?: {
    [key: string]: string
  }
}

export interface SearchResult {
  list: Media[]
  total: number
  page: number
}

export interface SearchError {
  error: string
}

export interface DetailParams {
  url: string
  site: string
}

export interface DetailResult {
  imgs: {
    url: string
  }[]
  html: string
}

export interface Option {
  label: string
  value: string
  children?: OptionGroup[]
}

export interface OptionGroup {
  label?: string
  name: string
  value: string
  children: Option[]
}

export interface OptionParams {
  site: string
}

export interface OptionResult {
  options: OptionGroup[]
}
