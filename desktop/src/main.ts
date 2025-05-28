import { app, BrowserWindow, ipcMain, screen } from "electron"
import * as path from "path"
import { mainPageUrl, isProduction } from "./utils"
import { startService } from "./service"
import { dealMessage } from "./service/message"

function createWindow() {
  const workArea = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    height: workArea.height,
    width: workArea.width,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  mainWindow.loadURL(mainPageUrl)

  if (!isProduction) {
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  startService()

  createWindow()

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
