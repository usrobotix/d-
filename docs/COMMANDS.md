# COMMANDS

## Локальный запуск

```bash
git clone https://github.com/usrobotix/d-
cd d-
git checkout main
cp apps/api/.env.example apps/api/.env
# отредактировать apps/api/.env
pnpm install
pnpm approve-builds
cd apps/api && pnpm prisma migrate dev --name init
pnpm db:seed
cd ../.. && pnpm dev
```

## Продакшн (PM2)

```bash
pm2 status
pm2 logs dplus-api --lines 50
pm2 logs dplus-web --lines 50
pm2 restart dplus-api
pm2 restart dplus-web
pm2 save
```

Прод-переменные окружения хранятся в `ecosystem.config.js` (env-блок), а не в `.env`.
После их изменения перезапускать процессы нужно с флагом `--update-env`:

```bash
pm2 restart ecosystem.config.js --update-env
```

## Деплой новой версии

```bash
cd /var/www/dplus.seoservice.su
git pull origin main
pnpm install
cd apps/api && pnpm prisma migrate deploy
cd ../..
rm -rf apps/web/.next .turbo
pnpm build
pm2 restart ecosystem.config.js --update-env
```

> Примечание: путь на сервере исторически `/var/www/dplus.seoservice.su`
> (не переименовывался), хотя домен проекта — `prodigitalplus.ru`.

> Важно: `NEXT_PUBLIC_*` переменные вшиваются в бандл на этапе `pnpm build`.
> После изменения публичных переменных (например, ключа капчи) нужна полная
> пересборка: `rm -rf apps/web/.next && pnpm build`.

## База данных

```bash
# Подключиться
sudo -u postgres psql digitalplus

# Миграция (dev)
cd apps/api && pnpm prisma migrate dev --name <name>

# Миграция (prod)
cd apps/api && pnpm prisma migrate deploy

# Сиды
cd apps/api && pnpm db:seed

# Просмотр в браузере
cd apps/api && pnpm prisma studio

# Бэкап
sudo -u postgres pg_dump digitalplus > backup_$(date +%Y%m%d).sql

# Восстановление
sudo -u postgres psql digitalplus < backup_20260531.sql
```

## Nginx

```bash
nginx -t
systemctl reload nginx
tail -100 /var/log/nginx/prodigitalplus.ru.error.log
cat /etc/nginx/sites-available/prodigitalplus.ru
```

## SSL (Let's Encrypt)

```bash
# Выпуск/перевыпуск сертификата
certbot --nginx -d prodigitalplus.ru -d www.prodigitalplus.ru

# Проверка автообновления
certbot renew --dry-run
```

## Уведомления (диагностика)

```bash
# Логи отправки email/telegram
pm2 logs dplus-api --lines 20 --nostream

# Тест доставки в Telegram напрямую
curl -s -X POST "https://api.telegram.org/bot<TG_BOT_TOKEN>/sendMessage" \
  -d "chat_id=<TG_CHAT_ID>" -d "text=test" -o /dev/null -w "%{http_code}\n"
```
