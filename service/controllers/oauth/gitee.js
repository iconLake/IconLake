import fetch from 'node-fetch'
import { success, fail } from './result.js'
import { getConfig } from '../../config/index.js'
import { ERROR_CODE } from '../../utils/const.js'

/**
 * OAUTH文档
 * https://gitee.com/api/v5/oauth_doc
 * 登录：
 * https://gitee.com/oauth/authorize?client_id=&redirect_uri=https%3A%2F%2Fwww.iconlake.com%2Fapi%2Foauth%2Fgitee&response_type=code
 */

const config = getConfig()

export async function login (req, res) {
  if (!config.login.gitee) {
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
      grant_type: 'authorization_code',
      client_id: config.gitee.clientId,
      redirect_uri: `${config.domain}/api/oauth/gitee`,
      code: req.query.code
    })).toString()
    const q = await fetch(`https://gitee.com/oauth/token?${query}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        client_secret: config.gitee.clientSecret
      })
    })
    const data = await q.json()
    if (data.access_token) {
      const qq = await fetch(`https://gitee.com/api/v5/user?access_token=${data.access_token}`, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      const originalData = await qq.json()
      const user = {
        from: 'gitee',
        id: originalData.id,
        name: originalData.name,
        avatar: originalData.avatar_url,
        originalData: JSON.stringify(originalData)
      }
      success(user, req, res)
      return
    }
    console.error('gitee login data error', data)
    fail({
      error: data.error,
      message: data.error_description
    }, req, res)
  } catch (e) {
    console.error('gitee login error', e)
    fail({
      error: ERROR_CODE.FAIL
    }, req, res)
  }
}
