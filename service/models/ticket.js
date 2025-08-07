import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const TicketSchema = new Schema({
  projectId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  expired: Date,
  createTime: {
    type: Date,
    default: Date.now
  }
})

export const Ticket = model('Ticket', TicketSchema)
