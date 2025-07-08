import { nanoid } from 'nanoid'
import { User } from '../../models/user.js'
import { completeURL } from '../../utils/file.js'
import { getStorageInfo } from './file.js'
import { getAIUsage } from '../../utils/ai.js'

/**
 * @api {get} /user/info 获取用户信息
 */
export async function info (req, res) {
  const fields = [
    'name',
    'desc',
    'avatar',
    'medias',
    'sex',
    'birthday',
    'location',
    'tokenExpire',
    'blockchain.id',
    'gitee.id',
    'gitee.name',
    'gitee.avatar',
    'github.id',
    'github.name',
    'github.avatar',
    'code.id',
    'accessKey.id',
    'google.id',
    'google.name',
    'google.avatar',
    'webAuthn.id',
    'mail.id',
    'theme'
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
  if (user.google?.avatar) {
    user.google.avatar = completeURL(user.google.avatar)
  }
  res.json(user)
}

/**
 * @api {post} /user/info/edit 更新用户信息
 */
export async function edit (req, res) {
  const user = await User.findById(req.user._id)
  let isChanged = false
  const keys = ['name', 'desc', 'avatar', 'sex', 'birthday', 'location']
  keys.forEach(key => {
    if (typeof req.body[key] === 'string' && user[key] !== req.body[key]) {
      isChanged = true
      user[key] = req.body[key]
    }
  })
  if (req.body.medias && JSON.stringify(user.medias) !== JSON.stringify(req.body.medias)) {
    isChanged = true
    user.medias = req.body.medias.map((m) => {
      return {
        name: typeof m.name === 'string' ? m.name : '',
        content: typeof m.content === 'string' ? m.content : ''
      }
    })
  }
  if (isChanged) {
    await user.save()
  }
  res.json({})
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

/**
 * @api {get} /user/info/usage 获取用户使用情况
 */
export async function usage (req, res) {
  const params = {
    userId: req.user._id
  }
  const storageInfo = await getStorageInfo(params)
  const aiInfo = await getAIUsage({ ...params, fields: 'ai.tokens' })
  res.json({
    storage: storageInfo,
    ai: aiInfo
  })
}
