# 🔧 Исправление зависшей миграции

## Проблема
Drizzle завис на миграции `source_page_id`:
```
[⣷] Pulling schema from database...
Is source_page_id column in form_submissions table created or renamed?
❯ + source_page_id  create column
```

## ⚡ Быстрое решение

### Шаг 1: Создать колонку вручную

**Вариант А: Через psql**
```bash
psql service_center -c "ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);"
```

**Вариант Б: Через SQL файл**
```bash
psql service_center -f fix-migration.sql
```

**Вариант В: Вручную через pgAdmin/DBeaver**
```sql
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);
```

### Шаг 2: Проверить
```bash
psql service_center -c "\d form_submissions" | findstr source_page_id
```

Должно показать:
```
source_page_id | character varying(255)
```

### Шаг 3: Перезапустить
```bash
# Остановить (Ctrl+C)
# Перезапустить
pnpm dev
```

---

## 🔄 Альтернативы

### Если данные форм не важны
```bash
psql service_center -c "DROP TABLE IF EXISTS form_submissions CASCADE;"
```
При перезапуске таблица создастся автоматически.

### Если source_page_id не нужен
Удалить поле из `apps/cms/src/collections/FormSubmission.ts`:
```typescript
// Удалить этот блок:
{
  name: 'source_page_id',
  type: 'text',
  ...
}
```

---

## Проверка после исправления

1. **Миграция проходит быстро** (< 5 секунд)
2. **CMS запускается** с сообщением `Ready in Xs`
3. **Нет ошибок** в консоли

---

## Выполните прямо сейчас

```bash
# 1. Создать колонку
psql service_center -c "ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);"

# 2. Перезапустить CMS
# (Остановить Ctrl+C, затем pnpm dev)
```
