const ENV = {
  PRODUCTION: 'production',
  TEST: 'test',
  DEVELOPMENT: 'development'
}

module.exports = {
  apps: [{
    name: 'center',
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
    instances: 1,
    exec_mode: 'fork',
    watch: process.env.NODE_ENV === ENV.PRODUCTION
      ? false
      : ['./app.js', './routes', './controllers', './models', './utils', './config'],
    max_memory_restart: '4G'
  }]
}
