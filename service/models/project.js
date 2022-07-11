import mongoose from 'mongoose'
const { Schema, model } = mongoose

const GroupSchema = new Schema({
  name: String,
  num: {
    type: Number,
    default: 0
  }
})

export const IconSchema = new Schema({
  groupId: Schema.Types.ObjectId,
  name: String,
  code: String,
  tags: [String],
  svg: String
})

export const ProjectSchema = new Schema({
  name: String,
  desc: String,
  userId: Schema.Types.ObjectId,
  createTime: Date,
  members: [{
    userId: Schema.Types.ObjectId,
    isAdmin: {
      type: Boolean,
      default: false
    }
  }],
  icons: [IconSchema],
  groups: [GroupSchema],
  monitor: {
    isOn: {
      type: Boolean,
      default: true
    },
    spider: String
  },
  invite: {
    code: String,
    expired: Date
  }
})

export const Project = model('Project', ProjectSchema)
