import { RESOURCE_MAX_AGE, ROOT } from '../../utils/const.js'
import isbot from 'isbot'
import { renderProject } from './bot.js'
import { Project } from '../../models/project.js'
import { completeURL } from '../../utils/file.js'
export { nftList, nftInfo } from './nft.js'
export { creatorInfo } from './creator.js'

export async function view (req, res) {
  if (isbot(req.get('user-agent')) || req.query.bot) {
    return renderProject(req, res)
  }
  res.sendFile('./public/exhibition/index.html', {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}

export async function classInfo (req, res) {
  const _id = req.params.id
  if (!_id) {
    return res.json({})
  }
  const project = await Project.findOne({ _id }, 'type name desc cover class createTime userId')
  if (!project) {
    return res.json({})
  }
  return res.json({
    id: project._id,
    name: project.name,
    description: project.desc ?? '',
    symbol: project.class ?? '',
    uri: project.cover ? completeURL(project.cover) : '',
    uriHash: '',
    data: {
      author: project.userId,
      createTime: `${project.createTime ? project.createTime.getTime() : 0}`
    },
    isOffchain: true
  })
}
