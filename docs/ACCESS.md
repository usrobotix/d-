# ACCESS

## Команда

| Имя | Роль |
|-----|------|
| Разработчик | Разработка и деплой |
| Контент-менеджер | Наполнение через CMS-админку |

## Уровни доступа

| Область | Кто |
|---------|-----|
| GitHub репо (push в main) | Разработчик |
| SSH к серверу | Разработчик |
| CMS-админка /admin/ | Разработчик, контент-менеджер |
| PostgreSQL | Разработчик |

## Правила

- Правки кода — через ветку + PR в `main`.
- Не коммитить `apps/api/.env` и `apps/web/.env.local`.
- Не коммитить `ecosystem.config.js` — он содержит прод-секреты и исключён из git
  (в `.gitignore` и удалён из индекса). Для шаблона есть `ecosystem.config.example.js`.
- Папка `apps/api/uploads/` в `.gitignore` — файлы не в репо.

## Доступы к сервисам

| Сервис | Где хранится |
|--------|-------------|
| SSH-ключ сервера | У разработчика |
| Пароль БД | `apps/api/.env` (dev) / `ecosystem.config.js` (prod) |
| JWT-секрет | `apps/api/.env` (dev) / `ecosystem.config.js` (prod) |
| SMTP-пароль | `ecosystem.config.js` (prod) |
| Telegram bot token | `ecosystem.config.js` (prod) |
| Yandex SmartCaptcha (серверный ключ) | `ecosystem.config.js` (prod) |
| Yandex SmartCaptcha (клиентский ключ) | `apps/web/.env.local` (публичный) |
| GitHub токен | У разработчика |
