import { Icon, Project } from '../types';
import { domain, request } from './request';

const baseUrl = `${domain}/api/project`

export function list() {
  return request(`${baseUrl}/list`) as Promise<{list: Project[]}>
}

export function addIcon(projectId: string, icons: Icon[]) {
  return request(`${baseUrl}/icon/add`, {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      icons
    })
  }) as Promise<void>
}
