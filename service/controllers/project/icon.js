import { Analyse } from '../../models/analyse.js'
import { History } from '../../models/history.js'
import { Project } from '../../models/project.js'
import { ERROR_CODE, PERMAMENT_FILES_MAX_NUM, PERMANENT_FILE_EXPIRE } from '../../utils/const.js'
import { genCSS, genJS, genReact, genVUE } from './icon/gen/index.js'

/**
 * @api {get} /project/icon/info 获取图标信息
 */
export async function info (req, res) {
  if (typeof req.query.projectId !== 'string' || !req.query.projectId ||
  typeof req.query._id !== 'string' || !req.query._id) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
    'members.userId': req.user._id
  }, 'icons')
  if (!project) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const info = project.icons.id(req.query._id)
  res.json({
    info
  })
}

/**
 * @api {post} /project/icon/add 添加图标
 */
export async function add (req, res) {
  const icons = req.body.icons
  const _id = req.body.projectId
  if (typeof _id !== 'string' || _id.length === 0 || !(icons instanceof Array) || icons.length === 0) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findById(_id, 'iconIndex')
  const startIndex = project.iconIndex
  icons.forEach((e, i) => {
    e.unicode = (startIndex + i).toString(16)
  })
  await Project.updateOne({
    _id
  }, {
    $push: {
      icons: {
        $each: icons
      }
    },
    $inc: {
      iconIndex: icons.length
    },
    $set: {
      iconUpdateTime: new Date()
    }
  })
  res.json({})
}

/**
 * @api {post} /project/icon/del 删除图标
 */
export async function del (req, res) {
  const _ids = req.body._ids
  const projectId = req.body.projectId
  if (!projectId || !(_ids instanceof Array) || _ids.length === 0) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findById(projectId, 'members icons')
  const uid = req.user.id
  if (!project || !project.members.some(e => e.isAdmin && e.userId.toString() === uid)) {
    res.json({
      error: 'noPermission'
    })
    return
  }
  await Project.updateOne({
    _id: projectId
  }, {
    $pull: {
      icons: {
        _id: {
          $in: _ids
        }
      }
    },
    $set: {
      iconUpdateTime: new Date()
    }
  })
  // 记录历史
  const icons = []
  _ids.forEach(e => {
    icons.push(project.icons.id(e))
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
  res.json({})
}

/**
 * @api {post} /project/icon/edit 编辑图标信息
 */
export async function edit (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId || typeof req.body._id !== 'string' || !req.body._id) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  let isEmpty = true
  const $set = {}
  if (req.body.name) {
    $set['icons.$.name'] = req.body.name
    isEmpty = false
  }
  if (req.body.code) {
    $set['icons.$.code'] = req.body.code
    $set.iconUpdateTime = new Date()
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.ARGS_ERROR })
}

/**
 * @api {post} /project/icon/addTag 添加标签
 */
export async function addTag (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  typeof req.body._id !== 'string' || !req.body._id ||
  typeof req.body.tag !== 'string' || !req.body.tag) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.ARGS_ERROR })
}

/**
 * @api {post} /project/icon/delTag 删除标签
 */
export async function delTag (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  typeof req.body._id !== 'string' || !req.body._id ||
  typeof req.body.tag !== 'string' || !req.body.tag) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.ARGS_ERROR })
}

/**
 * @api {get} /project/icon/pages 获取引用图标的页面
 */
export async function pages (req, res) {
  if (typeof req.query.projectId !== 'string' || !req.query.projectId ||
  typeof req.query._id !== 'string' || !req.query._id) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
    'members.userId': req.user._id
  }, '_id')
  if (!project) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
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
      error: ERROR_CODE.ARGS_ERROR
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.ARGS_ERROR })
}

/**
 * @api {post} /project/icon/gen 生成字体或者js
 */
export async function gen (req, res) {
  const { projectId, type } = req.body
  if (!projectId || !type || !/^(js|css|vue|react)$/.test(type)) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findById(projectId, 'class prefix icons files')
  if (!project) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  if (project.icons.length === 0 && /^(js|css)$/.test(type)) {
    res.json({
      error: ERROR_CODE.FAIL
    })
    return
  }
  const fn = {
    css: genCSS,
    js: genJS,
    vue: genVUE,
    react: genReact
  }
  fn[type](req, res, projectId, project)
}

/**
 * @api {post} /project/icon/setExpire 设置有效期
 */
export async function setExpire (req, res) {
  const { projectId, fileId, fileType, expire } = req.body
  if (!projectId || !fileId || !expire || (fileType !== 'js' && fileType !== 'css')) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const project = await Project.findById(projectId, 'files')
  if (project.files && project.files[fileType]) {
    const n = project.files[fileType].reduce((pre, cur) => {
      return pre + (cur.expire >= PERMANENT_FILE_EXPIRE ? 1 : 0)
    }, 0)
    if (n >= PERMAMENT_FILES_MAX_NUM) {
      return res.json({ error: ERROR_CODE.FAIL })
    }
  }
  const result = await Project.updateOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    },
    [`files.${fileType}._id`]: fileId
  }, {
    $set: {
      [`files.${fileType}.$.expire`]: expire
    }
  })
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.FAIL })
}
