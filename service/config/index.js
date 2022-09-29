import { createRequire } from 'node:module'
import { NODE_ENV } from '../utils/const.js'

const require = createRequire(import.meta.url)

const production = require('./production.json')
const test = require('./test.json')
const development = require('./development.json')

export const configs = {
  production,
  test,
  development
}

/**
 * 获取配置
 * @param {string} [env] 默认当前环境
 * @returns {{\
 *    domain: string\
 *    http: {\
 *      port: number\
 *    }\
 *    https: {\
 *      port: number\
 *      ca: string\
 *      key: string\
 *      cert: string\
 *    }\
 *    mongodb: {\
 *      uri: string\
 *    }\
 *    gitee: {\
 *      clientId: string\
 *      clientSecret: string\
 *    }\
 *    github: {\
 *      clientId: string,\
 *      clientSecret: string\
 *    }\
 *    center: {\
 *      domain: string\
 *    }\
 *    cos: {\
 *      domain: string\
 *      type: string\
 *      secretId: string\
 *      secretKey: string\
 *      bucket: string\
 *      region: string\
 *    }\
 *    login: {\
 *      code: boolean\
 *      gitee: boolean\
 *      github: boolean\
 *    }\
 *  }}
 */
export function getConfig (env) {
  const config = configs[env || NODE_ENV]
  if (!(config.http && config.http.port) && !(config.https && config.https.port)) {
    throw new Error('[ConfigError] HTTP(S) port is required.')
  }
  if (!config.mongodb.uri) {
    throw new Error('[ConfigError] MongoDB uri is required.')
  }
  return config
}
