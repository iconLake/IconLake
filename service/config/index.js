import { NODE_ENV } from '../utils/const.js'

export const configs = {
  production: {
    domain: 'https://iconlake.com',
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
    },
    center: {
      domain: 'http://127.0.0.1:9999'
    },
    cos: {
      domain: 'https://cdn.iconlake.com',
      type: 'tencent',
      secretId: '',
      secretKey: '',
      bucket: '',
      region: ''
    }
  },
  test: {
    domain: 'https://iconlake.com:8443',
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
    },
    center: {
      domain: 'http://127.0.0.1:9669'
    },
    cos: {
      domain: 'https://cdn.iconlake.com',
      type: 'tencent',
      secretId: '',
      secretKey: '',
      bucket: '',
      region: ''
    }
  },
  development: {
    domain: 'http://127.0.0.1:8088',
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
    },
    center: {
      domain: 'http://127.0.0.1:9009'
    },
    cos: {
      domain: 'https://cdn.iconlake.com',
      type: 'tencent',
      secretId: '',
      secretKey: '',
      bucket: '',
      region: ''
    }
  }
}

/**
 * 获取配置
 * @param {string} [env='production']
 * @returns {{domain: string, http: {port: number}, https: {port: number, ca: string, key: string, cert: string}, mongodb: {uri: string}, gitee: {clientId: string, clientSecret: string}, github: {clientId: string, clientSecret: string}, center: {domain: string}, cos: {type: 'tencent', secretId: string, secretKey: string, bucket: string, region: string}}}
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
