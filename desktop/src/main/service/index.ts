import * as express from "express"
import { rendererRootPath, isProduction, proxyTarget, servicePort } from "../utils"
import { createProxyMiddleware } from "http-proxy-middleware/dist"
import * as path from "path"
import * as fs from "fs"

const app = express()

app.use((req, res, next) => {
  if (req.url.startsWith('/desktop')) {
    if (isProduction) {
      const filename = req.url.slice('/desktop'.length)
      const filepath = path.join(rendererRootPath, filename)
      if (fs.existsSync(filepath)) {
        res.sendFile(filepath)
      } else {
        res.sendFile(path.join(rendererRootPath, 'index.html'))
      }
    } else {
      createProxyMiddleware({
        target: 'http://127.0.0.1:19091',
        changeOrigin: true,
      })(req, res, next)
    }
  } else {
    next()
  }
})

app.use(createProxyMiddleware({
  target: proxyTarget,
  changeOrigin: true
}))

export async function startService() {
  app.listen(servicePort, () => {
    console.log(`Service is running at http://127.0.0.1:${servicePort}`)
  })
}
