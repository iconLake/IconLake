/**
 * 获取参数
 * @param {string} name 参数名
 * @returns {string}
 */
function getArgv (name) {
  const { argv } = process
  for (let i = 0, len = argv.length; i < len; ++i) {
    if (`--${name}` === argv[i]) {
      return argv[i + 1] || ''
    }
  }
  return ''
}

const ENV = {
  PRODUCTION: 'production',
  TEST: 'test',
  DEVELOPMENT: 'development'
}

const env = getArgv('env') || ENV.DEVELOPMENT

// pro环境配置，默认
let name = 'service'
let instances = -1
let watch = false

if (env === ENV.DEVELOPMENT) { // dev环境
  name += '-dev'
  instances = 1
  watch = ['./app.js', './routes', './controllers', './models', './utils', './config', './public/monitor/index.js']
} else if (env === ENV.TEST) { // test环境
  name += '-test'
  instances = 2
}

module.exports = {
  apps: [{
    name,
    script: './app.js',
    [`env_${ENV.PRODUCTION}`]: {
      NODE_ENV: ENV.PRODUCTION
    },
    [`env_${ENV.TEST}`]: {
      NODE_ENV: ENV.TEST
    },
    env: {
      NODE_ENV: ENV.DEVELOPMENT
    },
    instances,
    exec_mode: 'cluster',
    watch,
    max_memory_restart: '4G'
  }]
}
