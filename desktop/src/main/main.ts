import { app, BrowserWindow, ipcMain, shell } from "electron"
import { internalOpenDomains, createWindow } from "./utils"
import { startService } from "./service"
import { dealMessage } from "./service/message"
import { setMenu } from "./app/menu"
import { initRequestHandler } from "./service/modify-request"

let mainWindow: BrowserWindow

app.whenReady().then(() => {
  startService()
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
      return { action: 'allow' }
    }
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  contents.once('dom-ready', () => {
    contents.setZoomFactor(1)
  })
})
