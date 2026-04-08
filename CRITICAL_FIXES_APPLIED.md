# 🚨 Критические исправления применены

## 1. CORS для API (middleware.ts) ✅

**Файл:** `apps/cms/src/middleware.ts`

Добавлена обработка CORS для публичных API endpoints:
- `/api/categories`
- `/api/services`
- `/api/reviews`
- `/api/globals/*`

```typescript
// CORS headers для всех публичных API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

## 2. FormFieldRowLabel без useFieldArray ✅

**Файл:** `apps/cms/src/components/FormFieldRowLabel.tsx`

- Убран импорт `useFieldArray` (не существует в `@payloadcms/ui`)
- Оставлен только `useFormFields` для отображения данных
- Компонент теперь статичный (без кнопок перемещения - Payload управляет этим сам)

## 3. importMap.js ✅

**Файл:** `apps/cms/src/app/(payload)/admin/importMap.js`

Пути корректны:
```javascript
import { FormFieldRowLabel as ... } from '../../../components/FormFieldRowLabel'
import { CategorySelectInfo as ... } from '../../../components/CategorySelectInfo'
```

## 4. Обработка ошибок в RequestForm ✅

**Файл:** `apps/web/src/components/RequestForm.tsx`

Уже реализовано:
- `categoriesLoading` - состояние загрузки
- `categoriesError` - флаг ошибки
- Отображение сообщений:
  - "Загрузка..." при загрузке
  - "Ошибка загрузки" при ошибке
  - "Выберите категорию..." placeholder

---

## 🚀 Перезапуск

```bash
# 1. Остановить все (Ctrl+C)
# 2. Перезапустить CMS
pnpm dev:cms

# 3. В другом терминале - Web
pnpm dev:web
```

---

## 🧪 Проверка

### 1. Проверить CORS (в консоли браузера)

```javascript
fetch('http://localhost:3001/api/categories')
  .then(r => r.json())
  .then(console.log)
```

Должно вернуть категории без ошибок CORS.

### 2. Проверить админку

1. Открыть http://localhost:3001/admin/globals/contactForm
2. Добавить поле типа "Выбор категории (авто)"
3. Должно появиться синее информационное сообщение

### 3. Проверить сайт

1. Открыть http://localhost:3002
2. В форме должен быть селект с категориями из CMS

---

## ⚠️ Если ошибки persist

### Очистить кэш Next.js:
```bash
rm -rf apps/cms/.next apps/web/.next
```

### Перегенерировать importMap (если нужно):
```bash
cd apps/cms
pnpm payload generate:importmap
```

### Проверить что порты свободны:
```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :3002
```

---

## ✅ Ожидаемый результат

- ✅ CORS ошибок нет
- ✅ Категории загружаются с API
- ✅ Админка работает без ошибок импорта
- ✅ Форма на сайте показывает категории
- ✅ В заявке сохраняется slug категории
