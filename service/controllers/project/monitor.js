import { Project } from '../../models/project.js'

/**
 * @api {post} /project/monitor/edit 编辑项目信息
 */
export async function edit (req, res) {
  if (typeof req.body._id !== 'string' || req.body._id.length === 0) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const monitor = {}
  if (typeof req.body.isOn === 'boolean') {
    monitor.isOn = req.body.isOn
  }
  if (typeof req.body.spider === 'string') {
    monitor.spider = req.body.spider
  }
  await Project.updateOne({
    _id: req.body._id,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, {
    $set: {
      monitor
    }
  })
  res.json({})
}
