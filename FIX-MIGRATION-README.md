# 🚨 Критический фикс: Drizzle миграции блокируют API

## Проблема
Drizzle ORM пытается применить миграцию `source_page_id` при каждом запросе, блокируя API на 20-30 секунд.

## Быстрый фикс (2 минуты)

### Шаг 1: Остановить auto-push
Уже применено в `apps/cms/src/payload.config.ts`:
```typescript
push: false,  // Было: push: true
```

### Шаг 2: Применить миграцию (выберите способ)

#### Способ A: Через Payload CLI (рекомендуется)
```bash
cd apps/cms

# Создать миграцию
pnpm payload migrate:create

# Применить миграцию
pnpm payload migrate
```

#### Способ B: Через SQL напрямую
```bash
# Убедитесь что DATABASE_URI установлен
export DATABASE_URI="postgresql://postgres:postgres@localhost:5432/service_center"

# Применить SQL
psql $DATABASE_URI -f apps/cms/fix-migration.sql
```

#### Способ C: Через Node.js скрипт
```bash
cd apps/cms
node migrate-fix.js
```

### Шаг 3: Перезапустить серверы
```bash
# Остановить
Ctrl+C

# Перезапустить
pnpm dev
```

## Проверка

После применения фикса:
```bash
# Проверить health CMS
curl http://localhost:3001/api/health

# Ожидаемый результат (< 500ms):
{
  "status": "healthy",
  "latency": 45,
  "services": { "database": "connected", "api": "ok" }
}
```

## Что изменено

1. **CMS** (`apps/cms/src/payload.config.ts`):
   - `push: false` — отключены авто-миграции
   - Добавлен `migrationDir`

2. **CMS** (`apps/cms/src/lib/payload-singleton.ts`):
   - Singleton pattern для Payload инстанса
   - Предотвращает пересоздание при каждом запросе

3. **CMS** (`apps/cms/next.config.mjs`):
   - Добавлены заголовки кэширования для `/api/globals/*`

4. **Web** (`apps/web/src/lib/api.ts`):
   - Увеличен таймаут до 10 секунд
   - Увеличено количество ретраев до 3
   - Добавлена задержка между ретраями

## Ожидаемый результат

| Показатель | Было | Стало |
|------------|------|-------|
| Время ответа API | 20-30s | < 500ms |
| Компиляция | 26s | < 3s |
| Hero timeout | Да | Нет |
| Fallback | Нет | Да |

## Если проблема сохраняется

1. Проверьте что миграция действительно применилась:
   ```bash
   psql $DATABASE_URI -c "\d form_submissions"
   ```
   Должны быть видны колонки: `source_page_id`, `source_block_id`, `form_data`, etc.

2. Проверьте логи на наличие `Pulling schema from database`:
   - Если всё ещё появляется — перезапустите серверы
   - Если не помогает — перезапустите PostgreSQL

3. В крайнем случае, временно используйте fallback данные:
   - Web будет работать с fallback даже если CMS недоступен
