import { contextBridge, ipcRenderer } from "electron"

declare const iconlake: any

contextBridge.exposeInMainWorld('iconlake', {
  version: '0.0.1',
  sendMessage: (data: any) => {
    ipcRenderer.send('iconlakeRequest', data)
  }
})

contextBridge.executeInMainWorld({
  func: () => {
    window.addEventListener('message', (e) => {
      console.log('message', e.data)
      if (e.data?.type.startsWith('iconlakeRequest:')) {
        iconlake?.sendMessage(e.data)
      }
    })
  }
})

ipcRenderer.on('iconlakeResponse', (_, data) => {
  console.log('iconlakeResponse', data)
  contextBridge.executeInMainWorld({
    func: (data) => {
      window.postMessage(data, '*')
    },
    args: [data]
  })
})
