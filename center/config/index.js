import { getNodeEnv } from '../utils/index.js'

export const configs = {
  production: {
    http: {
      port: 9999
    },
    mongodb: {
      uri: ''
    }
  },
  test: {
    http: {
      port: 9669
    },
    mongodb: {
      uri: ''
    }
  },
  development: {
    http: {
      port: 9009
    },
    mongodb: {
      uri: ''
    }
  }
}

/**
 * 获取配置
 * @param {string} [env='production']
 * @returns {{http: {port: number}, mongodb: {uri: string}}}
 */
export function getConfig (env) {
  const config = configs[env || getNodeEnv()]
  if (!(config.http && config.http.port)) {
    throw new Error('[ConfigError] HTTP port is required.')
  }
  if (!config.mongodb.uri) {
    throw new Error('[ConfigError] MongoDB uri is required.')
  }
  return config
}
