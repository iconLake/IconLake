import { Project } from '../../models/project.js'

const projectTask = {
  cursor: null,
  startTime: 0,
  endTime: 0
}

/**
 * 拉取任务
 */
export async function pull (req, res) {
  if (!projectTask.cursor || Date.now() - projectTask.startTime > 20 * 3600 * 1000) {
    projectTask.cursor = Project.find({}, '_id').cursor()
    projectTask.startTime = Date.now()
  }
  const task = {
    time: new Date(),
    type: 'project',
    isEnd: false,
    ids: []
  }
  let i = 10
  while (i-- > 0) {
    if (!projectTask.cursor) {
      break
    }
    const project = await projectTask.cursor.next()
    if (project) {
      task.ids.push(project.id)
    } else {
      task.isEnd = true
      projectTask.cursor = null
      projectTask.endTime = Date.now()
    }
  }
  res.json(task)
}
