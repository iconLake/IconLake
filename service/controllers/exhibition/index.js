import { RESOURCE_MAX_AGE, ROOT } from '../../utils/const.js'
import isbot from 'isbot'
import { renderProject } from './bot.js'

export async function info (req, res) {
  if (isbot(req.get('user-agent')) || req.query.bot) {
    return renderProject(req, res)
  }
  res.sendFile('./public/exhibition/index.html', {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}
