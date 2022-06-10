import { ENV } from './const.js'

/**
 * 获取node环境变量
 * @returns {'production'|'test'|'development'}
 */
export function getNodeEnv () {
  return Object.values(ENV).indexOf(process.env.NODE_ENV) > -1 ? process.env.NODE_ENV : ENV.PRODUCTION
}
