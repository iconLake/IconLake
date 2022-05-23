import mongoose from 'mongoose'
import { SOURCE_TYPE } from '../utils/const.js'
const { Schema, model } = mongoose

const SourceSchema = new Schema({
  name: String,
  type: {
    default: SOURCE_TYPE.ICONFONT,
    type: Number
  }, // 类型：1: iconfont
  resourceUrl: String, // iconfont可以通过syncUrl更改文件类型获得
  syncUrl: String,
  syncStartTime: Date, // syncStartTime大于syncEndTime则正在同步，如果超过3分钟还没有结束则说明出错了，可以重新同步，否则不可同步
  syncEndTime: Date,
  prefix: String,
  className: String,
  originalData: Schema.Types.Mixed
})

const GroupSchema = new Schema({
  name: String,
  num: {
    type: Number,
    default: 0
  }
})

const IconSchema = new Schema({
  sourceId: Schema.Types.ObjectId,
  groupId: Schema.Types.ObjectId,
  name: String,
  code: String,
  tags: [String],
  syncTime: Date,
  originalData: Schema.Types.Mixed
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
  sources: [SourceSchema],
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
