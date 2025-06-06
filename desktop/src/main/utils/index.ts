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

export const internalOpenDomains = [
  'iconlake.com',
  '127.0.0.1',
  'localhost',
  'huaban.com',
  'www.iconfont.cn',
  'www.zcool.com.cn',
  'ums.gaoding.com',
  'www.gracg.com',
  'x.com',
]

export async function createSettingsWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
  })
  win.loadURL(`${desktopUrl}/settings`)
  win.once('ready-to-show', () => {
    win.show()
  })
  return win
}

export async function createWindow({ url, width, height, alwaysOnTop }: {
  url?: string
  width?: number
  height?: number
  alwaysOnTop?: boolean
} = {}) {
  const workArea = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    height: height ?? workArea.height,
    width: width ?? workArea.width,
    webPreferences: {
      preload: path.join(mainRootPath, "preload.js"),
    },
    alwaysOnTop,
  })

  win.loadURL(url ?? mainPageUrl)

  return win
}

const subWindows: { [key: string]: WebContentsView } = {}

export async function createSubWindow({ url, width = 200, height = 120, parent, id }: {
  url?: string
  width?: number
  height?: number
  parent?: BrowserWindow
  id?: string
} = {}) {
  if (id && subWindows[id] && !subWindows[id].webContents.isDestroyed()) {
    return subWindows[id]
  }
  const _parent = parent ?? getCurrentWindow()
  if (!_parent) {
    throw new Error('parent window is not found')
  }
  const parentBounds = _parent.getContentBounds()
  const x = parentBounds ? parentBounds.width - width - 10 : undefined
  const y = parentBounds ? parentBounds.height - height - 10 : undefined
  const scale = Math.min(width / 1366, height / 768)
  const win = new WebContentsView({
    webPreferences: {
      devTools: true
    }
  })
  if (id) {
    subWindows[id] = win
  }
  _parent.contentView.addChildView(win)
  win.webContents.loadURL(url ?? mainPageUrl)
  win.setBounds({ width, height, x, y })
  win.webContents.enableDeviceEmulation({
    screenPosition: 'desktop',
    screenSize: { width: width / scale, height: height / scale },
    viewPosition: { x: 0, y: 0 },
    viewSize: { width: width / scale, height: height / scale },
    deviceScaleFactor: 0,
    scale,
  })
  win.webContents.on('dom-ready', () => {
    win.webContents.enableDeviceEmulation({
      screenPosition: 'desktop',
      screenSize: { width: width / scale, height: height / scale },
      viewPosition: { x: 0, y: 0 },
      viewSize: { width: width / scale, height: height / scale },
      deviceScaleFactor: 0,
      scale,
    })
  })
  _parent.on('closed', () => {
    if (id && subWindows[id]) {
      delete subWindows[id]
    }
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

export function retry<T>(fn: () => Promise<T>, times = 20, interval = 500): Promise<T> {
  return new Promise((resolve, reject) => {
    let count = 0
    const tryFn = async () => {
      try {
        const res = await fn()
        resolve(res)
      } catch (e) {
        count++
        if (count >= times) {
          console.error('retry error', count, e)
          reject(e)
        } else {
          setTimeout(tryFn, interval)
        }
      }
    }
    tryFn()
  })
}
