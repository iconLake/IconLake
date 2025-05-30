import { Analyse } from '../../models/analyse.js'
import { History } from '../../models/history.js'
import { Project } from '../../models/project.js'
import { ERROR_CODE, PERMAMENT_FILES_MAX_NUM, PERMANENT_FILE_EXPIRE } from '../../utils/const.js'
import { completeURL, remove, slimURL } from '../../utils/file.js'
import { genCSS, genJS, genReact, genVUE } from './icon/gen/index.js'
import { middleware as userMiddleware } from '../user/middleware.js'
import { updateStorageInfo } from '../user/file.js'

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
  let project = await Project.findOne({
    _id: req.query.projectId
  }, 'icons isPublic')
  if (!project) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  if (!project.isPublic) {
    await userMiddleware(req, res, () => {})
    project = await Project.findOne({
      _id: req.query.projectId,
      'members.userId': req.user._id
    }, 'icons')
    if (!project) {
      res.json({
        error: ERROR_CODE.PERMISSION_DENIED
      })
      return
    }
  }
  const info = project.icons.id(req.query._id)
  if (info && info.svg && info.svg.url) {
    info.svg.url = completeURL(info.svg.url)
  }
  if (info && info.img && info.img.url) {
    info.img.url = completeURL(info.img.url)
  }
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
    if (typeof e.svg?.url === 'string') {
      e.svg.url = slimURL(e.svg.url)
    }
    if (typeof e.img?.url === 'string') {
      e.img.url = slimURL(e.img.url)
    }
  })
  const result = await Project.updateOne({
    _id,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
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
  res.json(result.matchedCount > 0 ? {} : ERROR_CODE.PERMISSION_DENIED)
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
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  const result = await Project.updateOne({
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
    },
    $set: {
      iconUpdateTime: new Date()
    }
  })
  if (result.matchedCount === 0) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  res.json({})
  // 删除的icon
  const icons = []
  _ids.forEach(e => {
    icons.push(project.icons.id(e))
  })
  // 删除文件
  const files = []
  icons.forEach(e => {
    if (typeof e.svg?.url === 'string') {
      files.push(e.svg.url)
    }
    if (typeof e.img?.url === 'string') {
      files.push(e.img.url)
    }
  })
  if (files.length > 0) {
    await remove(files)
    updateStorageInfo({
      userId: req.user._id
    })
  }
  // 记录历史
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
  if (typeof req.body.name === 'string') {
    $set['icons.$.name'] = req.body.name
    isEmpty = false
  }
  if (typeof req.body.code === 'string') {
    $set['icons.$.code'] = req.body.code
    $set.iconUpdateTime = new Date()
    isEmpty = false
  }
  if (typeof req.body.groupId === 'string') {
    $set['icons.$.groupId'] = req.body.groupId ? req.body.groupId : null
    isEmpty = false
  }
  if (typeof req.body.txHash === 'string') {
    $set['icons.$.txHash'] = req.body.txHash
    isEmpty = false
  }
  if (typeof req.body.svg?.url === 'string') {
    $set['icons.$.svg.url'] = slimURL(req.body.svg.url)
    $set.iconUpdateTime = new Date()
    $set['icons.$.txHash'] = ''
    isEmpty = false
  }
  if (typeof req.body.img?.url === 'string') {
    $set['icons.$.img.url'] = slimURL(req.body.img.url)
    $set.iconUpdateTime = new Date()
    $set['icons.$.txHash'] = ''
    isEmpty = false
  }
  if (isEmpty) {
    res.json({})
    return
  }
  // 旧文件
  const oldFiles = []
  if (typeof req.body.svg?.url === 'string' || typeof req.body.img?.url === 'string') {
    const oldProject = await Project.findById(req.body.projectId, 'icons')
    const icon = oldProject.icons.id(req.body._id)
    if (typeof req.body.svg?.url === 'string' && icon.svg?.url && req.body.svg?.url !== icon.svg.url) {
      oldFiles.push(icon.svg.url)
    }
    if (typeof req.body.img?.url === 'string' && icon.img?.url && req.body.img?.url !== icon.img.url) {
      oldFiles.push(icon.img.url)
    }
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.PERMISSION_DENIED })
  // 删除旧文件
  if (oldFiles.length) {
    await remove(oldFiles)
  }
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.PERMISSION_DENIED })
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.PERMISSION_DENIED })
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
    const project = await Project.findOne({
      _id: req.query.projectId
    }, 'isPublic')
    if (project && project.isPublic) {
      res.json({
        pages: []
      })
      return
    }
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
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
    updateTime: analyse?.updateTime,
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.PERMISSION_DENIED })
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
  const project = await Project.findOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, 'class prefix icons files')
  if (!project) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
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
  res.json(result.matchedCount > 0 ? {} : { error: ERROR_CODE.PERMISSION_DENIED })
}
