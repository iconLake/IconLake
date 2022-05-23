import { nanoid } from 'nanoid'
import { User } from '../../models/user.js'
import { TOKEN_MAX_AGE } from '../../utils/const.js'

export async function success (userInfo, req, res) {
  if (userInfo.id && userInfo.from) {
    const token = nanoid()
    let user = await User.findOne({
      [userInfo.from]: {
        id: userInfo.id
      }
    })
    const maxAge = TOKEN_MAX_AGE
    if (user) {
      user.name = userInfo.name
      user.avatar = userInfo.avatar
      user.token = token
      user.tokenExpire = new Date(Date.now() + maxAge)
      user[userInfo.from] = userInfo
    } else {
      user = new User({
        name: userInfo.name,
        avatar: userInfo.avatar,
        token,
        [userInfo.from]: userInfo
      })
    }
    await user.save()
    res.cookie('token', token, {
      maxAge,
      httpOnly: true
    })
    let referer = '/manage/'
    if (req.cookies.referer) {
      referer = req.cookies.referer
      res.clearCookie('referer')
    }
    res.redirect(referer)
  } else {
    fail({
      error: 'userAuthError'
    }, req, res)
  }
}

export function fail (error, req, res) {
  res.json(error)
}
