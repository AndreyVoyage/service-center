# 🔧 Исправление редактирования опций селектора

## Проблема
В админке нет возможности редактировать опции выпадающего списка "Тип оборудования".

## Причина
В схеме ContactForm.ts поле `options` уже есть, но таблица `contact_form_fields_options` не создана в БД.

## Решение

### Шаг 1: Создать таблицу в БД

Выполните в pgAdmin Query Tool:

```sql
-- Создать таблицу для опций
CREATE TABLE IF NOT EXISTS contact_form_fields_options (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL DEFAULT 0,
    _parent_id INTEGER NOT NULL REFERENCES contact_form_fields(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL
);

-- Создать индексы
CREATE INDEX idx_form_fields_options_parent ON contact_form_fields_options(_parent_id);
CREATE INDEX idx_form_fields_options_order ON contact_form_fields_options(_order);
```

Или выполните файл:
```bash
psql service_center -f migrate-select-options.sql
```

### Шаг 2: Перезапустить CMS

```bash
# Остановить (Ctrl+C)
# Перезапустить
pnpm dev:cms
```

### Шаг 3: Проверить в админке

1. Откройте http://localhost:3001/admin/globals/contactForm
2. Найдите поле "Тип оборудования" (или создайте новое поле типа "Список")
3. Должен появиться блок "Опции" с возможностью добавлять/удалять варианты

## Ожидаемый результат

### В админке:
- Поле типа "Список" (select)
- Блок "Опции" с таблицей:
  | Значение | Отображаемый текст |
  |----------|-------------------|
  | promyshlennyy | Промышленный холодильник |
  | morozilnaya | Морозильная камера |
  | ... | ... |

### На сайте:
Селектор отображается с опциями из CMS.

## Проверка API

```bash
curl "http://localhost:3001/api/globals/contactForm?depth=2" | jq '.fields[] | select(.fieldType=="select")'
```

Должен вернуть:
```json
{
  "fieldType": "select",
  "name": "equipmentType",
  "label": "Тип оборудования",
  "options": [
    { "value": "promyshlennyy", "label": "Промышленный холодильник" },
    { "value": "morozilnaya", "label": "Морозильная камера" },
    ...
  ]
}
```

## Структура данных

**Схема (ContactForm.ts):**
```typescript
{
  name: 'options',
  type: 'array',
  label: 'Опции (для выпадающего списка)',
  admin: {
    condition: (data) => data.fieldType === 'select',
  },
  fields: [
    { name: 'value', type: 'text', label: 'Значение' },
    { name: 'label', type: 'text', label: 'Отображаемый текст' },
  ],
}
```

**Таблица БД:**
- `contact_form_fields_options` - хранит опции
- Связь через `_parent_id` → `contact_form_fields.id`

**Фронтенд (RequestForm.tsx):**
```tsx
{field.fieldType === 'select' && (
  <select>
    {field.options?.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)}
```
