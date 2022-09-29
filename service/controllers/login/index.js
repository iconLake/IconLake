import { getLocale, setLocale } from '../../utils/index.js'
import { ROOT, RESOURCE_MAX_AGE } from '../../utils/const.js'
import { getConfig } from '../../config/index.js'
import { checkLogin } from '../user/middleware.js'

const config = getConfig()

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
  res.sendFile(`./public/login/index.${getLocale(req)}.html`, {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}

/**
 * @api {get} /login/params
 */
export async function params (req, res) {
  res.json({
    clientId: {
      gitee: config.gitee.clientId,
      github: config.github.clientId
    },
    login: config.login
  })
}
