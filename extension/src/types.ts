export enum MsgType {
  GetIcons = 'getIcons'
}

export interface Msg {
  type: MsgType
  data: any
}

export interface Icon {
  svg: string
  name: string
}
