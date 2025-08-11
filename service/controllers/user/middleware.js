import { Project } from '../../models/project.js'
import { Ticket } from '../../models/ticket.js'
import { User } from '../../models/user.js'
import { ERROR_CODE, TOKEN_MAX_AGE } from '../../utils/const.js'
import { generateToken, setToken } from '../oauth/result.js'

const refreshTokenMaxAge = TOKEN_MAX_AGE * 0.1

export async function middleware (req, res, next) {
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

export default middleware

/**
 * 检查登录
 * @param {Request} req
 * @returns {Promise<{error?: string, user?: object}>}
 */
export async function checkLogin (req) {
  if (req.headers['iconlake-access-key']) {
    const user = await User.findOne({
      'accessKey.id': req.headers['iconlake-access-key']
    })
    if (user) {
      return {
        user
      }
    } else {
      return {
        error: ERROR_CODE.USER_NOT_LOGIN
      }
    }
  }
  if (!req.cookies.token) {
    return {
      error: ERROR_CODE.USER_NOT_LOGIN
    }
  }
  const i = req.cookies.token.indexOf(':')
  if (i === -1 || i === req.cookies.token.length - 1) {
    return {
      error: ERROR_CODE.USER_NOT_LOGIN
    }
  }
  const _id = req.cookies.token.substring(0, i)
  const token = req.cookies.token.substring(i + 1)
  if (!_id || !token) {
    return {
      error: ERROR_CODE.USER_NOT_LOGIN
    }
  }
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

export async function checkTicket (req, res, next) {
  if (!req.params.projectId || typeof req.params.projectId !== 'string') {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const project = await Project.findOne({
    _id: req.params.projectId
  }, 'isPublic')
  if (!project) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  if (project.isPublic) {
    return next()
  }
  if (!req.query.ticket || typeof req.query.ticket !== 'string' || !req.query.passkey || typeof req.query.passkey !== 'string') {
    return res.json({
      error: 'noTicket'
    })
  }
  const ticket = await Ticket.findOne({
    _id: req.query.ticket
  }, 'auth')
  if (!ticket || !ticket.auth || ticket.auth.passkey !== req.query.passkey || +ticket.auth.expired < Date.now()) {
    return res.json({
      error: 'noTicket'
    })
  }
  next()
}
