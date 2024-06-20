import { RESOURCE_MAX_AGE, ROOT } from '../../utils/const.js'
import isbot from 'isbot'
import { renderNft } from './bot.js'

export async function info (req, res) {
  if (isbot(req.get('user-agent')) || req.query.bot) {
    return renderNft(req, res)
  }
  res.sendFile('./public/exhibition/nft.html', {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}
