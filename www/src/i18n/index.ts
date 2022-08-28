import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import zhCn from './messages/zh-cn.json'
import enUs from './messages/en-us.json'

export type Locales = 'zh-cn'|'en-us'

export function isLocale(locale: any) {
  return /^(zh-cn|en-us)$/.test(locale)
}

export const locale: Locales = isLocale(Cookies.get('locale')) ? <Locales>Cookies.get('locale') : 'zh-cn'

export const messages = {
  'zh-cn': zhCn,
  'en-us': enUs
}

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'zh-cn',
  messages
})

export default i18n
