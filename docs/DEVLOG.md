# DEVLOG

## 2026-05-31 — Деплой v2.0 на сервер

- Развёрнут проект на VPS (/var/www/dplus.seoservice.su).
- PostgreSQL 16 — создана БД `digitalplus`.
- Настроен Nginx + SSL (Let's Encrypt) для dplus.seoservice.su.
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
