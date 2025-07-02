import { success, fail } from './result.js'
import { getConfig } from '../../config/index.js'
import { ERROR_CODE } from '../../utils/const.js'
import { google } from 'googleapis'

/**
 * OAUTH文档
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow?hl=zh-cn
 */

const config = getConfig()

export async function login (req, res) {
  if (!config.login.google) {
    res.json({
      error: ERROR_CODE.NOT_ENABLED
    })
    return
  }
  if (!req.query.code || req.query.state !== req.cookies.loginNonce) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  try {
    const oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      `${config.domain}/api/oauth/google`
    )
    const { tokens } = await oauth2Client.getToken(req.query.code)
    oauth2Client.setCredentials(tokens)
    const { data } = await google.oauth2({ auth: oauth2Client, version: 'v2' }).userinfo.get()
    const user = {
      from: 'google',
      id: data.id,
      name: data.name,
      avatar: data.picture,
      originalData: JSON.stringify(data)
    }
    await success(user, req, res)
  } catch (e) {
    console.error('google login error', e)
    fail({
      error: ERROR_CODE.FAIL
    }, req, res)
  }
}
