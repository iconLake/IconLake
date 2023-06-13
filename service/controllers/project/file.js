import { completeURL, save } from '../../utils/file.js'

/**
 * @api {post} /project/file/upload 获取图标信息
 */
export async function upload (req, res) {
  if (!req.query.projectId || !req.query._id) {
    res.json({
      error: 'argsError'
    })
  }
  const projectId = req.query.projectId
  const _id = req.query._id
  const data = await save(_id, req.body, `icon/${projectId}/`)
  res.json({
    key: data.key,
    url: completeURL(data.key)
  })
}
