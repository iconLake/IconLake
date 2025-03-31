import { ERROR_CODE } from '../../utils/const.js'
import { completeURL, countDir, save } from '../../utils/file.js'
import { Project } from '../../models/project.js'
import { getConfig } from '../../config/index.js'

const config = getConfig()

/**
 * @api {post} /project/file/upload 上传
 */
export async function upload (req, res) {
  if (!req.query.projectId || !req.query._id) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const projectId = req.query.projectId
  const p = await Project.findOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id
      }
    }
  }, '_id')
  if (!p) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  const _id = req.query._id
  const dirs = {
    icon: true,
    cover: true,
    theme: true
  }
  const data = await save(_id, req.body, `${(req.query.dir && dirs[req.query.dir]) ? req.query.dir : 'icon'}/${projectId}/`).catch((e) => {
    console.error(e)
    res.json({
      error: ERROR_CODE.FAIL
    })
  })
  if (data) {
    res.json({
      key: data.key,
      url: completeURL(data.key)
    })
  }
}

export async function storageInfo (req, res) {
  const usage = {
    icon: {
      count: 0,
      size: BigInt(0)
    },
    cover: {
      count: 0,
      size: BigInt(0)
    },
    theme: {
      count: 0,
      size: BigInt(0)
    }
  }
  const q = {
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }
  if (req.query.projectId) {
    q._id = req.query.projectId
  }
  const projects = await Project.find(q, '_id')
  for (const project of projects) {
    for (const cat of Object.keys(usage)) {
      const data = await countDir(`${cat}/${project._id}/`)
      usage[cat].count += data.count
      usage[cat].size += data.size
    }
  }
  res.json({
    limit: config.storage.limit,
    free: req.query.projectId ? undefined : (BigInt(config.storage.limit) - usage.icon.size - usage.cover.size - usage.theme.size).toString(),
    icon: {
      count: usage.icon.count,
      size: usage.icon.size.toString()
    },
    cover: {
      count: usage.cover.count,
      size: usage.cover.size.toString()
    },
    theme: {
      count: usage.theme.count,
      size: usage.theme.size.toString()
    }
  })
}
