import crypto from 'crypto'
import { save } from '../../utils/file.js'

export async function migrate (project) {
  const len = project.icons.length
  for (let i = 0; i < len; i++) {
    const icon = project.icons[i]
    if (!icon.svg || !icon.svg.path) {
      continue
    }
    const content = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="${icon.svg.viewBox}">${icon.svg.path}</svg>`
    const hash = crypto.createHash('md5').update(content).digest('hex')
    const data = await save(`${hash}.svg`, content, `icon/${project._id}/`)
    icon.svg.url = data.key
  }
  await project.save()
}
