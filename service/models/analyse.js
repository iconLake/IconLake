import mongoose from 'mongoose'
const { Schema, model } = mongoose

const PageAnalyseSchema = new Schema({
  url: String,
  count: {
    type: Number,
    default: 0
  },
  time: Date
})

const IconAnalyseSchema = new Schema({
  pages: [PageAnalyseSchema]
})

export const AnalyseSchema = new Schema({
  updateTime: Date,
  icons: [IconAnalyseSchema]
})

export const Analyse = model('Analyse', AnalyseSchema)
