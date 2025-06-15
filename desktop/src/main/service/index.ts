import * as express from "express"
import { rendererRootPath, isProduction, proxyTarget, getServicePort, certsPath } from "../utils"
import { createProxyMiddleware } from "http-proxy-middleware/dist"
import * as path from "path"
import * as fs from "fs"
import * as https from "https"
import { X509Certificate } from "crypto"
import { apiMiddleware, apiRouter } from "./api"
import { localhostCert, localhostKey } from "../utils/cert"

const app = express()

app.use('/desktop/api', express.json(), apiMiddleware, apiRouter)

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
        target: 'http://127.0.0.1:19080',
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
  const defaultCert: {
    [key: string]: string
  } = {
    crt: localhostCert,
    key: localhostKey,
  }

  const res = await Promise.all(files.map(async (file) => {
    const response = await fetch(`${proxyTarget}/certs/${file}`)
    if (response.status !== 200) {
      return defaultCert[file.slice(-3)]
    }
    return await response.text().catch(() => defaultCert[file.slice(-3)])
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

  try {
    const cert = new X509Certificate(fs.readFileSync(path.join(certsPath, 'server.crt')))
    const now = Date.now()
    if (new Date(cert.validTo).getTime() < now) {
      return false
    }
  } catch (e) {
    fs.rmSync(path.join(certsPath, 'server.crt'))
    fs.rmSync(path.join(certsPath, 'server.key'))
    console.error('checkCert error:', e)
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
