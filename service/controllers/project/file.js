import { ERROR_CODE } from '../../utils/const.js'
import { completeURL, save } from '../../utils/file.js'
import { Project } from '../../models/project.js'
import { getStorageInfo, updateStorageInfo } from '../user/file.js'

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
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, '_id')
  if (!p) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }

  const storageUsage = await getStorageInfo({
    userId: req.user._id
  })
  if (storageUsage.free <= 0) {
    res.json({
      error: ERROR_CODE.STORAGE_LIMITED
    })
    return
  }

  const _id = req.query._id
  const dirs = {
    icon: true,
    cover: true,
    theme: true
  }
  const dir = `${(req.query.dir && dirs[req.query.dir]) ? req.query.dir : 'icon'}`
  const data = await save(_id, req.body, `${dir}/${projectId}/`).catch((e) => {
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
    updateStorageInfo({
      userId: req.user._id
    })
  }
}

export async function storageInfo (req, res) {
  const usage = await getStorageInfo({
    userId: req.user._id,
    projectId: req.query.projectId
  })
  res.json(usage)
}
