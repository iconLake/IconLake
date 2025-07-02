import fetch from 'node-fetch'
import { success, fail } from './result.js'
import { getConfig } from '../../config/index.js'
import { ERROR_CODE } from '../../utils/const.js'

/**
 * OAUTH文档
 * https://docs.github.com/cn/developers/apps/building-oauth-apps/authorizing-oauth-apps
 * 登录：
 * https://github.com/login/oauth/authorize?client_id=
 */

const config = getConfig()

export async function login (req, res) {
  if (!config.login.github) {
    res.json({
      error: ERROR_CODE.NOT_ENABLED
    })
    return
  }
  if (!req.query.code) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  try {
    const query = (new URLSearchParams({
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      redirect_uri: `${config.domain}/api/oauth/github`,
      code: req.query.code
    })).toString()
    const q = await fetch(`https://github.com/login/oauth/access_token?${query}`, {
      headers: {
        Accept: 'application/json'
      }
    })
    const data = await q.json()
    if (data.access_token) {
      const qq = await fetch('https://api.github.com/user', {
        headers: {
          Accept: 'application/json',
          Authorization: `token ${data.access_token}`
        }
      })
      const originalData = await qq.json()
      const user = {
        from: 'github',
        id: originalData.id,
        name: originalData.name,
        avatar: originalData.avatar_url,
        originalData: JSON.stringify(originalData)
      }
      success(user, req, res)
      return
    }
    console.error('github login data error', data)
    fail({
      error: data.error
    }, req, res)
  } catch (e) {
    console.error('github login error', e)
    fail({
      error: ERROR_CODE.FAIL
    }, req, res)
  }
}
