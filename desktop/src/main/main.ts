import { app, BrowserWindow, ipcMain, shell, screen } from "electron"
import { internalOpenDomains, createWindow } from "./utils"
import { startService } from "./service"
import { dealMessage } from "./service/message"
import { setMenu } from "./app/menu"
import { initRequestHandler } from "./service/modify-request"

let mainWindow: BrowserWindow

app.whenReady().then(async () => {
  await startService()
  setMenu()
  createWindow().then((win) => {
    mainWindow = win
  })
  initRequestHandler()

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

ipcMain.on('iconlakeRequest', async (e, data) => {
  e.reply('iconlakeResponse', await dealMessage(data))
})

app.on('web-contents-created', (e, contents) => {
  contents.setWindowOpenHandler((details) => {
    const domain = new URL(details.url).hostname
    if (internalOpenDomains.includes(domain)) {
      return {
        action: 'allow',
        createWindow: (options) => {
          const win = new BrowserWindow(options)
          const workArea = screen.getPrimaryDisplay().workAreaSize
          const width = 1366
          const height = 768
          win.setBounds({
            x: (workArea.width - width) / 2,
            y: (workArea.height - height) / 2,
            width,
            height,
          })
          return win.webContents
        }
      }
    }
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  contents.once('dom-ready', () => {
    contents.setZoomFactor(1)
  })
})
