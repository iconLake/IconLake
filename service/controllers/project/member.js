import { Project } from '../../models/project.js'
import { User } from '../../models/user.js'
import { ERROR_CODE } from '../../utils/const.js'

/**
 * @api {get} /project/member/list 成员列表
 */
export async function list (req, res) {
  if (typeof req.query._id !== 'string' || req.query._id.length === 0) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const data = await Project.findOne({
    _id: req.query._id,
    'members.userId': req.user._id
  }, 'members')
  if (!data) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  const list = await Promise.all(data.members.map(async (e) => {
    const info = e.toJSON()
    const user = await User.findById(info.userId, 'name avatar')
    info.user = user.toJSON()
    delete info.user._id
    return info
  }))
  res.json(list)
}

/**
 * @api {post} /project/member/del 删除成员
 * @apiBody {string} projectId
 * @apiBody {string} _id
 */
export async function del (req, res) {
  if (typeof req.body.projectId !== 'string' || typeof req.body._id !== 'string' ||
  !req.body.projectId || !req.body._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, {
    $pull: {
      members: {
        _id: req.body._id
      }
    }
  })
  if (result.matchedCount === 0) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  res.json(result.modifiedCount === 1 ? {} : { error: ERROR_CODE.FAIL })
}
