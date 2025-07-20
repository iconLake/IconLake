import { ERROR_CODE } from './const.js'

const localeWhiteList = [
  'zh-cn',
  'en-us'
]

const localeReg = new RegExp(`^(${localeWhiteList.join('|')})$`, 'i')

/**
 * 获取语言
 * @param {request} req
 */
export function getLocale (req) {
  let locale = localeWhiteList[1]
  if (localeReg.test(req.query.locale)) {
    locale = req.query.locale
  } else if (localeReg.test(req.cookies.locale)) {
    locale = req.cookies.locale
  } else {
    const headerMatches = new RegExp(`^(${localeWhiteList.join('|')})`, 'i').exec(req.get('Accept-Language'))
    if (headerMatches) {
      locale = headerMatches[1]
    }
  }
  return locale.toLowerCase()
}

/**
 * 设置语言
 * @param {request} req
 * @param {response} res
 */
export function setLocale (req, res) {
  if (localeReg.test(req.query.locale)) {
    res.cookie('locale', req.query.locale, {
      maxAge: 365 * 24 * 3600 * 1000
    })
  }
}

/**
 * 启用特性
 * @param {boolean} isEnable
 * @param {function} featureFunction
 * @returns function
 */
export function enableFeature (isEnable, featureFunction) {
  if (isEnable) {
    return featureFunction
  }
  return (_req, res) => {
    return res.json({
      error: ERROR_CODE.NOT_ENABLED
    })
  }
}

export function isURL (str) {
  return /^https?:\/\/[^\s]+$/.test(str)
}
