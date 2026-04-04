# 🚨 Полный сброс миграций (если ничего не помогает)

## Когда использовать
Если миграция `source_page_id` продолжает зависать после создания колонки вручную.

## ⚠️ ВНИМАНИЕ
Это **сбросит все данные форм**! Сохраните их перед выполнением если они важны.

---

## Шаг 1: Экспорт данных (если нужно)

```bash
psql service_center -c "\copy form_submissions TO 'form_submissions_backup.csv' CSV HEADER;"
```

---

## Шаг 2: Удалить таблицу

```bash
psql service_center -c "DROP TABLE IF EXISTS form_submissions CASCADE;"
```

Или полный SQL:
```sql
-- Сброс таблицы form_submissions
DROP TABLE IF EXISTS form_submissions CASCADE;

-- Также очистить таблицу миграций если есть
DELETE FROM payload_migrations WHERE name LIKE '%form_submissions%';
```

---

## Шаг 3: Перезапустить CMS

```bash
pnpm dev
```

Таблица `form_submissions` будет создана автоматически с актуальной схемой.

---

## Шаг 4: Восстановить данные (если экспортировали)

```bash
psql service_center -c "\copy form_submissions FROM 'form_submissions_backup.csv' CSV HEADER;"
```

---

## Альтернатива: Сброс всей БД (крайний случай)

```bash
# Остановить всё

# Удалить и создать БД заново
dropdb service_center
createdb service_center

# Перезапустить CMS
pnpm dev
```

---

## Рекомендуемый порядок действий

1. **Сначала попробовать:** Создать колонку вручную (fix-migration.sql)
2. **Если не помогло:** Удалить только form_submissions таблицу
3. **В крайнем случае:** Полный сброс БД
