# API Reference

Base URL: `https://dplus.seoservice.su/api`

## Публичные эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | /health | Проверка сервера |
| GET | /api/services | Список услуг |
| GET | /api/services/:slug | Одна услуга |
| GET | /api/cases | Список кейсов |
| GET | /api/cases/:slug | Один кейс |
| GET | /api/faq | FAQ по категориям |
| GET | /api/testimonials | Отзывы |
| GET | /api/settings | Глобальные настройки |
| POST | /api/leads | Создать заявку |

## Авторизация

```
POST /api/auth/login
{ "email": "...", "password": "..." }
→ { "token": "eyJ...", "user": { "id", "email", "name", "role" } }

GET /api/auth/me
Header: Authorization: Bearer <token>
```

## Админские эндпоинты (JWT обязателен)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/cases?all=1 | Все кейсы включая черновики |
| GET | /api/cases/by-id/:id | Кейс по ID |
| POST | /api/cases | Создать кейс |
| PUT | /api/cases/:id | Обновить кейс |
| DELETE | /api/cases/:id | Удалить кейс |
| GET | /api/services/by-id/:id | Услуга по ID |
| PUT | /api/services/:id | Обновить услугу |
| GET | /api/leads | Список заявок |
| PUT | /api/leads/:id | Обновить заявку |
| DELETE | /api/leads/:id | Удалить заявку |
| GET | /api/media | Список файлов |
| POST | /api/media | Загрузить файл |
| DELETE | /api/media/:id | Удалить файл |
| GET | /api/settings | Все настройки |
| PUT | /api/settings/:id | Обновить настройку |
| GET | /api/redirects | Список редиректов |
| POST | /api/redirects | Создать редирект |
| PUT | /api/redirects/:id | Обновить редирект |
| DELETE | /api/redirects/:id | Удалить редирект |
| GET | /api/users | Список пользователей |
| POST | /api/users | Создать пользователя |
| PUT | /api/users/:id | Обновить пользователя |
| DELETE | /api/users/:id | Удалить пользователя |

## Роли пользователей

| Роль | Доступ |
|------|--------|
| admin | Полный доступ |
| editor | Контент + медиа, без настроек и пользователей |
| seo | SEO-поля + редиректы |
