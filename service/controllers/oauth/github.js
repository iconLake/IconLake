import fetch from 'node-fetch'
import { success, fail } from './result.js'
import { getConfig } from '../../config/index.js'

/**
 * OAUTH文档
 * https://docs.github.com/cn/developers/apps/building-oauth-apps/authorizing-oauth-apps
 * 登录：
 * https://github.com/login/oauth/authorize?client_id=
 */

const config = getConfig()

export async function login (req, res) {
  if (req.query.code) {
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
      const user = await qq.json()
      user.from = 'github'
      user.avatar = user.avatar_url
      success(user, req, res)
    } else {
      console.error(data)
      fail({
        error: data.error
      }, req, res)
    }
  }
}
