import mongoose from 'mongoose'
import { getConfig } from '../config/index.js'

const config = getConfig()

async function main () {
  await mongoose.connect(config.mongodb.uri)
}

export function init () {
  main().then(() => {
    console.log(`[${new Date()}]`, 'DB is ready.')
  }).catch(console.error)
}
