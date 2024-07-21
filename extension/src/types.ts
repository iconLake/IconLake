export enum MsgType {
  GetIcons = 'getIcons'
}

export interface Msg {
  type: MsgType
  data: any
}

export interface SVG {
  viewBox: string
  path: string
}

export interface SVGResource {
  url: string
}

export interface Icon {
  svg: SVG
  name: string
}

export interface IconResource {
  svg: SVGResource
  name: string
  code: string
}

export interface Project {
  _id: string
  name: string
}

export enum ButtonTooltipType {
  Default = 'dark',
  Success = 'success',
  Danger = 'danger'
}
