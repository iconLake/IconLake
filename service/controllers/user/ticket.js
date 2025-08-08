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

export async function claim (req, res) {
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
