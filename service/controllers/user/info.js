import { nanoid } from 'nanoid'
import { User } from '../../models/user.js'
import { completeURL } from '../../utils/file.js'

/**
 * @api {get} /user/info 获取用户信息
 */
export async function info (req, res) {
  const fields = [
    'name',
    'avatar',
    'tokenExpire',
    'blockchain.id',
    'gitee.id',
    'gitee.name',
    'gitee.avatar',
    'github.id',
    'github.name',
    'github.avatar',
    'code.id'
  ]
  const user = (await User.findById(req.user._id, fields.join(' '))).toJSON()
  if (user.avatar) {
    user.avatar = completeURL(user.avatar)
  }
  if (user.gitee?.avatar) {
    user.gitee.avatar = completeURL(user.gitee.avatar)
  }
  if (user.github?.avatar) {
    user.github.avatar = completeURL(user.github.avatar)
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
