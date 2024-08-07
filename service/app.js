import fs from 'fs'
import http from 'http'
import https from 'https'
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cookieParse from 'cookie-parser'
import apiRouter from './routes/api.js'
import indexRouter from './routes/index.js'
import visitRouter from './routes/visit.js'
import { init as initDB } from './models/index.js'
import { init as initCron } from './crons/index.js'
import { getConfig } from './config/index.js'
import { NODE_ENV as env } from './utils/const.js'

const config = getConfig(env)

const app = express()

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  },
  referrerPolicy: {
    policy: 'no-referrer-when-downgrade'
  }
}))
app.use(compression())

app.use(cookieParse())
app.use('/', indexRouter)

app.use(express.json({
  limit: '10mb'
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.text({
  limit: '10mb'
}))
app.use(express.raw({
  limit: '20mb'
}))
app.use('/api', apiRouter)
app.use('/visit', visitRouter)

if (config.http && config.http.port) {
  http.createServer(app).listen(config.http.port, () => {
    console.log(`Service[${env}] listening at http://127.0.0.1:${config.http.port}`)
  })
}

if (config.https && config.https.port) {
  https.createServer({
    ca: fs.readFileSync(config.https.ca),
    key: fs.readFileSync(config.https.key),
    cert: fs.readFileSync(config.https.cert)
  }, app).listen(config.https.port, () => {
    console.log(`Service[${env}] listening at https://127.0.0.1:${config.https.port}`)
  })
}

/**
 * 初始化数据库
 */
initDB().then(() => {
  /**
   * 初始化定时任务
   */
  initCron()
})
