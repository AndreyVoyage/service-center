# 🗄️ Настройка БД service_center

## Шаг 1: Создать БД в pgAdmin

1. Откройте **pgAdmin 4**
2. Подключитесь к серверу PostgreSQL
3. Правый клик на **Databases** → **Create** → **Database**
4. Введите имя: `service_center`
5. Нажмите **Save**

## Шаг 2: Создать таблицы

1. Правый клик на БД `service_center` → **Query Tool**
2. Откройте файл `create-database-full.sql`
3. Нажмите **F5** (Execute)
4. Должно появиться сообщение "Tables created successfully"

## Шаг 3: Обновить .env.local

**Файл:** `apps/cms/.env.local`

```env
# Изменить имя БД
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/service_center

# Payload secret (если нет)
PAYLOAD_SECRET=your-secret-key-min-32-chars-long!!!
```

## Шаг 4: Проверить payload.config.ts

Убедитесь что `push: false`:

```typescript
db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URI },
  push: false,  // Таблицы уже созданы вручную
}),
```

## Шаг 5: Очистить кэш

```bash
# Удалить старые кэши
rm -rf apps/cms/.next apps/web/.next
```

## Шаг 6: Запустить

```bash
pnpm dev
```

## Шаг 7: Проверить

```bash
# Проверить health endpoint
curl http://localhost:3001/api/health

# Должно вернуть:
# {"status":"ok","data":{"hero":true,"footer":true,"contactForm":true}}
```

## Шаг 8: Создать первого пользователя

1. Откройте http://localhost:3001/admin
2. Заполните форму создания первого пользователя
3. Войдите в админку

## Готово! 🎉

База данных настроена и готова к работе.
