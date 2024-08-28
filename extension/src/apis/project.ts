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

export function uploadFile(projectId: string, _id: string, data: string | Blob, dir?: string): Promise<void | {
  url: string;
  key: string;
}> {
  const headers = new Headers()
  headers.append('Content-Type', typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/octet-stream')
  return request(`${baseUrl}/file/upload?projectId=${projectId}&_id=${_id}&dir=${dir}`, {
    method: 'POST',
    headers,
    body: data,
  })
}
