# ARCHITECTURE

## Тип проекта

Монорепозиторий: корпоративный сайт веб-агентства с REST API, CMS-админкой и PostgreSQL.

## Стек

| Слой | Технология |
|------|-----------|
| Фронтенд | Next.js 14, TypeScript, App Router |
| Бэкенд | Node.js 22, Express, Prisma ORM |
| БД | PostgreSQL 16 |
| Медиа | sharp (webp/avif) |
| Сборка | Turborepo, pnpm workspaces |
| Процесс | PM2 |
| Веб-сервер | Nginx (reverse proxy) |
| SSL | Let's Encrypt (Certbot, автообновление) |

## Структура репозитория

```
digitalplus/
├── apps/
│   ├── web/          — Next.js 14 фронтенд (порт 3003)
│   └── api/          — Express + Prisma бэкенд (порт 4000)
├── packages/
│   └── types/        — Общие TypeScript типы
├── docs/             — документация проекта
├── old/              — исходные прототипы и макеты
├── pnpm-workspace.yaml
└── turbo.json
```

## Схема взаимодействия

```
Посетитель
└── HTTPS → Nginx :443
    ├── /api/* → Express :4000 → PostgreSQL :5432
    ├── /uploads/* → Express :4000 (статика)
    └── /* → Next.js :3003

Администратор
└── HTTPS → /admin/ → Next.js SPA
    └── fetch /api/* → Express :4000
```

## Таблицы БД (Prisma)

| Модель | Описание |
|--------|----------|
| User | Пользователи админки (admin/editor/seo) |
| Service | Услуги (4 направления) |
| Case | Кейсы/портфолио |
| FaqCategory | Категории FAQ |
| FaqItem | Вопросы и ответы |
| Testimonial | Отзывы |
| Lead | Заявки с сайта |
| Media | Загруженные файлы |
| Settings | Настройки сайта (key-value) |
| Redirect | 301/302 редиректы |
| AuditLog | Журнал действий |

## Публичные страницы

| URL | Описание |
|-----|----------|
| `/` | Главная |
| `/uslugi` | Услуги |
| `/keysy` | Кейсы |
| `/keysy/:slug` | Детальная страница кейса |
| `/faq` | FAQ |
| `/otzyvy` | Отзывы |
| `/kontakty` | Контакты |
| `/sitemap.xml` | Карта сайта |
| `/robots.txt` | Robots |
