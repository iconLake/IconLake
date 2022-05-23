const ENV = {
  PRODUCTION: 'production',
  TEST: 'test',
  DEVELOPMENT: 'development'
}

module.exports = {
  apps: [{
    name: 'service',
    script: './app.js',
    env_production: {
      NODE_ENV: ENV.PRODUCTION
    },
    env_test: {
      NODE_ENV: ENV.TEST
    },
    env: {
      NODE_ENV: ENV.DEVELOPMENT
    },
    instances: process.env.NODE_ENV === ENV.PRODUCTION ? -1 : 1,
    exec_mode: 'cluster',
    watch: process.env.NODE_ENV === ENV.PRODUCTION
      ? false
      : ['./app.js', './routes', './controllers', './models', './utils', './config', './public/monitor/index.js'],
    max_memory_restart: '4G'
  }]
}
