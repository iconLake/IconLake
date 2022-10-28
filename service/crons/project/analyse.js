import { Analyse } from '../../models/analyse.js'
import { Visit } from '../../models/visit.js'

export async function analyseProject (project) {
  let analyse = await Analyse.findById(project._id)
  if (!analyse) {
    analyse = new Analyse({
      _id: project._id,
      updateTime: new Date(),
      icons: []
    })
    await analyse.save()
  }
  if (project.icons.length > 0) {
    for (let index = 0; index < project.icons.length; index++) {
      const icon = project.icons[index]
      const visit = await Visit.aggregate([
        {
          $match: {
            projectId: project._id,
            code: icon.code,
            prefix: project.prefix,
            class: project.class,
            time: {
              $gt: new Date(Date.now() - 30 * 24 * 3600 * 1000)
            }
          }
        },
        {
          $sort: {
            time: -1
          }
        },
        {
          $group: {
            _id: '$url',
            url: {
              $first: '$url'
            },
            count: {
              $first: '$count'
            },
            time: {
              $first: '$time'
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])
      let analyseIcon = analyse.icons.id(icon._id)
      if (!analyseIcon) {
        analyseIcon = {
          _id: icon._id,
          pages: []
        }
        analyse.icons.push(analyseIcon)
      }
      const iconId = icon._id.toString()
      const iconItem = analyse.icons.find(e => e._id.toString() === iconId)
      iconItem.pages = visit
    }
    analyse.updateTime = new Date()
    await analyse.save()
  }
}
