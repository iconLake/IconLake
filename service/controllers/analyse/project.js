import { Project } from '../../models/project.js'
import { Analyse } from '../../models/analyse.js'
import { Visit } from '../../models/visit.js'

const pageSize = 10

let startTime = Date.now()
let endTime = Date.now()

export function start () {
  if (endTime < startTime) {
    return
  }
  startTime = Date.now()
  getList(0, () => {
    endTime = Date.now()
  })
}

async function getList (cursor = 0, done) {
  const list = await Project.find({}, 'icons sources').skip(cursor * pageSize).limit(pageSize)
  for (let i = 0, len = list.length; i < len; ++i) {
    await analyseProject(list[i])
  }
  if (list.length < pageSize) {
    done()
  } else {
    setTimeout(() => {
      getList(cursor + 1, done)
    })
  }
}

async function analyseProject (project) {
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
      const source = project.sources.id(icon.sourceId) || {}
      const visit = await Visit.aggregate([
        {
          $match: {
            projectId: project._id,
            code: icon.code,
            prefix: source.prefix,
            className: source.className,
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
