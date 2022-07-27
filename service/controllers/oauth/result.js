import { nanoid } from 'nanoid'
import { User } from '../../models/user.js'
import { TOKEN_MAX_AGE } from '../../utils/const.js'

/**
 * 生成token
 * @returns {{token: string, tokenExpire: date}}
 */
export function generateToken () {
  return {
    token: nanoid(),
    tokenExpire: new Date(Date.now() + TOKEN_MAX_AGE)
  }
}

/**
 * 设置token
 * @param {Response} res
 * @param {User} user
 */
export function setToken (res, user) {
  res.cookie('token', `${user.id}.${user.token}`, {
    maxAge: TOKEN_MAX_AGE,
    httpOnly: true
  })
}

export async function success (userInfo, req, res) {
  if (userInfo.id && userInfo.from) {
    const { token, tokenExpire } = generateToken()
    let user = await User.findOne({
      [`${userInfo.from}.id`]: userInfo.id
    })
    if (user) {
      userInfo.name && (user.name = userInfo.name)
      userInfo.avatar && (user.avatar = userInfo.avatar)
      user.token = token
      user.tokenExpire = tokenExpire
      user[userInfo.from] = userInfo
    } else {
      user = new User({
        name: userInfo.name,
        avatar: userInfo.avatar,
        token,
        tokenExpire,
        [userInfo.from]: userInfo
      })
    }
    await user.save()
    setToken(res, user)
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
