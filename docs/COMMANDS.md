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

## Деплой новой версии

```bash
cd /var/www/dplus.seoservice.su
git pull origin main
pnpm install
cd apps/api && pnpm prisma migrate deploy
cd ../..
rm -rf apps/web/.next .turbo
pnpm build
pm2 restart dplus-api dplus-web
```

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
tail -100 /var/log/nginx/dplus.seoservice.su.error.log
cat /etc/nginx/sites-available/dplus.seoservice.su
```
