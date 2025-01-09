import { User } from '../../models/user.js'
import { ERROR_CODE } from '../../utils/const.js'

/**
 * @api {get} /user/setting/unbind 解绑
 */
export async function unbind (req, res) {
  const type = req.query.type
  const types = ['github', 'gitee', 'blockchain', 'code']
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
