import * as express from "express"
import { handleBuildTheme } from "../message/theme"
import { ThemeType } from "../../process/theme"

export async function buildTheme(req: express.Request, res: express.Response) {
  const { codes, type } = req.body as { codes?: string, type?: ThemeType }
  if (!codes || !type || !(type in ThemeType)) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const result = await handleBuildTheme({
    codes,
    type,
  })
  res.json(result)
}
