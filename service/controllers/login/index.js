import { User } from '../../models/user.js'
import { getLocale, setLocale } from '../../utils/index.js'
import { ROOT, RESOURCE_MAX_AGE } from '../../utils/const.js'
import { getConfig } from '../../config/index.js'

const config = getConfig()

/**
 * 登录页
 */
export default async function index (req, res) {
  setLocale(req, res)
  if (req.cookies.token) {
    const user = await User.findOne({
      token: req.cookies.token,
      tokenExpire: {
        $gt: new Date()
      }
    })
    if (user) {
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
    }
  })
}
