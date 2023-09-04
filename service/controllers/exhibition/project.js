import { RESOURCE_MAX_AGE, ROOT } from '../../utils/const.js'

export async function info (req, res) {
  res.sendFile('./public/exhibition/project.html', {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}
