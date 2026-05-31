# ENV

## API (apps/api/.env)

```
DATABASE_URL="postgresql://digitalplus:пароль@localhost:5432/digitalplus"
JWT_SECRET=случайная_строка_32+_символа
PORT=4000
CORS_ORIGIN=https://dplus.seoservice.su
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
NOTIFY_EMAIL=info@prodigitalplus.ru
TG_BOT_TOKEN=
TG_CHAT_ID=
UPLOADS_DIR=./uploads
```

## Web (apps/web/.env.local)

```
NEXT_PUBLIC_API_URL=https://dplus.seoservice.su
```

## Генерация JWT секрета

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
