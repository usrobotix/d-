module.exports = {
  apps: [
    {
      name: 'dplus-api',
      cwd: '/var/www/dplus.seoservice.su/apps/api',
      script: 'dist/index.js',
      node_args: '--dns-result-order=ipv4first',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://USER:PASSWORD@localhost:5432/DBNAME',
        JWT_SECRET: 'CHANGE_ME',
        PORT: 4000,
        CORS_ORIGIN: 'https://prodigitalplus.ru',
        SMTP_HOST: 'smtp.timeweb.ru',
        SMTP_PORT: 465,
        SMTP_USER: 'no-reply@example.ru',
        SMTP_PASS: 'CHANGE_ME',
        NOTIFY_EMAIL: 'info@example.ru',
        TG_BOT_TOKEN: 'CHANGE_ME',
        TG_CHAT_ID: 'CHANGE_ME',
        UPLOADS_DIR: './uploads',
        YANDEX_CAPTCHA_SERVER_KEY: 'CHANGE_ME'
      }
    },
    {
      name: 'dplus-web',
      cwd: '/var/www/dplus.seoservice.su/apps/web',
      script: 'npm',
      args: 'run start',
      env: { NODE_ENV: 'production', PORT: 3003 }
    }
  ]
}
