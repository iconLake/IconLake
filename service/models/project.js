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
  desc: String,
  code: String,
  unicode: String,
  tags: [String],
  svg: {
    url: String,
    /**
     * @deprecated replace with 'url'
     */
    viewBox: String,
    /**
     * @deprecated replace with 'url'
     */
    path: String
  },
  img: {
    url: String
  },
  /**
   * @deprecated replace with 'blockchain.txHash'
   */
  txHash: String,
  blockchain: {
    classId: String,
    nftId: String,
    txHash: String,
    height: Number
  },
  createTime: {
    type: Date,
    default: Date.now
  }
})

export const ProjectSchema = new Schema({
  type: {
    type: Number,
    default: 1,
    enum: [1, 2] // 1: svg, 2: img
  },
  name: String,
  desc: String,
  cover: String,
  prefix: {
    type: String,
    default: 'icon-'
  },
  class: {
    type: String,
    default: 'iconlake'
  },
  files: {
    css: [{
      createTime: Date,
      hash: String,
      url: String,
      expire: {
        type: Number,
        default: 30
      }
    }],
    js: [{
      createTime: Date,
      hash: String,
      url: String,
      expire: {
        type: Number,
        default: 30
      }
    }]
  },
  userId: Schema.Types.ObjectId,
  createTime: {
    type: Date,
    default: Date.now
  },
  members: [{
    userId: Schema.Types.ObjectId,
    isAdmin: {
      type: Boolean,
      default: false
    }
  }],
  iconIndex: {
    type: Number,
    default: 0xE000
  },
  icons: [IconSchema],
  iconUpdateTime: Date,
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
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  theme: {
    class: String,
    nft: String
  },
  style: {
    list: {
      type: Number,
      default: 0
    }
  },
  storage: {
    api: String,
    token: String
  },
  ticket: {
    code: String,
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    days: {
      type: Number,
      default: 1,
      min: 1
    }
  }
})

export const Project = model('Project', ProjectSchema)
