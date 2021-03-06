import { Analyse } from '../../models/analyse.js'
import { Project } from '../../models/project.js'

/**
 * @api {get} /project/icon/info 获取图标信息
 */
export async function info (req, res) {
  if (typeof req.query.projectId !== 'string' || !req.query.projectId ||
  typeof req.query._id !== 'string' || !req.query._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
    'members.userId': req.user._id
  }, 'icons sources')
  if (!project) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const info = project.icons.id(req.query._id)
  const source = info.sourceId ? project.sources.id(info.sourceId) : {}
  res.json({
    info,
    source
  })
}

/**
 * @api {post} /project/icon/del 删除图标
 */
export async function del (req, res) {
  const _ids = req.body._ids
  const projectId = req.body.projectId
  if (!projectId || !(_ids instanceof Array) || _ids.length === 0) {
    res.json({
      error: 'argsError'
    })
    return
  }
  await Project.updateOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, {
    $pull: {
      icons: {
        _id: {
          $in: _ids
        }
      }
    }
  })
  res.json({})
}

/**
 * @api {post} /project/icon/edit 编辑图标信息
 */
export async function edit (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId || typeof req.body._id !== 'string' || !req.body._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  let isEmpty = true
  const $set = {}
  if (req.body.name) {
    $set['icons.$.name'] = req.body.name
    isEmpty = false
  }
  if (typeof req.body.groupId === 'string') {
    $set['icons.$.groupId'] = req.body.groupId ? req.body.groupId : null
    isEmpty = false
  }
  if (isEmpty) {
    res.json({})
    return
  }
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    },
    'icons._id': req.body._id
  }, {
    $set
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}

/**
 * @api {post} /project/icon/addTag 添加标签
 */
export async function addTag (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  typeof req.body._id !== 'string' || !req.body._id ||
  typeof req.body.tag !== 'string' || !req.body.tag) {
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
    },
    'icons._id': req.body._id
  }, {
    $push: {
      'icons.$.tags': req.body.tag
    }
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}

/**
 * @api {post} /project/icon/delTag 删除标签
 */
export async function delTag (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  typeof req.body._id !== 'string' || !req.body._id ||
  typeof req.body.tag !== 'string' || !req.body.tag) {
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
    },
    'icons._id': req.body._id
  }, {
    $pull: {
      'icons.$.tags': req.body.tag
    }
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}

/**
 * @api {get} /project/icon/pages 获取引用图标的页面
 */
export async function pages (req, res) {
  if (typeof req.query.projectId !== 'string' || !req.query.projectId ||
  typeof req.query._id !== 'string' || !req.query._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
    'members.userId': req.user._id
  }, '_id')
  if (!project) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const analyse = await Analyse.findById(req.query.projectId)
  let pages = []
  if (analyse) {
    const iconAnalyse = analyse.icons.id(req.query._id)
    pages = iconAnalyse ? iconAnalyse.pages : []
  }
  res.json({
    updateTime: analyse.updateTime,
    pages
  })
}

/**
 * @api {post} /project/icon/batchGroup 批量分组
 */
export async function batchGroup (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  !(req.body._ids instanceof Array) || req.body._ids.length === 0 || req.body._ids.some(e => typeof e !== 'string')) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const $set = {
    'icons.$[element].groupId': req.body.groupId || null
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
    $set
  }, {
    arrayFilters: [
      {
        'element._id': { $in: req.body._ids }
      }
    ]
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}
