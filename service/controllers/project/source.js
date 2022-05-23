import mongoose from 'mongoose'
import { Project } from '../../models/project.js'

/**
 * @api {post} /project/source/edit 编辑源信息
 */
export async function edit (req, res) {
  if (!req.body.projectId) {
    res.json({
      error: 'argsError'
    })
    return
  }
  let _id = req.body._id
  if (_id) {
    await Project.updateOne({
      _id: req.body.projectId,
      members: {
        $elemMatch: {
          userId: req.user._id,
          isAdmin: true
        }
      },
      'sources._id': _id
    }, {
      $set: {
        'sources.$': req.body
      }
    })
  } else {
    _id = new mongoose.Types.ObjectId()
    req.body._id = _id
    await Project.updateOne({
      _id: req.body.projectId,
      members: {
        $elemMatch: {
          userId: req.user._id,
          isAdmin: true
        }
      }
    }, {
      $push: {
        sources: req.body
      }
    })
  }
  res.json({
    _id
  })
}

/**
 * @api {post} /project/source/del 删除源
 */
export async function del (req, res) {
  if (!req.body.projectId || !req.body._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    },
    'sources._id': req.body._id
  }, {
    $pull: {
      sources: {
        _id: req.body._id
      }
    }
  })
  res.json({})
}
