import mongoose from 'mongoose'
import { SourceSchema, IconSchema } from './project.js'

const { Schema, model } = mongoose

/**
 * 项目历史记录，用于存档删除的图标、源
 */
export const HistorySchema = new Schema({
  sources: [SourceSchema],
  icons: [IconSchema]
})

export const History = model('History', HistorySchema)
