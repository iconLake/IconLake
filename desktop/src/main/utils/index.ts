import { app, BrowserWindow, screen, WebContentsView } from "electron"
import * as path from "path"

export const isProduction = app.isPackaged || process.env.NODE_ENV === 'production'

export const codesPath = path.join(app.getPath('userData'), 'codes')

export const themeCodesPath = path.join(codesPath, 'theme')

export const servicePort = 19090

export const mainPageUrl = `http://127.0.0.1:${servicePort}/manage/home`

export const desktopUrl = `http://127.0.0.1:${servicePort}/desktop`

export const proxyTarget = isProduction ? 'https://iconlake.com' : 'http://127.0.0.1:8080'

export const appPath = isProduction ? app.getAppPath() : path.join(app.getAppPath(), '../../')
export const mainRootPath = path.join(appPath, 'source/main')
export const rendererRootPath = path.join(appPath, 'source/renderer')

export const internalOpenDomains = ['iconlake.com', '127.0.0.1', 'localhost', 'huaban.com']

export async function createSettingsWindow() {
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

export async function createWindow({ url }: {url?: string} = {}) {
  const workArea = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    height: workArea.height,
    width: workArea.width,
    webPreferences: {
      preload: path.join(mainRootPath, "preload.js"),
    },
  })

  win.loadURL(url ?? mainPageUrl)

  if (!isProduction) {
    win.webContents.openDevTools()
  }

  return win
}

export async function createSubWindow({ url, width = 300, height = 230, parent }: {
  url?: string
  width?: number
  height?: number
  parent?: BrowserWindow
} = {}) {
  const _parent = parent ?? getCurrentWindow()
  if (!_parent) {
    throw new Error('parent window is not found')
  }
  const parentBounds = _parent.getBounds();
  const x = parentBounds ? parentBounds.x + parentBounds.width - width : undefined
  const y = parentBounds ? parentBounds.y + parentBounds.height - height : undefined
  const win = new WebContentsView({
    webPreferences: {
      devTools: true
    }
  })
  _parent.contentView.addChildView(win)
  win.webContents.loadURL(url ?? mainPageUrl)
  win.setBounds({ width, height, x, y })
  win.webContents.on('dom-ready', () => {
    win.webContents.enableDeviceEmulation({
      screenPosition: 'desktop',
      screenSize: { width: width * 4, height: height * 4 },
      viewPosition: { x: 0, y: 0 },
      viewSize: { width: width * 4, height: height * 4 },
      deviceScaleFactor: 0,
      scale: 0.25,
    });
  })
  return win
}

export function getCurrentWindow() {
  const focusedWin = BrowserWindow.getFocusedWindow()
  if (focusedWin) {
    return focusedWin
  }
  const wins = BrowserWindow.getAllWindows()
  if (wins.length > 0) {
    return wins[0]
  }
  return undefined
}

export function retry<T>(fn: () => Promise<T>, times = 10, interval = 500): Promise<T> {
  return new Promise((resolve, reject) => {
    let count = 0
    const tryFn = async () => {
      try {
        const res = await fn()
        resolve(res)
      } catch (e) {
        console.error('retry error', count, e)
        count++
        if (count >= times) {
          reject(e)
        } else {
          setTimeout(tryFn, interval)
        }
      }
    }
    tryFn()
  })
}
