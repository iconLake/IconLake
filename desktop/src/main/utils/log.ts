import * as fs from "fs"
import * as path from "path"
import { isProduction, logsPath } from "./index"

async function save({
  filename,
  messages
}: {
  filename: string
  messages: any[]
}) {
  try {
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(logsPath)
    }
    await fs.promises.appendFile(
      path.join(logsPath, filename),
      `[${new Date().toISOString()}]  ${messages.map(message => JSON.stringify(message, null, 2)).join('  ')}\n`
    )
  } catch (err) {
    console.error('Failed to write to log:', err, filename, messages)
  }
}

async function info(...messages: any[]) {
  if (isProduction) {
    return
  }
  await save({
    filename: 'info.log',
    messages
  })
}

async function error(...messages: any[]) {
  await save({
    filename: 'error.log',
    messages
  })
}

export const log = {
  info,
  error
}
