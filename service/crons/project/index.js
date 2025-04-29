import { CronJob } from 'cron'
import { Project } from '../../models/project.js'
import { center as fetchCenter } from '../../utils/fetch.js'
import { analyseProject } from './analyse.js'
import { clearExpiredFiles } from './clear.js'
import { migrate } from './migrate.js'
import { format } from 'date-fns'

const job = new CronJob('0 0 3 * * *', () => {
  start()
})

export function init () {
  job.start()
  // start job when app start
  start()
}

let startTime = Date.now()
let endTime = Date.now()

export function start () {
  if (endTime < startTime) {
    return
  }
  startTime = Date.now()
  console.log(`start project tasks ${format(startTime, 'yyyy-MM-dd HH:mm:ss')}`)
  getList(() => {
    endTime = Date.now()
    const milliseconds = endTime - startTime
    const hours = Math.floor(milliseconds / 3600000)
    const minutes = Math.floor(milliseconds % 3600000 / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    const remainingMilliseconds = milliseconds % 1000
    console.log(`finish project tasks ${format(endTime, 'yyyy-MM-dd HH:mm:ss')}, cost ${hours}h ${minutes}m ${seconds}s ${remainingMilliseconds}ms`)
  })
}

/**
 * 获取执行列表
 * @param {function} doneCB 完成后的回调
 */
async function getList (doneCB) {
  try {
    const task = await fetchCenter('/task/pull')
    const list = task.ids
    for (let i = 0, len = list.length; i < len; ++i) {
      const project = await Project.findById(list[i])
      await analyseProject(project)
      await clearExpiredFiles(project)
      await migrate(project)
    }
    if (task.isEnd) {
      doneCB()
    } else {
      setTimeout(() => {
        getList(doneCB)
      })
    }
  } catch (e) {
    console.error(e)
    setTimeout(() => {
      getList(doneCB)
    }, 10 * 60 * 1000)
  }
}
