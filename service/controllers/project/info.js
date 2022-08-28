import filterObject from 'filter-obj'
import { getConfig } from '../../config/index.js'
import { Analyse } from '../../models/analyse.js'
import { Project } from '../../models/project.js'
import { FILES_MAX_LENGTH } from '../../utils/const.js'
import { isActive as isCosActive } from '../../utils/cos.js'
import { deleteProjectDir } from './icon/gen/index.js'

const config = getConfig()

/**
 * @api {get} /project/info/:id 获取项目信息
 * @apiParam {string} id
 */
export async function info (req, res) {
  if (!req.params.id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const fields = (typeof req.query.fields === 'string' && req.query.fields.length > 0) ? req.query.fields : '_id name desc'
  const project = await Project.findOne({
    _id: req.params.id,
    members: {
      $elemMatch: {
        userId: req.user._id
      }
    }
  }, fields)
  if (project) {
    const result = project.toJSON()
    if (result.icons && result.icons.length > 0) {
      const analyse = await Analyse.findById(req.params.id)
      if (analyse && analyse.icons && analyse.icons.length > 0) {
        result.icons.forEach(e => {
          if (!e.analyse) {
            e.analyse = {}
          }
          const anaIcon = analyse.icons.id(e._id)
          e.analyse.pageCount = anaIcon ? anaIcon.pages.length : 0
        })
      }
    }
    if (/file/.test(fields) && !result.file) {
      result.file = {}
    }
    if ('file' in result) {
      result.file.domain = isCosActive ? config.cos.domain : config.domain
      result.file.maxLength = FILES_MAX_LENGTH
    }
    res.json(result)
  } else {
    res.json({
      error: 'projectNotExist'
    })
  }
}

/**
 * @api {post} /project/info/edit 编辑项目信息
 */
export async function edit (req, res) {
  let _id = req.body._id
  const data = filterObject(req.body, ['name', 'desc', 'class', 'prefix'])
  if (typeof _id === 'string' && _id.length > 0) {
    await Project.updateOne({
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
  } else {
    data.userId = req.user._id
    data.createTime = new Date()
    data.members = [
      { userId: req.user._id, isAdmin: true }
    ]
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
      error: 'argsError'
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
  res.json(result.deletedCount === 1 ? {} : { error: 'delFail' })
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
      error: 'argsError'
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
      sources: [],
      groups: []
    }
  })
  res.json(result.modifiedCount === 1 ? {} : { error: 'cleanFail' })
  deleteProjectDir(req.body._id)
}
