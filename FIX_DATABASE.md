# 🔧 Исправление ошибки БД: contact_form_left_block_features

## Ошибка
```
error: отношение "contact_form_left_block_features" не существует
```

## Причина
Таблица для `leftBlock.features` (array) не создана в PostgreSQL.

---

## ⚡ Вариант 1: Быстрый фикс (для dev)

Временно включить `push: true` для автосоздания таблицы:

**Файл:** `apps/cms/src/payload.config.ts`

```typescript
db: postgresAdapter({
  pool: { 
    connectionString: process.env.DATABASE_URI!,
    max: 5,
    min: 1,
    acquireTimeoutMillis: 5000,
    createTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
  },
  // push: false,  // ← Закомментировать
  push: true,     // ← Включить временно
}),
```

**Затем:**
1. Перезапустить CMS
2. Дождаться создания таблицы (в логах должно быть "Created table...")
3. **Вернуть** `push: false` обратно!

---

## ✅ Вариант 2: SQL Миграция (рекомендуется)

### Шаг 1: Подключиться к БД

**Через psql:**
```bash
psql service_center
```

**Или через pgAdmin / DBeaver:**
- Host: localhost
- Port: 5432
- Database: service_center

### Шаг 2: Выполнить SQL

```sql
-- Create features table for leftBlock
CREATE TABLE IF NOT EXISTS contact_form_left_block_features (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL,
    _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE,
    icon VARCHAR(50) DEFAULT 'check' NOT NULL,
    text VARCHAR(255) NOT NULL
);

-- Create indexes
CREATE INDEX idx_contact_form_left_block_features_parent 
    ON contact_form_left_block_features(_parent_id);

CREATE INDEX idx_contact_form_left_block_features_order 
    ON contact_form_left_block_features(_order);
```

### Шаг 3: Проверить

```sql
\dt contact_form*
```

Должно показать:
- contact_form
- contact_form_fields
- contact_form_left_block_features ← НОВАЯ

---

## 🚀 Вариант 3: PowerShell скрипт

Запустить в PowerShell:
```powershell
.\apply-migration.ps1
```

---

## Проверка после исправления

1. **Перезапустить CMS:**
   ```bash
   pnpm dev:cms
   ```

2. **Проверить API:**
   ```bash
   curl http://localhost:3001/api/globals/contactForm
   ```

3. **Открыть админку:**
   http://localhost:3001/admin/globals/contactForm

---

## Если ничего не помогает (откат)

Упростить схему без nested array:

**Файл:** `apps/cms/src/globals/ContactForm.ts`

```typescript
// Убрать leftBlock целиком, использовать простые поля
{
  name: 'leftTitle',
  type: 'text',
  defaultValue: 'Оставить заявку',
},
{
  name: 'leftDescription', 
  type: 'textarea',
  defaultValue: 'Заполните форму...',
},
// Features хранить как JSON в textarea
{
  name: 'leftFeaturesJson',
  type: 'textarea',
  defaultValue: '[{"icon":"check","text":"Бесплатная диагностика"}]',
}
```
