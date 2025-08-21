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
    projectId,
    userId: {
      $exists: true
    }
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

export async function info (req, res) {
  if (!req.query.projectId || typeof req.query.projectId !== 'string') {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id
      }
    }
  }, 'ticket')
  if (!project) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  let ticket = await Ticket.findOne({
    userId: req.user._id,
    projectId: req.query.projectId
  }, '-code -auth')
  const expired = new Date(Date.now() + 24 * 3600 * 1000)
  if (!ticket) {
    ticket = new Ticket({
      userId: req.user._id,
      projectId: req.query.projectId,
      expired
    })
    await ticket.save()
  } else {
    if (+ticket.expired <= Date.now()) {
      ticket.expired = expired
      await ticket.save()
    }
  }
  res.json(ticket.toJSON())
}

export async function createEmptyTicket (req, res) {
  if (
    !req.body.projectId ||
    typeof req.body.projectId !== 'string' ||
    !req.body.quantity ||
    typeof req.body.quantity !== 'number' ||
    req.body.quantity < 1 ||
    !req.body.days ||
    typeof req.body.days !== 'number' ||
    req.body.days <= 0
  ) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const project = await Project.findOne({
    _id: req.body.projectId,
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
  const ticket = new Ticket({
    projectId: req.body.projectId,
    quantity: req.body.quantity,
    days: req.body.days,
    code: nanoid(32)
  })
  await ticket.save()
  res.json(ticket.toJSON())
}

export async function listEmptyTickets (req, res) {
  if (!req.query.projectId || typeof req.query.projectId !== 'string') {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
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
    projectId: req.query.projectId,
    userId: {
      $exists: false
    }
  }).sort('-createTime').limit(100).exec()
  res.json({
    tickets: tickets.map((ticket) => ticket.toJSON())
  })
}

export async function deleteEmptyTicket (req, res) {
  if (
    !req.body._id ||
    typeof req.body._id !== 'string'
  ) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const ticket = await Ticket.findOne({
    _id: req.body._id
  })
  if (!ticket) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  if (ticket.userId) {
    res.json({
      error: ERROR_CODE.PERMISSION_DENIED
    })
    return
  }
  const project = await Project.findOne({
    _id: ticket.projectId,
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
  const result = await Ticket.deleteOne({
    _id: req.body._id
  })
  if (result.deletedCount) {
    res.json({})
  } else {
    res.json({
      error: ERROR_CODE.FAIL
    })
  }
}
