# DEVLOG

## 2026-06-01 — Уведомления, капча, перенос домена

- Проект переведён с поддомена `dplus.seoservice.su` на домен **prodigitalplus.ru**.
  Старый поддомен отвязан (удалён симлинк в nginx sites-enabled, конфиг сохранён как бэкап).
- Новый nginx-конфиг `prodigitalplus.ru` + SSL Let's Encrypt (certbot, `prodigitalplus.ru` и `www`).
- Обновлены env: CORS_ORIGIN, NEXT_PUBLIC_API_URL и др. на новый домен.
- **SMTP-уведомления**: отправка email о заявках через nodemailer (smtp.timeweb.ru:465).
- **Telegram-уведомления**: бот шлёт заявки в группу. Добавлена retry-логика (до 4 попыток,
  таймаут 8 с) для устойчивости к случайным IPv6-таймаутам; для PM2-процесса dplus-api
  добавлен флаг `--dns-result-order=ipv4first`.
- **Yandex SmartCaptcha**: виджет на форме контактов (клиентский ключ в `NEXT_PUBLIC_*`)
  + серверная валидация токена на `POST /api/leads` (серверный ключ).
- Антиспам: rate-limit 3 запроса / 10 минут с IP + honeypot (оставлен как есть).
- Услуги и кейсы переведены со статики на данные из БД.
- `ecosystem.config.js` (содержит секреты) убран из git-индекса и `.gitignore`,
  добавлен шаблон `ecosystem.config.example.js`.
- PM2: запуск dplus-web переведён на `npm run start` (порт 3003); переменные окружения
  прод-процессов вынесены в env-блок ecosystem (PM2 не читает .env).

## 2026-05-31 — Деплой v2.0 на сервер

- Развёрнут проект на VPS (/var/www/dplus.seoservice.su).
- PostgreSQL 16 — создана БД `digitalplus`.
- Настроен Nginx + SSL (Let's Encrypt).
- Запущены PM2 процессы: `dplus-api` (порт 4000), `dplus-web` (порт 3003).
- Исправлены TypeScript ошибки (req.params типизация, strict mode).
- Исправлена несовместимость полей фронтенда и схемы Prisma.
- Добавлен роут /api/users (CRUD пользователей).
- Добавлены роуты /api/cases/by-id/:id и /api/services/by-id/:id.
- Исправлены методы HTTP (PATCH → PUT) в соответствии с API.
- Инициализированы сиды: настройки, admin, услуги, кейсы, FAQ, отзывы.

## 2026-05-01 — Инициализация проекта

- Созданы прототипы страниц и брендбук.
- Инициализирован монорепозиторий (Next.js 14 + Express + Turborepo).
- Разработана схема БД (Prisma).
