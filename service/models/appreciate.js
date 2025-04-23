import mongoose from 'mongoose'
const { Schema, model } = mongoose

const AppreciateContentSchema = new Schema({
  url: String,
  text: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  ai: String
})

export const AppreciateSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  iconId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  content: {
    good: [AppreciateContentSchema],
    normal: [AppreciateContentSchema],
    bad: [AppreciateContentSchema],
    great: [AppreciateContentSchema]
  }
})

AppreciateSchema.index({ projectId: 1, iconId: 1 }, { unique: true })

export const Appreciate = model('Appreciate', AppreciateSchema)
