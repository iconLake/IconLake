import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const VisitSchema = new Schema({
  projectId: mongoose.Types.ObjectId,
  code: String,
  prefix: String,
  className: String,
  url: String,
  count: Number,
  time: Date
})

export const Visit = model('Visit', VisitSchema)
