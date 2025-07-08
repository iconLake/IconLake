import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const CacheSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  },
  updateTime: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 7 * 24 * 60 * 60
  }
})

export const Cache = model('Cache', CacheSchema)
