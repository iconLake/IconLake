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
 *    http: {\
 *      port: number\
 *    }\
 *    mongodb: {\
 *      uri: string\
 *    }\
 * }}
 */
export function getConfig (env) {
  const config = configs[env || NODE_ENV]
  if (!(config.http && config.http.port)) {
    throw new Error('[ConfigError] HTTP port is required.')
  }
  if (!config.mongodb.uri) {
    throw new Error('[ConfigError] MongoDB uri is required.')
  }
  return config
}
