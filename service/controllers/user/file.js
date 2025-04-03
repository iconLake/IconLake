import { Project } from '../../models/project.js'
import { ERROR_CODE } from '../../utils/const.js'
import { completeURL, countDir, save } from '../../utils/file.js'

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
  }
  const projects = await Project.find(q, '_id')
  for (const project of projects) {
    for (const cat of Object.keys(usage)) {
      const data = await countDir(`${cat}/${project._id}/`)
      usage[cat].count += data.count
      usage[cat].size += data.size
    }
  }
  return usage
}
