import { ERROR_CODE } from '../../utils/const.js'
import { completeURL, save } from '../../utils/file.js'

/**
 * @api {post} /user/file/upload 上传
 */
export async function upload (req, res) {
  const _id = req.query._id
  const dirs = {
    theme: true,
    avatar: true
  }
  const data = await save(_id, req.body, `${(req.query.dir && dirs[req.query.dir]) ? req.query.dir : 'avatar'}/${req.user._id}/`).catch((e) => {
    console.error(e)
    res.json({
      error: ERROR_CODE.FAIL
    })
  })
  if (data) {
    res.json({
      key: data.key,
      url: completeURL(data.key)
    })
  }
}
