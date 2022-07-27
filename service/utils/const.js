/**
 * token有效期
 */
export const TOKEN_MAX_AGE = 7 * 24 * 3600 * 1000

/**
 * 源类型
 */
export const SOURCE_TYPE = {
  ICONFONT: 1
}

/**
 * 环境
 */
export const ENV = {
  PRODUCTION: 'production',
  TEST: 'test',
  DEVELOPMENT: 'development'
}

/**
 * node运行环境
 * @type {'production'|'test'|'development'}
 */
export const NODE_ENV = Object.values(ENV).indexOf(process.env.NODE_ENV) > -1 ? process.env.NODE_ENV : ENV.PRODUCTION

/**
 * 根路径
 */
export const ROOT = process.cwd()

/**
 * 资源缓存时长
 */
export const RESOURCE_MAX_AGE = (NODE_ENV === ENV.PRODUCTION) ? 7 * 24 * 3600 * 1000 : 0

/**
 * 错误码
 */
export const ERROR_CODE = {
  ARGS_ERROR: 'argsError',
  FAIL: 'fail',
  USER_NOT_LOGIN: 'userNotLogin',
  TOKEN_EXPIRED: 'tokenExpired'
}
