import { getNodeEnv } from '../utils/index.js'

export const configs = {
  production: {
    http: {
      port: 80
    },
    https: {
      port: 443,
      ca: './security/certs/root_bundle.crt',
      key: './security/certs/iconlake.com.key',
      cert: './security/certs/iconlake.com.crt'
    },
    mongodb: {
      uri: ''
    },
    gitee: {
      clientId: '',
      clientSecret: ''
    },
    github: {
      clientId: '',
      clientSecret: ''
    }
  },
  test: {
    http: {
      port: 8080
    },
    https: {
      port: 8443,
      ca: './security/certs/root_bundle.crt',
      key: './security/certs/iconlake.com.key',
      cert: './security/certs/iconlake.com.crt'
    },
    mongodb: {
      uri: ''
    },
    gitee: {
      clientId: '',
      clientSecret: ''
    },
    github: {
      clientId: '',
      clientSecret: ''
    }
  },
  development: {
    http: {
      port: 8088
    },
    mongodb: {
      uri: ''
    },
    gitee: {
      clientId: '',
      clientSecret: ''
    },
    github: {
      clientId: '',
      clientSecret: ''
    }
  }
}

/**
 * 获取配置
 * @param {string} [env='production']
 * @returns {{http: {port: number}, https: {port: number, ca: string, key: string, cert: string}, mongodb: {uri: string}, gitee: {clientId: string, clientSecret: string}, github: {clientId: string, clientSecret: string}}}
 */
export function getConfig (env) {
  const config = configs[env || getNodeEnv()]
  if (!(config.http && config.http.port) && !(config.https && config.https.port)) {
    throw new Error('[ConfigError] HTTP(S) port is required.')
  }
  if (!config.mongodb.uri) {
    throw new Error('[ConfigError] MongoDB uri is required.')
  }
  return config
}
