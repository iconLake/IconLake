import { getLocale, setLocale } from '../../utils/index.js'
import { ROOT, RESOURCE_MAX_AGE } from '../../utils/const.js'
import { getConfig } from '../../config/index.js'
import { checkLogin } from '../user/middleware.js'
import crypto from 'crypto'

const config = getConfig()
const hostname = new URL(config.domain).hostname

/**
 * 登录页
 */
export default async function index (req, res) {
  setLocale(req, res)
  if (req.cookies.token) {
    const result = await checkLogin(req)
    if (result.user) {
      res.redirect(req.query.redirect || '/manage')
      return
    }
  }
  if (req.hostname !== hostname) {
    res.redirect(`${config.domain}/login`)
    return
  }
  res.sendFile(`./public/login/index.${getLocale(req)}.html`, {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}

/**
 * @api {get} /login/params
 */
export async function params (req, res) {
  const nonce = crypto.randomBytes(16).toString('hex')
  res.cookie('loginNonce', nonce, {
    path: '/',
    httpOnly: true
  })
  res.json({
    domain: config.domain,
    nonce,
    clientId: {
      gitee: config.gitee.clientId,
      github: config.github.clientId,
      google: config.google.clientId
    },
    login: config.login
  })
}
