import * as express from "express"
import { proxyTarget, servicePort } from "../utils"
import { createProxyMiddleware } from "http-proxy-middleware/dist"
import * as path from "path"

const app = express()

app.use((req, res, next) => {
  console.log(new Date(), req.url)
  if (req.url.startsWith('/desktop')) {
    res.sendFile(path.join(__dirname, '../../index.html'))
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
    console.log(`Service is running on port ${servicePort}`)
  })
}
