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

const localeReg = /^(zh-cn|en-us)$/i

/**
 * 获取语言
 * @param {request} req
 */
export function getLocale (req) {
  if (localeReg.test(req.query.locale)) {
    return req.query.locale
  }
  if (localeReg.test(req.cookies.locale)) {
    return req.cookies.locale
  }
  return 'zh-cn'
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
 * 比较两个源是否相同
 * @param {object} source1 源
 * @param {object} source2 源
 * @returns {boolean}
 */
export function sourceEqual (source1, source2) {
  const props = ['name', 'type', 'resourceUrl', 'syncUrl', 'prefix', 'className']
  for (let i = 0; i < props.length; i++) {
    if (source1[props[i]] !== source2[props[i]]) {
      return false
    }
  }
  return true
}
