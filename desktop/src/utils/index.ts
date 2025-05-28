import { app } from "electron"
import * as path from "path"

export const isProduction = app.isPackaged || process.env.NODE_ENV === 'production'

export const codesPath = path.join(app.getPath('userData'), 'codes')

export const themeCodesPath = path.join(codesPath, 'theme')

export const servicePort = 19090

export const mainPageUrl = `http://127.0.0.1:${servicePort}/login`

export const proxyTarget = isProduction ? 'https://iconlake.com' : 'http://127.0.0.1:8080'
