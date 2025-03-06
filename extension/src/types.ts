export enum MsgType {
  GetSvgs = 'getSvgs',
  GetImgs = 'getImgs',
}

export interface Msg {
  type: MsgType
  data: any
}

export interface SVG {
  viewBox: string
  path: string
}

export interface Resource {
  url: string
}

export interface Icon {
  svg?: SVG
  img?: {
    url: string
    width: number
    height: number
  }
  name: string
}

export interface IconResource {
  svg?: Resource
  img?: Resource
  name: string
  code: string
}

export interface Project {
  _id: string
  name: string
  type: ProjectTypes
}

export enum ButtonTooltipType {
  Default = 'dark',
  Success = 'success',
  Danger = 'danger'
}

export enum ProjectTypes {
  SVG = 1,
  Img = 2
}
