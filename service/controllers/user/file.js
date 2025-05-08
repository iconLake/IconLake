import { getConfig } from '../../config/index.js'
import { Project } from '../../models/project.js'
import { Usage } from '../../models/usage.js'
import { ERROR_CODE } from '../../utils/const.js'
import { completeURL, countDir, save } from '../../utils/file.js'

const config = getConfig()

/**
 * @api {post} /user/file/upload 上传
 */
export async function upload (req, res) {
  const _id = req.query._id
  const dirs = {
    theme: true,
    avatar: true
  }
  const data = await save(_id, req.body, `${(req.query.dir && dirs[req.query.dir]) ? req.query.dir : 'avatar'}/${req.user._id}/`).catch((e) => {
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

export async function getStorageInfo ({ userId, projectId }) {
  const usage = {
    total: 0,
    free: 0,
    used: 0,
    icon: {
      count: 0,
      size: 0
    },
    cover: {
      count: 0,
      size: 0
    },
    theme: {
      count: 0,
      size: 0
    }
  }
  const q = {
    members: {
      $elemMatch: {
        userId,
        isAdmin: true
      }
    }
  }
  if (projectId) {
    q._id = projectId
    const projects = await Project.find(q, '_id')
    for (const project of projects) {
      for (const cat of ['icon', 'cover', 'theme']) {
        const data = await countDir(`${cat}/${project._id}/`)
        usage[cat].count += data.count
        usage[cat].size += data.size
      }
    }
    usage.used = usage.icon.size + usage.cover.size + usage.theme.size
  } else {
    const res = await Usage.findOne({ user: userId }, 'storage')
    res && Object.assign(usage, res.storage)
  }
  if (!usage.total) {
    usage.total = config.storage.freeQuota
  }
  usage.free = usage.total - usage.used
  return usage
}

export async function updateStorageInfo ({ userId }) {
  const q = {
    members: {
      $elemMatch: {
        userId,
        isAdmin: true
      }
    }
  }
  const projects = await Project.find(q, '_id')
  const $set = {
    'storage.used': 0,
    'storage.icon.count': 0,
    'storage.icon.size': 0,
    'storage.cover.count': 0,
    'storage.cover.size': 0,
    'storage.theme.count': 0,
    'storage.theme.size': 0
  }
  for (const project of projects) {
    for (const cat of ['icon', 'cover', 'theme']) {
      const data = await countDir(`${cat}/${project._id}/`)
      $set[`storage.${cat}.count`] += data.count
      $set[`storage.${cat}.size`] += data.size
      $set['storage.used'] += data.size
    }
  }
  await Usage.updateOne({ user: userId }, {
    $set
  })
}
