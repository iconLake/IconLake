import { nanoid } from 'nanoid'
import { Project } from '../../models/project.js'
import { ERROR_CODE } from '../../utils/const.js'
import { Ticket } from '../../models/ticket.js'
import { completeURL } from '../../utils/file.js'

/**
 * @api {post} /project/ticket/edit 更新门票信息
 */
export async function edit (req, res) {
  if (typeof req.body.projectId !== 'string' || req.body.projectId.length === 0) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const $set = {}
  let isSet = false
  if ('code' in req.body) {
    $set['ticket.code'] = !req.body.code || req.body.code === 'new' ? nanoid(32) : req.body.code
    isSet = true
  }
  if ('quantity' in req.body) {
    $set['ticket.quantity'] = req.body.quantity
    isSet = true
  }
  if ('days' in req.body) {
    $set['ticket.days'] = req.body.days
    isSet = true
  }
  if (!isSet) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, {
    $set
  })
  res.json(
    result.matchedCount === 0
      ? { error: ERROR_CODE.PERMISSION_DENIED }
      : {
          code: $set['ticket.code'],
          quantity: $set['ticket.quantity'],
          days: $set['ticket.days']
        }
  )
}

export async function list (req, res) {
  const projectId = req.query.projectId
  if (!projectId || typeof projectId !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, 'ticket')
  if (!project) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  const tickets = await Ticket.find({
    projectId
  }, '-code').sort('-expired').limit(100).populate('userId', 'name desc avatar').exec()
  res.json({
    tickets: tickets.map((ticket) => {
      const ticketData = ticket.toJSON()
      return {
        ...ticketData,
        userId: ticketData.userId._id,
        user: {
          ...ticketData.userId,
          avatar: ticketData.userId.avatar ? completeURL(ticketData.userId.avatar) : ''
        }
      }
    })
  })
}
