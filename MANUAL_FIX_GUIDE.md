# 🛠️ Ручное исправление БД (Windows/pgAdmin)

## Проблема
psql в MINGW64 работает некорректно с аргументами `-c`.

## Решение: Выполнить SQL вручную через pgAdmin

### Шаг 1: Открыть pgAdmin
1. Запустите **pgAdmin 4** (обычно в меню Пуск → PostgreSQL)
2. Подключитесь к серверу **localhost**
3. Раскройте базу данных **service_center**

### Шаг 2: Открыть Query Tool
1. Кликните правой кнопкой на **service_center**
2. Выберите **Query Tool** (или нажмите `Alt+Shift+Q`)

### Шаг 3: Выполнить SQL

Скопируйте и вставьте этот SQL в Query Tool:

```sql
-- Fix 1: Add missing column
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);

-- Fix 2: Create missing table
CREATE TABLE IF NOT EXISTS contact_form_left_block_features (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL DEFAULT 0,
    _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE,
    icon VARCHAR(50) DEFAULT 'check',
    text VARCHAR(500) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_left_block_features_parent 
    ON contact_form_left_block_features(_parent_id);

CREATE INDEX IF NOT EXISTS idx_left_block_features_order 
    ON contact_form_left_block_features(_order);
```

### Шаг 4: Выполнить
Нажмите **F5** или кнопку ▶️ **Execute/Refresh**

### Шаг 5: Проверить результат
В том же Query Tool выполните:

```sql
-- Проверка
SELECT tablename 
FROM pg_tables 
WHERE tablename LIKE 'contact_form%' OR tablename = 'form_submissions'
ORDER BY tablename;
```

Должны быть:
- `contact_form`
- `contact_form_left_block_features` ✓ (новая)
- `form_submissions` (с колонкой source_page_id)

---

## Альтернатива: DBeaver

Если у вас DBeaver:
1. Подключиться к PostgreSQL
2. Открыть SQL Editor (Ctrl+])
3. Вставить SQL выше
4. Выполнить (Ctrl+Enter)

---

## После исправления

Перезапустите CMS:
```bash
pnpm dev
```

Миграция больше не должна зависать!
