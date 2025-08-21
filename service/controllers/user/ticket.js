import { Project } from '../../models/project.js'
import { Ticket } from '../../models/ticket.js'
import { ERROR_CODE } from '../../utils/const.js'
import { completeURL } from '../../utils/file.js'

export async function list (req, res) {
  const tickets = await Ticket.find({
    userId: req.user._id
  }, '-code').populate('projectId', 'type name desc cover prefix class')
  if (!tickets.length) {
    res.json({
      tickets: []
    })
    return
  }
  res.json({
    tickets: tickets.map((ticket) => {
      const ticketData = ticket.toJSON()
      return {
        ...ticketData,
        projectId: ticket.projectId._id,
        project: {
          ...ticketData.projectId,
          cover: ticketData.projectId.cover ? completeURL(ticketData.projectId.cover) : ''
        }
      }
    })
  })
}

async function reduceTicket (projectId) {
  return await Project.updateOne({
    _id: projectId
  }, {
    $inc: {
      'ticket.quantity': -1
    }
  }, {
    runValidators: true
  })
}

async function claimByProjectId (req, res) {
  const projectId = req.body.projectId
  const code = req.body.code
  if (!projectId || typeof projectId !== 'string' || !code || typeof code !== 'string') {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const project = await Project.findOne({
    _id: projectId
  }, 'ticket type name desc cover prefix class')
  if (!project || !project.ticket || project.ticket.code !== code) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  if (project.ticket.quantity <= 0) {
    return res.json({
      error: 'noMoreTickets'
    })
  }

  const ticket = await Ticket.findOne({
    projectId,
    userId: req.user._id
  })
  if (ticket) {
    if (+ticket.expired > Date.now()) {
      if (ticket.code === code) {
        return res.json({
          error: 'hasClaimed'
        })
      }
      ticket.expired = new Date(+ticket.expired + (project.ticket.days * 24 * 3600 * 1000))
    } else {
      ticket.expired = new Date(Date.now() + (project.ticket.days * 24 * 3600 * 1000))
    }
    ticket.code = code
    const result = await reduceTicket(projectId)
    if (result.modifiedCount === 0) {
      return res.json({
        error: 'noMoreTickets'
      })
    }
    await ticket.save()
    return res.json({
      project: {
        ...project.toJSON(),
        cover: project.cover ? completeURL(project.cover) : '',
        ticket: undefined
      },
      ...ticket.toJSON(),
      code: undefined
    })
  }

  const newTicket = new Ticket({
    projectId,
    userId: req.user._id,
    expired: new Date(Date.now() + (project.ticket.days * 24 * 3600 * 1000)),
    code
  })
  const result = await reduceTicket(projectId)
  if (result.modifiedCount === 0) {
    return res.json({
      error: 'noMoreTickets'
    })
  }
  await newTicket.save()
  res.json({
    project: {
      ...project.toJSON(),
      cover: project.cover ? completeURL(project.cover) : '',
      ticket: undefined
    },
    ...newTicket.toJSON(),
    code: undefined
  })
}

async function claimByTicketId (req, res) {
  const ticketId = req.body.ticketId
  const code = req.body.code
  if (!ticketId || typeof ticketId !== 'string' || !code || typeof code !== 'string') {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  let ticket = await Ticket.findOne({
    _id: ticketId,
    code
  })
  if (!ticket) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  if (ticket.userId) {
    return res.json({
      error: 'hasClaimed'
    })
  }
  if (ticket.quantity < 1) {
    return res.json({
      error: 'noMoreTickets'
    })
  }
  const oldTicket = await Ticket.findOne({
    projectId: ticket.projectId,
    userId: req.user._id
  })
  if (oldTicket && oldTicket.code === code) {
    return res.json({
      error: 'hasClaimed'
    })
  }
  if (ticket.quantity > 1) {
    await Ticket.updateOne({
      _id: ticketId
    }, {
      $inc: {
        quantity: -1
      }
    })
    if (oldTicket) {
      let expired = oldTicket.expired
      if (+expired > Date.now()) {
        expired = new Date(+expired + (ticket.days * 24 * 3600 * 1000))
      } else {
        expired = new Date(Date.now() + (ticket.days * 24 * 3600 * 1000))
      }
      ticket = oldTicket
      ticket.expired = expired
      ticket.code = code
    } else {
      ticket = new Ticket({
        projectId: ticket.projectId,
        userId: req.user._id,
        expired: new Date(Date.now() + (ticket.days * 24 * 3600 * 1000)),
        code
      })
    }
  } else {
    if (oldTicket) {
      await Ticket.deleteOne({
        _id: ticketId
      })
      let expired = oldTicket.expired
      if (+expired > Date.now()) {
        expired = new Date(+expired + (ticket.days * 24 * 3600 * 1000))
      } else {
        expired = new Date(Date.now() + (ticket.days * 24 * 3600 * 1000))
      }
      ticket = oldTicket
      ticket.expired = expired
      ticket.code = code
    } else {
      ticket.userId = req.user._id
      ticket.expired = new Date(Date.now() + (ticket.days * 24 * 3600 * 1000))
    }
  }
  await ticket.save()
  const project = await Project.findOne({
    _id: ticket.projectId
  }, 'type name desc cover prefix class')
  res.json({
    ...ticket.toJSON(),
    project: {
      ...project.toJSON(),
      cover: project.cover ? completeURL(project.cover) : ''
    },
    code: undefined
  })
}

export async function claim (req, res) {
  if (req.body.projectId) {
    await claimByProjectId(req, res)
  } else if (req.body.ticketId) {
    await claimByTicketId(req, res)
  } else {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
}

export async function like (req, res) {
  if (typeof req.body._id !== 'string' || req.body._id.length === 0 || typeof req.body.isLike !== 'boolean') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await Ticket.updateOne({
    userId: req.user._id,
    _id: req.body._id
  }, {
    $set: {
      like: {
        isLike: req.body.isLike,
        time: new Date()
      }
    }
  })
  if (result.modifiedCount > 0) {
    res.json({
      isLike: req.body.isLike
    })
  } else {
    res.json({
      error: ERROR_CODE.FAIL
    })
  }
}

export async function setPasskey (req, res) {
  if (typeof req.body._id !== 'string' || req.body._id.length === 0 || typeof req.body.passkey !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await Ticket.updateOne({
    userId: req.user._id,
    _id: req.body._id
  }, {
    $set: {
      'auth.passkey': req.body.passkey,
      'auth.expired': new Date(Date.now() + 24 * 3600 * 1000)
    }
  })
  if (result.modifiedCount > 0) {
    res.json({
      passkey: req.body.passkey
    })
  } else {
    res.json({
      error: ERROR_CODE.FAIL
    })
  }
}
