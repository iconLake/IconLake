import { nanoid } from 'nanoid'
import { Project } from '../../models/project.js'
import { ERROR_CODE } from '../../utils/const.js'

/**
 * @api {post} /project/invite/updateCode 邀请码
 */
export async function updateCode (req, res) {
  if (typeof req.body._id !== 'string' || req.body._id.length === 0) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const invite = {
    code: nanoid(16),
    expired: new Date(Date.now() + 24 * 3600 * 1000)
  }
  await Project.updateOne({
    _id: req.body._id,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, {
    $set: {
      invite
    }
  })
  res.json(invite)
}

/**
 * @api {post} /project/invite/accept 邀请码
 */
export async function accept (req, res) {
  if (typeof req.body._id !== 'string' || req.body._id.length === 0 ||
  typeof req.body.code !== 'string' || req.body.code.length === 0) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const result = await Project.updateOne({
    _id: req.body._id,
    'invite.code': req.body.code,
    'invite.expired': {
      $gt: new Date()
    },
    'members.userId': {
      $ne: req.user._id
    }
  }, {
    $push: {
      members: {
        userId: req.user._id
      }
    }
  })
  if (result.matchedCount === 0) {
    const resultQ = await Project.findOne({
      _id: req.body._id,
      'invite.code': req.body.code,
      'invite.expired': {
        $gt: new Date()
      },
      'members.userId': req.user._id
    })
    if (resultQ) {
      res.json({})
      return
    }
  }
  res.json(result.matchedCount === 1 ? {} : { error: ERROR_CODE.FAIL })
}
