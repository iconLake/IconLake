import { toast } from '.'
import i18n from '@/i18n'
const { t } = i18n.global

export function isSvgFile(file: File, isShowToast = true) {
  const isSvg = file.type === 'image/svg+xml'
  if (!isSvg && isShowToast) {
    toast.error(t('pleaseSelectFile', { type: 'SVG' }))
  }
  return isSvg
}

export function isImgFile(file: File, isShowToast = true) {
  const isImg = file.type.startsWith('image/')
  if (!isImg && isShowToast) {
    toast.error(t('pleaseSelectFile', { type: t('img') }))
  }
  return isImg
}

export function getExtByMimeType(mimeType: string) {
  const parts = mimeType.split('/')
  if (parts.length < 2) {
    return mimeType
  }
  if (parts[1] === 'svg+xml') {
    return 'svg'
  } else {
    return parts[1]
  }
}
