import { nanoid } from 'nanoid'
import { User } from '../../models/user.js'
import { completeURL } from '../../utils/file.js'

/**
 * @api {get} /user/info 获取用户信息
 */
export async function info (req, res) {
  const user = (await User.findById(req.user._id, 'name avatar tokenExpire blockchain.id')).toJSON()
  if (user.avatar) {
    user.avatar = completeURL(user.avatar)
  }
  res.json(user)
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
