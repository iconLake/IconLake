import { includeKeys } from 'filter-obj'
import { getConfig } from '../../config/index.js'
import { Project } from '../../models/project.js'
import { ERROR_CODE, PERMAMENT_FILES_MAX_NUM, PROJECT_TYPE, PROJECT_STYLE } from '../../utils/const.js'
import { isActive as isCosActive } from '../../utils/cos.js'
import { deleteProjectDir } from './icon/gen/index.js'
import { middleware as userMiddleware } from '../user/middleware.js'
import { completeURL, slimURL } from '../../utils/file.js'
const config = getConfig()

/**
 * @api {get} /project/info/:id 获取项目信息
 * @apiParam {string} id
 */
export async function info (req, res) {
  if (!req.params.id) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const fields = `${
    (typeof req.query.fields === 'string' && req.query.fields.length > 0)
    ? req.query.fields
    : '_id name desc'
  } isPublic members`
  const project = await Project.findOne({
    _id: req.params.id
  }, fields)
  if (project) {
    if (!project.isPublic) {
      await userMiddleware(req, res, () => {})
      if (!project.members.some(e => e.userId.equals(req.user._id))) {
        res.json({
          error: ERROR_CODE.PERMISSION_DENIED
        })
        return
      }
    }
    if (!project.invite?.$isEmpty() || !project.storage?.$isEmpty()) {
      if (!req.user?._id) {
        await userMiddleware(req, res, () => {})
      }
      const member = project.members.find(e => e.userId.equals(req.user._id))
      if (!member || !member.isAdmin) {
        res.json({
          error: ERROR_CODE.PERMISSION_DENIED
        })
        return
      }
    }
    const result = project.toJSON()
    if (result.icons && result.icons.length > 0) {
      result.icons.forEach(e => {
        if (!e._id) {
          return
        }
        if (e.svg && e.svg.url) {
          e.svg.url = completeURL(e.svg.url)
        }
        if (e.img && e.img.url) {
          e.img.url = completeURL(e.img.url)
        }
      })
    }
    if (/files/.test(fields) && !result.files) {
      result.files = {}
    }
    if ('files' in result) {
      result.files.domain = isCosActive ? config.cos.domain : config.domain
      result.files.permamentMaxNum = PERMAMENT_FILES_MAX_NUM
    }
    if ('cover' in result) {
      result.cover = completeURL(result.cover)
    }
    res.json(result)
  } else {
    res.json({
      error: ERROR_CODE.NOT_EXIST
    })
  }
}

/**
 * @api {post} /project/info/edit 编辑项目信息
 */
export async function edit (req, res) {
  let _id = req.body._id
  const data = includeKeys(req.body, [
    'name',
    'desc',
    'class',
    'prefix',
    'cover',
    'isPublic',
    'style.list',
    'storage.api',
    'storage.token'
  ])
  if (typeof _id === 'string' && _id.length > 0) {
    if ('cover' in data) {
      data.cover = slimURL(data.cover)
    }
    const result = await Project.updateOne({
      _id,
      members: {
        $elemMatch: {
          userId: req.user._id,
          isAdmin: true
        }
      }
    }, {
      $set: data
    })
    if (result.matchedCount === 0) {
      res.json({
        error: ERROR_CODE.PERMISSION_DENIED
      })
      return
    }
  } else {
    data.userId = req.user._id
    data.createTime = new Date()
    data.members = [
      { userId: req.user._id, isAdmin: true }
    ]
    const types = [false, true, true]
    data.type = types[req.body.type] ? req.body.type : 1
    data.style = {
      list: data.type === PROJECT_TYPE.IMG ? PROJECT_STYLE.TIDY : PROJECT_STYLE.DEFAULT
    }
    const p = new Project(data)
    _id = p._id
    await p.save()
  }
  res.json({
    _id
  })
}

/**
 * @api {post} /project/del 删除项目
 * @apiBody {string} _id
 * @apiBody {string} name
 */
export async function del (req, res) {
  if (typeof req.body._id !== 'string' || typeof req.body.name !== 'string' || !req.body._id || !req.body.name) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await Project.deleteOne({
    _id: req.body._id,
    name: req.body.name,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  })
  if (result.deletedCount === 0) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  res.json({})
  deleteProjectDir(req.body._id)
}

/**
 * @api {post} /project/clean 清空项目
 * @apiBody {string} _id
 * @apiBody {string} name
 */
export async function clean (req, res) {
  if (typeof req.body._id !== 'string' || typeof req.body.name !== 'string' || !req.body._id || !req.body.name) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await Project.updateOne({
    _id: req.body._id,
    name: req.body.name,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, {
    $set: {
      icons: [],
      groups: []
    }
  })
  if (result.matchedCount === 0) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  res.json(result.modifiedCount === 1 ? {} : { error: ERROR_CODE.FAIL })
  deleteProjectDir(req.body._id)
}
