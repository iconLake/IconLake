export const ONE_DAY_SECONDS = 24 * 3600 * 1000

/**
 * token有效期
 */
export const TOKEN_MAX_AGE = 7 * ONE_DAY_SECONDS

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
 * 头像路径
 */
export const AVATAR_PATH = 'avatar/'

/**
 * 图标路径
 */
export const ICON_PATH = 'icon/'

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
  TOKEN_EXPIRED: 'tokenExpired',
  PERMISSION_DENIED: 'permissionDenied',
  NOT_EXIST: 'notExist',
  INTERNAL_ERROR: 'internalError',
  NOT_ENABLED: 'notEnabled',
  STORAGE_LIMITED: 'storageLimited'
}

/**
 * 永久文件的最大数量
 */
export const PERMAMENT_FILES_MAX_NUM = 5

/**
 * 永久文件的过期时间
 */
export const PERMANENT_FILE_EXPIRE = 9999

/**
 * 临时文件的过期时间
 */
export const TEMPORARY_FILE_EXPIRE = 30

/**
 * 云服务类型
 */
export const CLOUD_TYPE = {
  TENCENT: 'tencent'
}

export const DROP_DENOM = 'DROP'
export const DROP_DENOM_MINI = 'udrop'

export const LAKE_DENOM = 'LAKE'
export const LAKE_DENOM_MINI = 'ulake'

export const ADDRESS_PREFIX = 'iconlake'

export const PROJECT_TYPE = {
  SVG: 1,
  IMG: 2
}

export const PROJECT_STYLE = {
  DEFAULT: 0,
  TIDY: 1
}
