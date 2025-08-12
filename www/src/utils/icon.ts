import type { Icon } from '@/apis/project';

export function getIconUrl(iconInfo: Icon) {
  return iconInfo.svg?.url || iconInfo.img?.url
}

export function toIcon (info: {
  img?: {
    url?: string
  }
  svg?: {
    url?: string
  }
}): Icon {
  return {
    _id: '',
    groupId: '',
    tags: [],
    name: '',
    code: '',
    img: {
      url: info.img?.url || '',
    },
    svg: {
      url: info.svg?.url || '',
    }
  }
}
