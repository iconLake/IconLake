import { Project } from '../../models/project.js'
import { ERROR_CODE } from '../../utils/const.js'

/**
 * @api {post} /icon/info/edit 编辑图标信息
 */
export async function edit (req, res) {
  if (typeof req.body._id !== 'string' || typeof req.body.projectId !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const data = {};
  ['name'].forEach(e => {
    if (e in req.body) {
      data[`icons.$.${e}`] = req.body[e]
    }
  })
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id // 项目成员就可以修改图标信息
      }
    },
    'icons._id': req.body._id
  }, {
    $set: data
  })
  res.json(result.matchedCount === 0 ? { error: ERROR_CODE.NOT_EXIST } : { _id: req.body._id })
}
