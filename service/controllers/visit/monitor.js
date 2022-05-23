import { readFileSync } from 'fs'
import path from 'path'
import { Project } from '../../models/project.js'

const jsContent = readFileSync(path.resolve(process.cwd(), 'public/monitor/index.js')).toString()

export default async function monitor (req, res) {
  const _id = req.params[0]
  res.set('Content-Type', 'text/javascript; charset=UTF-8')
  if (typeof _id === 'string' && _id.length > 0) {
    const project = await Project.findById(_id, 'monitor')
    if (project && project.monitor && project.monitor.isOn) {
      const spider = project.monitor.spider
        ? `function () {
  var list = [];
  ${project.monitor.spider}
  return list;
}`
        : null
      res.send(
        jsContent
          .replace(/\{\{_ID\}\}/, _id)
          .replace(/\{\{HOST\}\}/, `${req.protocol}://${req.headers.host}`)
          .replace(/'\{\{SPIDER\}\}'/, spider)
      )
      return
    }
  }
  res.end()
}
