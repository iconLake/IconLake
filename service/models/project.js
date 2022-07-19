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
  unicode: String,
  tags: [String],
  svg: {
    viewBox: String,
    path: String
  }
})

export const ProjectSchema = new Schema({
  name: String,
  desc: String,
  prefix: {
    type: String,
    default: 'icon-'
  },
  class: {
    type: String,
    default: 'iconlake'
  },
  userId: Schema.Types.ObjectId,
  createTime: Date,
  members: [{
    userId: Schema.Types.ObjectId,
    isAdmin: {
      type: Boolean,
      default: false
    }
  }],
  iconIndex: {
    type: Number,
    default: 0
  },
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
