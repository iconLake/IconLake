import express from 'express'
import { getConfig } from './config/index.js'
import { getNodeEnv } from './utils/index.js'
import indexRouter from './routes/index.js'
import taskRouter from './routes/task.js'
import { init as initDB } from './models/index.js'

const env = getNodeEnv()
const app = express()
const config = getConfig()

app.use('/task', taskRouter)
app.use('/', indexRouter)

app.listen(config.http.port, () => {
  console.log(`[${new Date()}]`, `Service[${env}] listening at http://127.0.0.1:${config.http.port}`)
})

/**
 * 初始化数据库
 */
initDB()
