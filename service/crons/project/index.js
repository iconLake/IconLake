import { CronJob } from 'cron'
import { Project } from '../../models/project.js'
import { center as fetchCenter } from '../../utils/fetch.js'
import { analyseProject } from './analyse.js'
import { clearExpiredFiles } from './clear.js'

const job = new CronJob('0 0 3 * * *', () => {
  start()
})

export function init () {
  job.start()
}

let startTime = Date.now()
let endTime = Date.now()

export function start () {
  if (endTime < startTime) {
    return
  }
  startTime = Date.now()
  getList(() => {
    endTime = Date.now()
  })
}

/**
 * 获取执行列表
 * @param {function} doneCB 完成后的回调
 */
async function getList (doneCB) {
  const task = await fetchCenter('/task/pull')
  const list = task.ids
  for (let i = 0, len = list.length; i < len; ++i) {
    const project = await Project.findById(list[i])
    await analyseProject(project)
    await clearExpiredFiles(project)
  }
  if (task.isEnd) {
    doneCB()
  } else {
    setTimeout(() => {
      getList(doneCB)
    })
  }
}
