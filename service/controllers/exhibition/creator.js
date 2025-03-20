import { RESOURCE_MAX_AGE, ROOT } from '../../utils/const.js'
import isbot from 'isbot'
import { renderCreator } from './bot.js'

export async function info (req, res) {
  if (isbot(req.get('user-agent')) || req.query.bot) {
    return renderCreator(req, res)
  }
  res.sendFile('./public/exhibition/creator.html', {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}
