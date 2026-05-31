# Диджитал плюс — Сайт + Админка + SEO-модуль

Монорепозиторий веб-агентства «Диджитал плюс». Стек: Next.js 14 (App Router) + Express + PostgreSQL.

## Стек

| Слой | Технологии |
|---|---|
| Фронтенд | Next.js 14, TypeScript, App Router |
| Бэкенд | Node.js, Express, Prisma ORM |
| БД | PostgreSQL 16 |
| Медиа | sharp (webp/avif) |
| Шрифты | Geist + Geist Mono (Google Fonts) |

## Структура

```
digitalplus/
├── apps/
│   ├── web/          — Next.js 14 фронтенд (порт 3000)
│   └── api/          — Express + Prisma бэкенд (порт 4000)
├── packages/
│   └── types/        — Общие TypeScript типы
├── docker-compose.yml
├── pnpm-workspace.yaml
└── turbo.json
```

## Публичные страницы

| URL | Описание |
|---|---|
| `/` | Главная (герой, услуги, цифры, процесс, кейсы, отзывы, FAQ, форма) |
| `/uslugi` | Услуги (4 направления с пакетами и ценами) |
| `/keysy` | Кейсы с фильтром по направлениям |
| `/keysy/:slug` | Детальная страница кейса |
| `/faq` | Вопросы и ответы (6 категорий) |
| `/otzyvy` | Отзывы (письма, текст, видео, фото) |
| `/kontakty` | Контакты, реквизиты, форма заявки |

## Запуск (dev)

### 1. Предварительные требования

- Node.js 18+
- pnpm 8+
- PostgreSQL 16 (или Docker)

### 2. Переменные окружения

```bash
cp .env.example apps/api/.env
# Отредактируйте apps/api/.env
```

### 3. Запуск БД через Docker

```bash
docker-compose up -d postgres
```

### 4. Установка зависимостей

```bash
pnpm install
```

### 5. Миграция БД + сиды

```bash
cd apps/api
pnpm prisma migrate dev --name init
pnpm db:seed
```

### 6. Запуск всего монорепо

```bash
pnpm dev
```

Или по отдельности:

```bash
# API (порт 4000)
cd apps/api && pnpm dev

# Web (порт 3000)
cd apps/web && pnpm dev
```

## Переменные окружения (API)

| Переменная | Описание | Пример |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/digitalplus` |
| `JWT_SECRET` | Секрет для JWT | `long_random_string` |
| `PORT` | Порт API | `4000` |
| `CORS_ORIGIN` | Разрешённый origin | `http://localhost:3000` |
| `SMTP_HOST` | SMTP хост | `smtp.mail.ru` |
| `SMTP_PORT` | SMTP порт | `465` |
| `SMTP_USER` | SMTP пользователь | — |
| `SMTP_PASS` | SMTP пароль | — |
| `NOTIFY_EMAIL` | Email для уведомлений о заявках | `info@prodigitalplus.ru` |
| `TG_BOT_TOKEN` | Токен Telegram-бота (опционально) | — |
| `TG_CHAT_ID` | ID чата для уведомлений (опционально) | — |
| `UPLOADS_DIR` | Директория загрузок | `./uploads` |

## Переменные окружения (Web)

| Переменная | Описание | Пример |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL API | `http://localhost:4000` |

## Миграции и сиды

```bash
# Создать новую миграцию после изменения schema.prisma
cd apps/api && pnpm prisma migrate dev --name <name>

# Применить в production
cd apps/api && pnpm prisma migrate deploy

# Запустить сиды (перезаписывает данные)
cd apps/api && pnpm db:seed

# Просмотр БД в браузере
cd apps/api && pnpm prisma studio
```

## Доступ в админку

После запуска сидов создаётся пользователь-администратор:

- URL: `http://localhost:3000/admin`
- Email: `admin@prodigitalplus.ru`
- Пароль: `admin123`

**Смените пароль после первого входа!**

## Роли пользователей

| Роль | Доступ |
|---|---|
| `admin` | Полный доступ |
| `editor` | Контент + медиа, без настроек и пользователей |
| `seo` | SEO-поля + редиректы |

## Сборка для production

```bash
pnpm build
```

Рекомендуется PM2 или Docker Compose для продакшена.

## SEO

- `generateMetadata()` на каждой странице: title, description, canonical, OG, noindex
- JSON-LD: Organization/LocalBusiness, BreadcrumbList, FAQPage, Service
- `sitemap.xml` → `/sitemap.xml`
- `robots.txt` → `/robots.txt`
- Редиректы 301/302 управляются из БД через Next.js middleware

## API endpoints

| Endpoint | Описание |
|---|---|
| `GET /api/services` | Список услуг |
| `GET /api/services/:slug` | Одна услуга |
| `GET /api/cases` | Список кейсов |
| `GET /api/cases/:slug` | Один кейс |
| `GET /api/faq` | FAQ по категориям |
| `GET /api/testimonials` | Отзывы |
| `GET /api/settings` | Глобальные настройки |
| `POST /api/leads` | Создать заявку (с антиспамом) |
| `POST /api/auth/login` | Авторизация → JWT |
| `GET /api/auth/me` | Текущий пользователь |

Все PUT/POST/DELETE требуют `Authorization: Bearer <token>`.
