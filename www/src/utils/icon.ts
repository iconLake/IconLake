import { Icon } from '@/apis/project';

export function getIconUrl(iconInfo: Icon) {
  return iconInfo.svg?.url || iconInfo.img?.url
}
