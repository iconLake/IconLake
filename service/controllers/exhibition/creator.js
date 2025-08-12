import { RESOURCE_MAX_AGE, ROOT } from '../../utils/const.js'
import isbot from 'isbot'
import { renderCreator } from './bot.js'
import { User } from '../../models/user.js'
import { completeURL } from '../../utils/file.js'

export async function view (req, res) {
  if (isbot(req.get('user-agent')) || req.query.bot) {
    return renderCreator(req, res)
  }
  res.sendFile('./public/exhibition/creator.html', {
    root: ROOT,
    maxAge: RESOURCE_MAX_AGE
  })
}

export async function creatorInfo (req, res) {
  const _id = req.params.id
  if (!_id) {
    return res.json({})
  }
  const user = await User.findOne({ _id }, 'name desc avatar medias sex birthday location')
  if (!user) {
    return res.json({})
  }
  return res.json({
    address: user._id,
    name: user.name,
    description: user.desc ?? '',
    avatar: user.avatar ? completeURL(user.avatar) : '',
    avatarHash: '',
    sex: user.sex,
    birthday: user.birthday,
    location: user.location,
    medias: user.medias ?? [],
    isOffchain: true
  })
}
