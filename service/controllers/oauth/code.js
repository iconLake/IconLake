import { getConfig } from '../../config/index.js'
import { ERROR_CODE } from '../../utils/const.js'
import { fail, success } from './result.js'

const config = getConfig()

/**
 * @api {get} /oauth/code 通过用户ID登录，仅可用于开发环境
 * @apiQuery {string} id
 */
export async function login (req, res) {
  if (!config.login.code) {
    res.json({
      error: ERROR_CODE.NOT_ENABLED
    })
    return
  }
  if (typeof req.query.id === 'string') {
    success({
      id: req.query.id,
      from: 'code'
    }, req, res)
  } else {
    console.error('code login fail', req.query)
    fail({
      error: ERROR_CODE.FAIL
    }, req, res)
  }
}
