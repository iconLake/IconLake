/**
 * 环境
 */
export const ENV = {
  PRODUCTION: 'production',
  TEST: 'test',
  DEVELOPMENT: 'development'
}

/**
 * 源类型
 */
export const SOURCE_TYPE = {
  ICONFONT: 1
}

/**
 * node运行环境
 * @type {'production'|'test'|'development'}
 */
export const NODE_ENV = Object.values(ENV).indexOf(process.env.NODE_ENV) > -1 ? process.env.NODE_ENV : ENV.PRODUCTION
