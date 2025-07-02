import { User } from '../../models/user.js'
import { ERROR_CODE } from '../../utils/const.js'
import crypto from 'crypto'

/**
 * @api {get} /user/setting/unbind 解绑
 */
export async function unbind (req, res) {
  const type = req.query.type
  const types = ['github', 'gitee', 'blockchain', 'code', 'google', 'webAuthn']
  if (!types.includes(type)) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  let bindCount = 0
  const user = await User.findById(req.user._id, types.join(' '))
  types.forEach(t => {
    if (user[t].id) {
      bindCount++
    }
  })
  if (bindCount <= 1) {
    res.json({
      error: ERROR_CODE.FAIL
    })
    return
  }
  user[type] = undefined
  await user.save()
  res.json({})
}

/**
 * @api {get} /user/setting/regenAccessKey 重新生成 accessKey
 */
export async function regenAccessKey (req, res) {
  const accessKey = crypto.randomBytes(16).toString('hex')
  const result = await User.updateOne({
    _id: req.user._id
  }, {
    $set: {
      'accessKey.id': accessKey
    }
  })
  if (result.modifiedCount === 0) {
    res.json({
      error: ERROR_CODE.FAIL
    })
    return
  }
  res.json({
    accessKey
  })
}
