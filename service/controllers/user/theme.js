import { includeKeys } from 'filter-obj'
import { ERROR_CODE } from '../../utils/const.js'
import { User } from '../../models/user.js'

/**
 * @api {post} /user/theme/edit 修改主题
 */
export async function edit (req, res) {
  const theme = includeKeys(req.body, ['creator'])
  const result = await User.updateOne({
    _id: req.user._id
  }, {
    $set: {
      theme
    }
  })
  res.json(result.modifiedCount > 0
    ? {}
    : {
        error: ERROR_CODE.FAIL
      })
}

/**
 * @api {get} /user/theme/info 主题
 */
export async function info (req, res) {
  const address = req.query.address
  if (!address) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const user = await User.findOne({
    'blockchain.id': address
  }, 'theme')
  res.json(user ? user.theme : {})
}
