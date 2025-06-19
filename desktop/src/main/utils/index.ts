import { app, BrowserWindow, screen, WebContentsView } from "electron"
import * as path from "path"
import * as net from "net"
import { log } from "./log"

export const isProduction = app.isPackaged || process.env.NODE_ENV === 'production'

export const certsPath = path.join(app.getPath('userData'), 'certs')

export const codesPath = path.join(app.getPath('userData'), 'codes')

export const logsPath = path.join(app.getPath('userData'), 'logs')

export const themeCodesPath = path.join(codesPath, 'theme')

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
  'www.instagram.com',
  'www.pixiv.net',
]

export async function createSettingsWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
  })
  const desktopUrl = await getDesktopUrl()
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

  win.loadURL(url ?? await getMainPageUrl())

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
  win.webContents.loadURL(url ?? await getMainPageUrl())
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
  _parent.on('resize', () => {
    const parentBounds = _parent.getContentBounds()
    const x = parentBounds ? parentBounds.width - width - 10 : undefined
    const y = parentBounds ? parentBounds.height - height - 10 : undefined
    win.setBounds({ x, y , width, height})
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
          log.error('retry error', count, e)
          reject(e)
        } else {
          setTimeout(tryFn, interval)
        }
      }
    }
    tryFn()
  })
}

export async function isPortOccupied(port: number) {
  return new Promise((resolve) => {
    const tester = net.createServer().once('error', (err: any) => {
      resolve(true)
    }).once('listening', () => {
      tester.once('close', () => {
        resolve(false)
      }).close()
    }).listen(port)
  })
}

let servicePort = 0
export async function getServicePort() {
  if (servicePort) {
    return servicePort
  }
  let port = 19090
  while (await isPortOccupied(port)) {
    port++
  }
  servicePort = port
  return port
}

export async function getDomain() {
  const port = await getServicePort()
  return `https://localhost.iconlake.com:${port}`
}

export async function getMainPageUrl() {
  const domain = await getDomain()
  return `${domain}/manage/home`
}

export async function getDesktopUrl() {
  const domain = await getDomain()
  return `${domain}/desktop`
}

export function isMac() {
  return process.platform === 'darwin'
}

export function isWin() {
  return process.platform === 'win32'
}

export function getEnvPath() {
  const pathList = new Set(process.env.PATH.split(':'))
  if (isMac()) {
    pathList.add('/usr/local/bin')
    pathList.add('/usr/local/sbin')
    pathList.add('/usr/bin')
    pathList.add('/usr/sbin')
    pathList.add('/bin')
    pathList.add('/sbin')
    pathList.add('/opt/local/bin')
    pathList.add('/opt/homebrew/bin')
    pathList.add('/opt/homebrew/sbin')
    return Array.from(pathList).join(':')
  }
  if (isWin()) {
    pathList.add('C:\\Program Files\\nodejs\\')
    pathList.add('C:\\Program Files (x86)\\nodejs\\')
    return Array.from(pathList).join(';')
  }
  return ''
}
