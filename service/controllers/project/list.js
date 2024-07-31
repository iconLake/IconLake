import { Project } from '../../models/project.js'
import { completeURL } from '../../utils/file.js'

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
  }, req.query.fields ?? '_id type name desc cover createTime icons.svg')
  res.json({
    list: list.map(e => {
      const info = e.toJSON()
      if (info.icons) {
        info.icons = info.icons.slice(0, 15).map(icon => {
          if (icon.svg) {
            icon.svg.url = completeURL(icon.svg.url)
          }
          return icon
        })
      }
      if (info.cover) {
        info.cover = completeURL(info.cover)
      }
      return info
    }).reverse()
  })
}
