import mongoose from 'mongoose'
import { getConfig } from '../config/index.js'

const config = getConfig()

mongoose.set('strictQuery', false)

async function main () {
  await mongoose.connect(config.mongodb.uri)
}

export async function init () {
  try {
    await main()
    console.log('DB is ready.')
  } catch (err) {
    console.error(err)
  }
}
