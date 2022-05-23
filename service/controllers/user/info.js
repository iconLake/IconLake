import { nanoid } from 'nanoid'
import { TOKEN_MAX_AGE } from '../../utils/const.js'

/**
 * @api {get} /user/info 获取用户信息
 */
export async function info (req, res) {
  if (req.query.retoken) {
    const token = nanoid()
    req.user.token = token
    await req.user.save()
    res.cookie('token', token, {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true
    })
  }
  res.json(req.user.toJSON())
}

/**
 * @api {get} /user/logout 退出登录
 */
export async function logout (req, res) {
  const token = nanoid()
  req.user.token = token
  await req.user.save()
  res.clearCookie('token')
  res.json({})
}
