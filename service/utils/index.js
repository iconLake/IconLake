/**
 * 补全url
 * @param {string} url
 * @returns string
 */
export function completeUrl (url) {
  if (!/^(https?:)?\/\//.test(url)) {
    return ''
  }
  let result = url
  if (/^\/\//.test(url)) {
    result = `https:${result}`
  }
  return result
}

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
