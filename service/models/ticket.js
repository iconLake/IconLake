import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const TicketSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expired: {
    type: Date,
    default: new Date(0)
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  code: String
})

export const Ticket = model('Ticket', TicketSchema)
