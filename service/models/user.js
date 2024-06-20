import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const UserSchema = new Schema({
  name: String,
  avatar: String,
  token: String,
  tokenExpire: Date,
  github: {
    id: String,
    login: String,
    name: String,
    avatar: String
  },
  gitee: {
    id: String,
    login: String,
    name: String,
    avatar: String
  },
  code: {
    id: String
  },
  blockchain: {
    id: String
  }
})

export const User = model('User', UserSchema)
