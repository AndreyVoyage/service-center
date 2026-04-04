# ⚡ Исправление: contact_form_left_block_features

## ✅ Выполнено

**Изменено:** `apps/cms/src/payload.config.ts`
```typescript
// Было:
push: false

// Стало:
push: true  // Автосоздание таблиц включено
```

---

## 🚀 Следующие шаги

### 1. Перезапустить CMS (обязательно)

```bash
# Остановить текущий процесс CMS (Ctrl+C)

# Перезапустить
pnpm dev:cms
# или
pnpm --filter cms dev
```

### 2. Проверить логи

В консоли CMS должно появиться (в течение 10-30 секунд):
```
[payload] Creating table: contact_form_left_block_features
[payload] Created table: contact_form_left_block_features
```

Или:
```
[payload] Table contact_form_left_block_features already exists
```

### 3. Проверить работу

```bash
# В другом терминале — проверить API
curl http://localhost:3001/api/globals/contactForm

# Должен вернуть JSON без ошибок (HTTP 200)
```

Открыть в браузере:
- http://localhost:3001/admin/globals/contactForm
- Должна открыться админка без ошибки 500

---

## 🛠️ Если автопуш не сработал

### Ручное создание таблицы

**Вариант А: Через psql**
```bash
psql service_center -f manual-fix.sql
```

**Вариант Б: Через pgAdmin/DBeaver**
1. Открыть Query Tool
2. Вставить содержимое `manual-fix.sql`
3. Выполнить (F5)

**Вариант В: Прямой SQL**
```sql
CREATE TABLE contact_form_left_block_features (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL DEFAULT 0,
    _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE,
    icon VARCHAR(50) DEFAULT 'check',
    text VARCHAR(500) NOT NULL
);

CREATE INDEX idx_left_block_features_parent ON contact_form_left_block_features(_parent_id);
CREATE INDEX idx_left_block_features_order ON contact_form_left_block_features(_order);
```

---

## ⏪ После успешного создания таблицы

**Важно:** Вернуть `push: false` для безопасности:

```typescript
// apps/cms/src/payload.config.ts
push: false,  // ← Вернуть обратно!
```

Затем перезапустить CMS.

---

## 🔄 Полный цикл исправления

```bash
# 1. Остановить всё
Ctrl+C

# 2. Убедиться что push: true в payload.config.ts

# 3. Запустить CMS
pnpm dev:cms

# 4. Дождаться создания таблицы (смотреть логи)

# 5. Проверить API
curl http://localhost:3001/api/globals/contactForm

# 6. Вернуть push: false
# Редактировать payload.config.ts

# 7. Перезапустить CMS
Ctrl+C && pnpm dev:cms
```

---

## ❌ Если всё сломалось — откат

Упростить схему ContactForm (убрать array):

```typescript
// apps/cms/src/globals/ContactForm.ts
{
  name: 'leftBlock',
  type: 'group',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    // УБРАТЬ features array
    // { name: 'features', type: 'array', ... }
  ]
}
```
