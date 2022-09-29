import { getConfig } from '../../config/index.js'
import { fail, success } from './result.js'

const config = getConfig()

/**
 * @api {get} /oauth/code 通过用户ID登录，仅可用于开发环境
 * @apiQuery {string} id
 */
export async function login (req, res) {
  if (!config.login.code) {
    res.json({
      error: 'codeLoginNotAvailable'
    })
    return
  }
  if (typeof req.query.id === 'string') {
    success({
      id: req.query.id,
      from: 'code'
    }, req, res)
  } else {
    fail({
      error: 'userAuthError'
    }, req, res)
  }
}
