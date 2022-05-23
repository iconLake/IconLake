import { fail, success } from './result.js'

/**
 * @api {get} /oauth/code 通过用户ID登录，仅可用于开发环境
 * @apiQuery {string} id
 */
export async function login (req, res) {
  if (process.env.NODE_ENV === 'production') {
    res.json({
      error: 'devOnly'
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
