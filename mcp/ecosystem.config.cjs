module.exports = {
  apps: [{
    name: 'mcp-server-iconlake',
    script: 'dist/sse.js',
    watch: 'dist',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    env: {
      ICONLAKE_ENDPOINT: 'https://iconlake.com',
      ICONLAKE_ACCESS_KEY: 'your-access-key-here',
    }
  }]
}
