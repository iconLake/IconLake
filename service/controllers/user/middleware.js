import { User } from '../../models/user.js'

export default async function middleware (req, res, next) {
  const result = await checkLogin(req)
  if (result.error) {
    res.json(result)
    return
  }
  req.user = result.user
  next()
}

/**
 * 检查登录
 * @param {Request} req
 * @returns {{error?: string, user?: object}}
 */
export async function checkLogin (req) {
  if (!req.cookies.token) {
    return {
      error: 'userNotLogin'
    }
  }
  const i = req.cookies.token.indexOf('.')
  if (i === -1 || i === req.cookies.token.length - 1) {
    return {
      error: 'userNotLogin'
    }
  }
  const _id = req.cookies.token.substring(0, i)
  const token = req.cookies.token.substring(i + 1)
  const user = await User.findOne({
    _id,
    token,
    tokenExpire: {
      $gt: new Date()
    }
  })
  if (!user) {
    return {
      error: 'tokenExpired'
    }
  }
  return {
    user
  }
}
