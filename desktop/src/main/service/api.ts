import * as express from "express"
import { handlePing } from "./message"
import { buildTheme } from "./api/theme"

export const apiRouter = express.Router()

apiRouter.get('/ping', async (req, res) => {
  const result = await handlePing()
  res.send(result)
})

apiRouter.post('/theme/build', buildTheme)

export function apiMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
  next()
}
