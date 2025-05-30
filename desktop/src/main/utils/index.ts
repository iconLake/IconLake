import { app, BrowserWindow } from "electron"
import * as path from "path"

export const isProduction = app.isPackaged || process.env.NODE_ENV === 'production'

export const codesPath = path.join(app.getPath('userData'), 'codes')

export const themeCodesPath = path.join(codesPath, 'theme')

export const servicePort = 19090

export const mainPageUrl = `http://127.0.0.1:${servicePort}/login`

export const desktopUrl = `http://127.0.0.1:${servicePort}/desktop`

export const proxyTarget = isProduction ? 'https://iconlake.com' : 'http://127.0.0.1:8080'

export const appRootPath = app.getAppPath()

export async function createSettingsWindow({ parent }: { parent: BrowserWindow }) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  })
  win.loadURL(`${desktopUrl}/settings`)
  win.once('ready-to-show', () => {
    win.show()
  })
  return win
}
