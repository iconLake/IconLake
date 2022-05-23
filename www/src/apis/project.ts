import request from '../utils/request'

const baseURL = '/api/project/'

export interface OriginalIcon {
  name: string
}

export interface Icon {
  _id: string
  sourceId: string
  groupId: string
  name: string
  code: string
  tags: string[]
  syncTime: string
  originalData: OriginalIcon
  analyse?: {
    pageCount: number
  }
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

export interface Source {
  _id: string
  name: string
  type: number
  resourceUrl: string
  syncUrl: string
  prefix: string
  className: string
  iconPath?: any
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

export interface Project {
  _id: string
  userId: string
  name: string
  desc: string
  icons: Icon[]
  groups: Group[]
  sources: Source[]
  monitor: Monitor
  invite?: Invite
}

export interface ProjectSource extends Source {
  projectId: string
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

export function sync(projectId: string, _id: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: `/sync/${projectId}`,
    baseURL,
    data: {
      _id
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

export function editSource(data: ProjectSource) {
  return <Promise<IdRes>>request({
    method: 'POST',
    url: '/source/edit',
    baseURL,
    data,
  })
}

export function delSource(projectId: string, _id: string) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/source/del',
    baseURL,
    data: {
      projectId,
      _id
    },
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
    source: Source
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
