import mongoose from 'mongoose'
const { Schema, model } = mongoose

const AIUsageSchema = new Schema({
  model: String,
  promptTokens: {
    type: Number,
    default: 0
  },
  completionTokens: {
    type: Number,
    default: 0
  },
  createTime: {
    type: Date,
    default: Date.now
  }
})

export const UsageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
    unique: true
  },
  ai: {
    daily: {
      type: Map,
      of: AIUsageSchema,
      default: () => new Map()
    },
    monthly: {
      type: Map,
      of: AIUsageSchema,
      default: () => new Map()
    },
    history: [AIUsageSchema],
    tokens: {
      used: {
        type: Number,
        default: 0,
        min: 0
      },
      total: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  storage: {
    used: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    },
    expiresAt: {
      type: Date
    }
  }
})

export const Usage = model('Usage', UsageSchema)
