import { includeKeys } from 'filter-obj'
import mongoose from 'mongoose'
import { Project } from '../../models/project.js'

/**
 * @api {post} /project/group/edit 编辑分组信息
 */
export async function edit (req, res) {
  let _id = req.body._id
  const projectId = req.body.projectId
  if (!projectId) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const data = includeKeys(req.body, ['_id', 'name', 'num'])
  if (typeof _id === 'string' && _id.length > 0) {
    await Project.updateOne({
      _id: projectId,
      members: {
        $elemMatch: {
          userId: req.user._id,
          isAdmin: true
        }
      },
      'groups._id': _id
    }, {
      $set: {
        'groups.$': data
      }
    })
  } else {
    _id = new mongoose.Types.ObjectId()
    data._id = _id
    await Project.updateOne({
      _id: projectId,
      members: {
        $elemMatch: {
          userId: req.user._id,
          isAdmin: true
        }
      }
    }, {
      $push: {
        groups: data
      }
    })
  }
  res.json({
    _id
  })
}

/**
 * @api {post} /project/group/del 删除分组
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
      groups: {
        _id: req.body._id
      }
    }
  })
  res.json(result.modifiedCount === 1 ? {} : { error: 'delFail' })
}
