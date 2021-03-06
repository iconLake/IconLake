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
import { init as initCron } from './controllers/analyse/cron.js'
import { getConfig } from './config/index.js'
import { getNodeEnv } from './utils/index.js'

const env = getNodeEnv()
const config = getConfig(env)

const app = express()

app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(compression())

app.use(cookieParse())
app.use('/', indexRouter)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', apiRouter)
app.use('/visit', visitRouter)

if (config.http && config.http.port) {
  http.createServer(app).listen(config.http.port, () => {
    console.log(`[${new Date()}]`, `Service[${env}] listening at http://127.0.0.1:${config.http.port}`)
  })
}

if (config.https && config.https.port) {
  https.createServer({
    ca: fs.readFileSync(config.https.ca),
    key: fs.readFileSync(config.https.key),
    cert: fs.readFileSync(config.https.cert)
  }, app).listen(config.https.port, () => {
    console.log(`[${new Date()}]`, `Service[${env}] listening at https://127.0.0.1:${config.https.port}`)
  })
}

/**
 * 初始化数据库
 */
initDB()

/**
 * 初始化定时任务
 * TODO: 集群部署会导致同时触发，需要优化
 */
initCron()
