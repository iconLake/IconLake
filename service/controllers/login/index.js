import { User } from '../../models/user.js'
import { getLocale, setLocale } from '../../utils/index.js'
import { ROOT, RESOURCE_MAX_AGE } from '../../utils/const.js'

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
