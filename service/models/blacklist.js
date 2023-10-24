import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const BlacklistSchema = new Schema({
  address: String,
  projectId: String,
  nftId: String
})

export const Blacklist = model('Blacklist', BlacklistSchema)
