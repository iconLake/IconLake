import crypto from 'crypto'
import { save } from '../../utils/file.js'
import { hasObject } from '../../utils/cos.js'

export async function migrate (project) {
  const len = project.icons.length
  let updateNum = 0
  for (let i = 0; i < len; i++) {
    const icon = project.icons[i]
    if (!icon.svg || !icon.svg.path) {
      continue
    }
    const content = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="${icon.svg.viewBox}">${icon.svg.path}</svg>`
    const hash = crypto.createHash('md5').update(content).digest('hex')
    const fileKey = `icon/${project._id}/${hash}.svg`
    const isExist = await hasObject(fileKey)
    if (isExist) {
      icon.svg.path = undefined
      icon.svg.viewBox = undefined
    } else {
      const data = await save(`${hash}.svg`, content, `icon/${project._id}/`)
      icon.svg.url = data.key
    }
    updateNum++
  }
  if (updateNum === 0) {
    return
  }
  await project.save()
  console.log(`migrate project ${project._id} ${updateNum} icons`)
}
