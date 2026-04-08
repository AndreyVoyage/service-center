# 🔧 Исправление ошибки importMap.js

## Проблема
Ошибка импорта кастомных UI-компонентов в Payload CMS:
- Неверные пути в `importMap.js`
- Неправильный формат ключей в объекте importMap

## Исправленные файлы

### 1. apps/cms/src/app/(payload)/admin/importMap.js

```javascript
import { FormFieldRowLabel as FormFieldRowLabel_56be857e6f55a29618f0336dc488ce93 } from '../../../components/FormFieldRowLabel'
import { CategorySelectInfo as CategorySelectInfo_8df305977c47b24ddea94b6b84255b20 } from '../../../components/CategorySelectInfo'

export const importMap = {
  "FormFieldRowLabel_56be857e6f55a29618f0336dc488ce93": FormFieldRowLabel_56be857e6f55a29618f0336dc488ce93,
  "CategorySelectInfo_8df305977c47b24ddea94b6b84255b20": CategorySelectInfo_8df305977c47b24ddea94b6b84255b20,
}
```

**Исправления:**
- Путь `'../components/...'` → `'../../../components/...'` (3 уровня вверх)
- Убран `@/` алиас, используется относительный путь
- Ключи в importMap: только хэш (без пути и #)

### 2. apps/cms/src/globals/ContactForm.ts

```typescript
{
  name: 'categoryInfo',
  type: 'ui',
  label: 'Информация',
  admin: {
    condition: (data, siblingData) => siblingData?.fieldType === 'categorySelect',
    components: {
      Field: 'CategorySelectInfo_8df305977c47b24ddea94b6b84255b20',
    },
  },
}
```

**Исправления:**
- Было: `Field: '@/components/CategorySelectInfo#CategorySelectInfo'`
- Стало: `Field: 'CategorySelectInfo_8df305977c47b24ddea94b6b84255b20'`

### 3. apps/cms/src/components/FormFieldRowLabel.tsx

Обновлены иконки и метки для новых типов полей:
- `select` - Список (ручной)
- `checkbox` - Чекбокс  
- `categorySelect` - Категории (авто)
- `text` - Текст

## Перезапуск

```bash
# Перезапустить CMS
pnpm dev:cms

# Или
pnpm turbo dev --filter=cms
```

## Проверка

1. Откройте админку: http://localhost:3001/admin
2. Перейдите в Globals → Contact Form
3. Добавьте поле с типом "Выбор категории (авто)"
4. Должно появиться информационное сообщение

## Как работает импорт компонентов в Payload

1. **Файл импорта** (`importMap.js`):
   - Импортирует компонент с алиасом (хэш)
   - Экспортирует объект `importMap` с ключом-хэшем

2. **Использование в схеме** (`ContactForm.ts`):
   - Указывается только ключ-хэш в `components.Field`
   - Без пути, без #, без @/

3. **Payload подхватывает**:
   - Ищет компонент в `importMap` по ключу
   - Рендерит в нужном месте админки

## Возможные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `Cannot find module` | Неверный путь | Проверить `../../../` относительно `importMap.js` |
| `Component not found` | Неверный ключ | Использовать хэш без пути и # |
| `Invalid hook call` | Компонент не 'use client' | Добавить `'use client'` в компонент |
