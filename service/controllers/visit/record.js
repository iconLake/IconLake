import { Visit } from '../../models/visit.js'

/**
 * @api {post} /visit/record/:id
 * @apiParam {string} id 项目ID
 */
export default function record (req, res) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.end()
  if (req.params.id.length > 0) {
    const projectId = req.params.id
    if (req.body.records instanceof Array && req.body.records.length > 0) {
      const records = []
      req.body.records.forEach(e => {
        if (e.code && e.count && e.time && e.prefix && e.className) {
          e.projectId = projectId
          if (req.body.url && !e.url) {
            e.url = req.body.url
          }
          records.push(e)
        }
      })
      if (records.length > 0) {
        Visit.insertMany(records)
      }
    }
  }
}
