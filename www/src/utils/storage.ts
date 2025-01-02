export const STORAGE_PREFIX = 'iconlake:'

export const PROJECT_DEFAULT_SEARCH_SITE_KEY = STORAGE_PREFIX + 'project-default-search-site'

export function setProjectDefaultSearchSite(projectId: string, site: string) {
  const map = JSON.parse(localStorage.getItem(PROJECT_DEFAULT_SEARCH_SITE_KEY) || '{}')
  map[projectId] = site
  localStorage.setItem(PROJECT_DEFAULT_SEARCH_SITE_KEY, JSON.stringify(map))
}

export function getProjectDefaultSearchSite(projectId: string) {
  const map = JSON.parse(localStorage.getItem(PROJECT_DEFAULT_SEARCH_SITE_KEY) || '{}')
  return map[projectId]
}

export const storage = {
  setProjectDefaultSearchSite,
  getProjectDefaultSearchSite,
}
