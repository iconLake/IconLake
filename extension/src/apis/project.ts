import { IconResource, Project } from '../types';
import { domain, request } from './request';

const baseUrl = `${domain}/api/project`

export function list() {
  return request(`${baseUrl}/list`) as Promise<{list: Project[]}>
}

export function addIcon(projectId: string, icons: IconResource[]) {
  return request(`${baseUrl}/icon/add`, {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      icons
    })
  })
}

async function uploadFileToCustom(params: {
  projectId: string
  _id: string
  data: string | ArrayBuffer | Blob
  dir?: string
}, config: {
  api: string
  token: string
}): Promise<void | {
  key: string
  url: string
}> {
  const data = new FormData()
  let file = params.data
  if (file instanceof Blob) {
    file = new File([await file.arrayBuffer()], params._id, { type: file.type })
  } else if (file instanceof ArrayBuffer) {
    file = new File([file], params._id, { type: 'application/octet-stream' })
  } else {
    file = new File([params.data], params._id, { type: 'image/svg+xml' })
  }
  data.append('file', file)
  data.append('key', `${params.dir || 'icon'}/${params.projectId}/${params._id}`)
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${config.token}`)
  return await request(config.api, {
    method: 'POST',
    headers,
    body: data
  })
}

export async function uploadFile(projectId: string, _id: string, data: string | Blob, dir?: string): Promise<void | {
  url: string;
  key: string;
}> {
  const info = await request<{
    custom?: {
      api: string
      token: string
    }
  }>(`${baseUrl}/file/storageInfo?projectId=${projectId}`)
  if (info?.custom && info.custom.api) {
    return await uploadFileToCustom({
      projectId,
      _id,
      data,
      dir
    }, info.custom)
  }
  const headers = new Headers()
  headers.append('Content-Type', typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/octet-stream')
  return await request(`${baseUrl}/file/upload?projectId=${projectId}&_id=${_id}&dir=${dir}`, {
    method: 'POST',
    headers,
    body: data,
  })
}
