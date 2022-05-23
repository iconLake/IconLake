import { CronJob } from 'cron'
import * as project from './project.js'

const job = new CronJob('0 0 3 * * *', () => {
  project.start()
})

export function init () {
  job.start()
}
