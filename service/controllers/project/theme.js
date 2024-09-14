import { includeKeys } from 'filter-obj'
import { Project } from '../../models/project.js'
import { ERROR_CODE } from '../../utils/const.js'

/**
 * @api {post} /project/theme/edit 修改主题
 */
export async function edit (req, res) {
  const projectId = req.body.projectId
  if (!projectId) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const theme = includeKeys(req.body, ['class', 'nft'])
  const result = await Project.updateOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
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
 * @api {get} /project/theme/components 主题
 */
export async function components (req, res) {
  const id = req.query.id
  if (!id) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findById(id, 'theme')
  res.json(project ? project.theme : {})
}
