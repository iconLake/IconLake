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
  code: String,
  like: {
    isLike: {
      type: Boolean,
      default: false
    },
    time: {
      type: Date,
      default: Date.now
    }
  },
  auth: {
    passkey: String,
    expired: {
      type: Date,
      default: Date.now
    }
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  days: {
    type: Number,
    default: 0,
    min: 0
  }
})

export const Ticket = model('Ticket', TicketSchema)
