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
| Email-уведомления | nodemailer (SMTP timeweb) |
| Telegram-уведомления | Telegram Bot API (с retry-логикой) |
| Антибот | Yandex SmartCaptcha + rate-limit middleware |

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
├── ecosystem.config.js          — конфиг PM2 (НЕ в репозитории, содержит секреты)
├── ecosystem.config.example.js  — шаблон конфига PM2 (в репозитории, с плейсхолдерами)
├── pnpm-workspace.yaml
└── turbo.json
```

## Схема взаимодействия

```
Посетитель
└── HTTPS → Nginx :443 (prodigitalplus.ru)
    ├── /api/* → Express :4000 → PostgreSQL :5432
    ├── /uploads/* → Express :4000 (статика)
    └── /* → Next.js :3003

Администратор
└── HTTPS → /admin/ → Next.js SPA
    └── fetch /api/* → Express :4000
```

## Процессы PM2

| Процесс | Порт | Запуск | Примечание |
|---------|------|--------|-----------|
| dplus-api | 4000 | `node dist/index.js` | флаг `--dns-result-order=ipv4first` (стабильность исходящих запросов к Telegram) |
| dplus-web | 3003 | `npm run start` | Next.js production-сервер |

Переменные окружения для прод-процессов задаются прямо в `ecosystem.config.js` (env-блок),
поскольку PM2 не подхватывает `.env` автоматически. См. [ENV.md](./ENV.md).

## Уведомления о заявках

При создании заявки (`POST /api/leads`) бэкенд параллельно отправляет:

- **Email** через SMTP (nodemailer) на адрес из `NOTIFY_EMAIL`.
- **Telegram** в группу через Bot API. Отправка обёрнута в retry (до 4 попыток
  с короткими паузами и таймаутом 8 с на попытку) — это нивелирует случайные
  сетевые таймауты при выборе IPv6-маршрута к серверам Telegram.

Обе отправки выполняются в режиме fire-and-forget: ошибка доставки уведомления
не мешает сохранению заявки в БД.

## Защита формы

- **Yandex SmartCaptcha** — виджет на форме контактов (клиентский ключ) +
  серверная валидация токена на `POST /api/leads` (серверный ключ). Если
  серверный ключ не задан в окружении, валидация пропускается.
- **Rate-limit middleware (antispam)** — не более 3 заявок за 10 минут с одного
  IP (in-memory, сбрасывается при рестарте процесса) + honeypot-поле.

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
| `/uslugi` | Услуги (данные из БД) |
| `/keysy` | Кейсы (данные из БД) |
| `/keysy/:slug` | Детальная страница кейса |
| `/faq` | FAQ |
| `/otzyvy` | Отзывы |
| `/kontakty` | Контакты (форма с капчей) |
| `/sitemap.xml` | Карта сайта |
| `/robots.txt` | Robots |
