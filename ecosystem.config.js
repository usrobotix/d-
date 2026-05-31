module.exports = {
  apps: [
    {
      name: 'dplus-api',
      cwd: '/var/www/dplus.seoservice.su/apps/api',
      script: 'dist/index.js',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'dplus-web',
      cwd: '/var/www/dplus.seoservice.su/apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      env: { NODE_ENV: 'production' }
    }
  ]
}
