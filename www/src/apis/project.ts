import request from '../utils/request'

const baseURL = '/api/project/'

export interface OriginalIcon {
  name: string
}

export interface BaseIcon {
  name: string
  code: string
  svg: {
    viewBox: string
    path: string
  }
}

export interface Icon extends BaseIcon {
  _id: string
  groupId: string
  tags: string[]
  analyse?: {
    pageCount: number
  },
  txHash?: string
}

export interface IconPage {
  url: string
  count: number
  time: string
}

export interface Group {
  _id: string
  name: string
  num: number
  icons: Icon[]
}

export interface Monitor {
  isOn: boolean
  spider: string
}

export interface Member {
  _id: string
  userId: string
  user: {
    name: string
    avatar: string
  }
  isAdmin: boolean
}

export interface Invite {
  code: string
  expired: string
}

export interface FileInfo {
  _id: string
  createTime: string
  hash: string
  expire: number
  content?: string
}

export interface Files {
  domain: string
  permamentMaxNum: number
  css?: FileInfo[]
  js?: FileInfo[]
}

export interface Member {
  isAdmin: boolean
  userId: string
}

export interface Project {
  _id: string
  userId: string
  name: string
  files: Files
  desc: string
  prefix: string
  class: string
  icons: Icon[]
  iconUpdateTime: string
  groups: Group[]
  monitor: Monitor
  invite?: Invite
  isPublic: boolean
  members: [Member]
}

export interface Res {
  error?: string
}

export interface IdRes {
  _id: string
}

export interface ListRes {
  list: Project[]
}

export function list() {
  return <Promise<ListRes>>request({
    url: '/list',
    baseURL
  })
}

export function create(data: any) {
  return <Promise<IdRes>>request({
    method: 'POST',
    url: '/info/edit',
    baseURL,
    data
  })
}

export function del(_id: string, name: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/del',
    baseURL,
    data: {
      _id,
      name
    }
  })
}

export function clean(_id: string, name: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/clean',
    baseURL,
    data: {
      _id,
      name
    }
  })
}

export function info(id: string, fields: string) {
  return <Promise<Project>>request({
    url: `/info/${id}`,
    params: {
      fields
    },
    baseURL
  })
}

export function editInfo(_id: string, info: {
  name?: string
  desc?: string
}) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/info/edit',
    baseURL,
    data: {
      _id,
      ...info
    }
  })
}

export function editGroup(projectId: string, group: Group) {
  return <Promise<IdRes>>request({
    method: 'POST',
    url: '/group/edit',
    baseURL,
    data: {
      projectId,
      ...group
    },
  })
}

export function delGroup(projectId: string, _id: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/group/del',
    baseURL,
    data: {
      projectId,
      _id
    },
  })
}

export function editMonitor(projectId: string, monitor: Monitor) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/monitor/edit',
    baseURL,
    data: {
      _id: projectId,
      ...monitor
    },
  })
}

export function getMembers(_id: string) {
  return <Promise<Member[]>>request({
    method: 'GET',
    url: '/member/list',
    baseURL,
    params: {
      _id
    }
  })
}

export function delMember(projectId: string, _id: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/member/del',
    baseURL,
    data: {
      projectId,
      _id
    },
  })
}

export function updateInviteCode(_id: string) {
  return <Promise<Invite>>request({
    method: 'POST',
    url: '/invite/updateCode',
    baseURL,
    data: {
      _id
    },
  })
}

export function acceptInvite(_id: string, code: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/invite/accept',
    baseURL,
    data: {
      _id,
      code
    },
  })
}

export function getIcon(projectId: string, _id: string) {
  return <Promise<{
    info: Icon
  }>>request({
    method: 'GET',
    url: '/icon/info',
    baseURL,
    params: {
      projectId,
      _id
    },
  })
}

export function addIcon(projectId: string, icons: BaseIcon[]) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/icon/add',
    baseURL,
    data: {
      projectId,
      icons
    },
  })
}

export function delIcon(projectId: string, _ids: string[]) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/icon/del',
    baseURL,
    data: {
      projectId,
      _ids
    },
  })
}

export function editIcon(projectId: string, _id: string, info: {
  name?: string
  groupId?: string
  txHash?: string
}) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/icon/edit',
    baseURL,
    data: {
      projectId,
      _id,
      ...info
    },
  })
}

export function addTag(projectId: string, _id: string, tag: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/icon/addTag',
    baseURL,
    data: {
      projectId,
      _id,
      tag
    },
  })
}

export function delTag(projectId: string, _id: string, tag: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/icon/delTag',
    baseURL,
    data: {
      projectId,
      _id,
      tag
    },
  })
}

export function getIconPages(projectId: string, _id: string) {
  return <Promise<{
    pages: IconPage[]
    updateTime: string
  }>>request({
    method: 'GET',
    url: '/icon/pages',
    baseURL,
    params: {
      projectId,
      _id
    },
  })
}

export function batchGroupIcon(projectId: string, _ids: string[], groupId: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/icon/batchGroup',
    baseURL,
    data: {
      projectId,
      _ids,
      groupId
    },
  })
}

export function genIcon(projectId: string, type: 'css'|'js'|'vue'|'react') {
  return <Promise<FileInfo>>request({
    method: 'POST',
    url: '/icon/gen',
    baseURL,
    data: {
      projectId,
      type
    },
  })
}

export function setExpire(projectId: string, fileId: string, fileType: 'css'|'js', expire: number) {
  return <Promise<FileInfo>>request({
    method: 'POST',
    url: '/icon/setExpire',
    baseURL,
    data: {
      projectId,
      fileId,
      fileType,
      expire
    },
  })
}

export function uploadFile(projectId: string, _id: string, data: string | Buffer) {
  return <Promise<{key: string, url: string}>>request({
    method: 'POST',
    url: '/file/upload',
    baseURL,
    headers: {
      'Content-Type': typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/octet-stream'
    },
    params: {
      projectId,
      _id
    },
    data
  })
}
