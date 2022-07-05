import mongoose from 'mongoose'
import { History } from '../../models/history.js'
import { Project } from '../../models/project.js'
import { sourceEqual } from '../../utils/index.js'

/**
 * 存档源
 * @param {string} projectId 项目ID
 * @param {object} sourceOld 源
 */
async function saveSourceHistory (projectId, sourceOld) {
  let info = await History.findById(projectId)
  const source = JSON.parse(JSON.stringify(sourceOld))
  source._id = new mongoose.Types.ObjectId()
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
  return source
}

/**
 * 存档图标
 * @param {string} projectId 项目ID
 * @param {string} sourceIdOld 旧的源ID
 * @param {string} sourceIdNew 新的源ID
 */
async function saveIconHistoryBySource (projectId, sourceIdOld, sourceIdNew) {
  const project = await Project.findById(projectId, 'icons')
  const icons = []
  for (let i = project.icons.length - 1; i > -1; --i) {
    if (project.icons[i].sourceId.toString() === sourceIdOld) {
      project.icons[i].sourceId = sourceIdNew
      icons.push(project.icons[i])
      project.icons.splice(i, 1)
    }
  }
  if (icons.length > 0) {
    await Project.updateOne({
      _id: projectId
    }, {
      $set: {
        icons: project.icons
      }
    })
    await History.updateOne({
      _id: projectId
    }, {
      $push: {
        icons: {
          $each: icons
        }
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
        await saveSourceHistory(req.body.projectId, sourceOld)
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
    const sourceNew = await saveSourceHistory(req.body.projectId, sourceOld)
    // 关联的所有图标全部删除，并且记录历史
    await saveIconHistoryBySource(req.body.projectId, sourceOld._id.toString(), sourceNew._id.toString())
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
