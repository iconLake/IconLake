import * as express from "express"
import { rendererRootPath, isProduction, proxyTarget, getServicePort, getDomain, certsPath } from "../utils"
import { createProxyMiddleware } from "http-proxy-middleware/dist"
import * as path from "path"
import * as fs from "fs"
import * as https from "https"
import { X509Certificate } from "crypto"

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
  changeOrigin: true,
  cookieDomainRewrite: 'localhost.iconlake.com',
}))

async function downloadCert() {
  const files = [
    'localhost.iconlake.com.crt',
    'localhost.iconlake.com.key',
  ]

  const res = await Promise.all(files.map(async (file) => {
    const txt = await fetch(`${proxyTarget}/certs/${file}`).then(r => r.text())
    return txt
  }))
  if (!fs.existsSync(certsPath)) {
    fs.mkdirSync(certsPath)
  }
  fs.writeFileSync(path.join(certsPath, 'server.crt'), res[0])
  fs.writeFileSync(path.join(certsPath, 'server.key'), res[1])
}

async function checkCert() {
  const files = [
    'server.crt',
    'server.key',
  ]
  for (const file of files) {
    if (!fs.existsSync(path.join(certsPath, file))) {
      return false
    }
  }

  const cert = new X509Certificate(fs.readFileSync(path.join(certsPath, 'server.crt')))
  const now = Date.now()
  if (new Date(cert.validTo).getTime() < now) {
    return false
  }

  return true
}

export async function startService() {
  const servicePort = await getServicePort()
  if (!await checkCert()) {
    await downloadCert()
  }
  https.createServer({
    cert: fs.readFileSync(path.join(certsPath, 'server.crt')),
    key: fs.readFileSync(path.join(certsPath, 'server.key')),
  }, app).listen(servicePort, () => {
    console.log(`Service is running at https://localhost.iconlake.com:${servicePort}`)
  })
}
