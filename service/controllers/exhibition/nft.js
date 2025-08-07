import { RESOURCE_MAX_AGE, ROOT } from '../../utils/const.js'
import isbot from 'isbot'
import { renderNft } from './bot.js'
import { Project } from '../../models/project.js'
import { completeURL } from '../../utils/file.js'

export async function view (req, res) {
  if (isbot(req.get('user-agent')) || req.query.bot) {
    return renderNft(req, res)
  }
  res.sendFile('./public/exhibition/nft.html', {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}

function transferIconToNft ({ icon, projectId, userId }) {
  const url = icon.img?.url || icon.svg?.url || ''
  return {
    id: icon._id,
    classId: projectId,
    uri: url ? completeURL(url) : '',
    uriHash: '',
    data: {
      author: userId ?? '',
      createTime: `${icon.createTime ? icon.createTime.getTime() : 0}`,
      name: icon.code ?? '',
      description: `${icon.name ?? ''}${icon.name && icon.desc ? '\n' : ''}${icon.desc ?? ''}`
    },
    isOffchain: true
  }
}

export async function nftList (req, res) {
  const _id = req.params.id
  if (!_id) {
    return res.json({
      nfts: []
    })
  }
  const project = await Project.findOne({ _id }, 'icons userId')
  if (!project) {
    return res.json({
      nfts: []
    })
  }
  const nfts = project.icons.map(e => {
    return transferIconToNft({
      icon: e,
      projectId: _id,
      userId: project.userId
    })
  })
  return res.json({
    nfts,
    pagination: {
      total: project.icons.length
    }
  })
}

export async function nftInfo (req, res) {
  const projectId = req.params.projectId
  const iconId = req.params.iconId
  if (!projectId || !iconId) {
    return res.json({})
  }
  const project = await Project.findOne({ _id: projectId, 'icons._id': iconId }, 'icons userId')
  if (!project) {
    return res.json({})
  }
  const icon = project.icons.id(iconId)
  return res.json(transferIconToNft({
    icon,
    projectId,
    userId: project.userId
  }))
}
