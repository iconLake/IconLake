import { User } from '../../models/user.js'
import { ERROR_CODE, TOKEN_MAX_AGE } from '../../utils/const.js'
import { generateToken, setToken } from '../oauth/result.js'

const refreshTokenMaxAge = TOKEN_MAX_AGE * 0.1

export default async function middleware (req, res, next) {
  const result = await checkLogin(req)
  if (result.error) {
    res.json(result)
    return
  }
  if (+result.user.tokenExpire - Date.now() < refreshTokenMaxAge) {
    Object.assign(result.user, generateToken())
    await result.user.save()
    setToken(res, result.user)
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
      error: ERROR_CODE.USER_NOT_LOGIN
    }
  }
  const i = req.cookies.token.indexOf('.')
  if (i === -1 || i === req.cookies.token.length - 1) {
    return {
      error: ERROR_CODE.USER_NOT_LOGIN
    }
  }
  const _id = req.cookies.token.substring(0, i)
  const token = req.cookies.token.substring(i + 1)
  const user = await User.findById(_id, 'token tokenExpire')
  if (!user) {
    return {
      error: ERROR_CODE.USER_NOT_LOGIN
    }
  }
  if (user.token !== token || Date.now() > +user.tokenExpire) {
    return {
      error: ERROR_CODE.TOKEN_EXPIRED
    }
  }
  return {
    user
  }
}
