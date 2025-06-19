import { log } from "../../utils/log"
import { buildTheme, ThemeType } from "../../process/theme"
import { themeCodesPath } from "../../utils"
import * as fs from "fs"
import * as path from "path"

export async function handleBuildTheme({ codes, type }: { codes: string, type: ThemeType }) {
  try {
    await buildTheme({ codes, type })
  } catch (e) {
    log.error(e)
    return {
      error: 'buildFail'
    }
  }
  const files = fs.readdirSync(path.join(themeCodesPath, 'dist', 'assets'))
  for (const filename of files) {
    if (filename.startsWith(type)) {
      const buf = fs.readFileSync(path.join(themeCodesPath, 'dist', 'assets', filename))
      return {
        codes: buf.toString('utf8')
      }
    }
  }
  return {
    error: 'buildFail'
  }
}
