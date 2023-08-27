import { Project } from '../../models/project.js'

/**
 * @api {get} /project/list 获取项目列表
 */
export async function list (req, res) {
  const list = await Project.find({
    members: {
      $elemMatch: {
        userId: req.user._id
      }
    }
  }, req.query.fields ?? '_id name desc createTime icons sources')
  res.json({
    list: list.map(e => {
      const info = e.toJSON()
      if (info.icons) {
        info.icons = info.icons.slice(0, 15)
      }
      return info
    })
  })
}
