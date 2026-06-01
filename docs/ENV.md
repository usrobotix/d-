# ENV

## Где хранятся переменные

| Окружение | Файл | Кто читает |
|-----------|------|-----------|
| Локальная разработка | `apps/api/.env`, `apps/web/.env.local` | dotenv / Next.js |
| Продакшн (PM2) | `ecosystem.config.js` (env-блок) | PM2 |

> Важно: на проде PM2 **не** подхватывает `.env` автоматически — все переменные
> для боевых процессов прописаны прямо в `ecosystem.config.js`. Файл с реальными
> значениями **не** в репозитории (в `.gitignore` и удалён из индекса git).
> В репозитории есть только шаблон `ecosystem.config.example.js` с плейсхолдерами.
> После правки переменных перезапуск: `pm2 restart ecosystem.config.js --update-env`.

## API (apps/api/.env)

```
DATABASE_URL="postgresql://digitalplus:пароль@localhost:5432/digitalplus"
JWT_SECRET=случайная_строка_32+_символа
PORT=4000
CORS_ORIGIN=https://prodigitalplus.ru
SMTP_HOST=smtp.timeweb.ru
SMTP_PORT=465
SMTP_USER=no-reply@prodigitalplus.ru
SMTP_PASS=
NOTIFY_EMAIL=info@prodigitalplus.ru
TG_BOT_TOKEN=
TG_CHAT_ID=
UPLOADS_DIR=./uploads
YANDEX_CAPTCHA_SERVER_KEY=
```

## Web (apps/web/.env.local)

```
NEXT_PUBLIC_API_URL=https://prodigitalplus.ru
NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY=
```

> `NEXT_PUBLIC_*` вшиваются в бандл на этапе сборки. После их изменения нужна
> полная пересборка фронтенда: `rm -rf apps/web/.next && pnpm build`.

## Описание переменных

| Переменная | Назначение |
|------------|-----------|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `JWT_SECRET` | Секрет для подписи JWT-токенов админки |
| `PORT` | Порт Express API (4000) |
| `CORS_ORIGIN` | Разрешённый origin для CORS (домен сайта) |
| `SMTP_HOST` / `SMTP_PORT` | SMTP-сервер для email-уведомлений (timeweb, 465/SSL) |
| `SMTP_USER` / `SMTP_PASS` | Учётные данные SMTP |
| `NOTIFY_EMAIL` | Адрес, на который приходят заявки |
| `TG_BOT_TOKEN` | Токен Telegram-бота для уведомлений |
| `TG_CHAT_ID` | ID чата/группы для уведомлений (для групп — отрицательный) |
| `UPLOADS_DIR` | Папка для загруженных медиафайлов |
| `YANDEX_CAPTCHA_SERVER_KEY` | Серверный ключ SmartCaptcha (валидация на бэкенде) |
| `NEXT_PUBLIC_API_URL` | URL API для фронтенда |
| `NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY` | Клиентский (публичный) ключ SmartCaptcha |

## Генерация JWT секрета

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
