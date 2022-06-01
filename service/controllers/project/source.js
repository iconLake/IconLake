import mongoose from 'mongoose'
import { History } from '../../models/history.js'
import { Project } from '../../models/project.js'
import { sourceEqual } from '../../utils/index.js'

/**
 * 保存源的历史记录
 * @param {string} projectId 项目ID
 * @param {object} source 源
 */
async function saveSourceHistory (projectId, source) {
  let info = await History.findById(projectId)
  delete source._id
  if (!info) {
    info = new History({
      _id: projectId,
      sources: [source]
    })
    await info.save()
  } else {
    await History.updateOne({
      _id: projectId
    }, {
      $push: {
        sources: source
      }
    })
  }
}

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
    const info = await Project.findById(req.body.projectId, 'sources')
    if (info) {
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
      // 记录历史
      const sourceOld = info.sources.id(_id).toObject()
      if (!sourceEqual(sourceOld, req.body)) {
        saveSourceHistory(req.body.projectId, sourceOld)
      }
    }
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
  const info = await Project.findById(req.body.projectId, 'sources')
  if (info) {
    // 记录源历史
    const sourceOld = info.sources.id(req.body._id).toObject()
    saveSourceHistory(req.body.projectId, sourceOld)
    // TODO: 关联的所有图标全部删除，并且记录历史
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
