# Исправление проблемы кэширования Hero

## Проблема
Изменения в админке (Globals → Hero) сохраняются, но на фронтенде (localhost:3000) не обновляются без пересборки.

## Причина
Next.js использует статическую генерацию (SSG) по умолчанию, которая кэширует данные при сборке.

## Решение

### 1. Отключение кэширования в page.tsx

Добавлены экспорты:
```typescript
export const dynamic = 'force-dynamic';  // Отключает статическую генерацию
export const revalidate = 0;             // Отключает revalidation
```

### 2. Обновление API запросов (api.ts)

Все запросы к Hero API используют `cache: 'no-store'`:
```typescript
const response = await fetch(url, {
  cache: 'no-store',  // Важно: отключаем кэширование
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3. Переменные окружения (.env.local)

Создан файл `apps/web/.env.local`:
```env
NEXT_PUBLIC_CMS_URL=http://localhost:3001
```

### 4. Логирование для отладки

Добавлены console.log в:
- `page.tsx` — логи при рендере страницы
- `api.ts` — логи при API запросах

### 5. Индикатор CMS Connected

В правом верхнем углу Hero блока отображается зелёный индикатор "CMS Connected" когда данные успешно загружены из API.

### 6. Скрипт проверки (check-hero.ts)

Создан файл `apps/web/src/lib/check-hero.ts` для проверки API.

## Инструкция по проверке

### Шаг 1: Перезапусти оба сервера

```bash
# Терминал 1 — CMS
cd apps/cms
pnpm dev

# Терминал 2 — Web (полная перезагрузка)
cd apps/web
rm -rf .next  # Очистка кэша Next.js
pnpm dev
```

### Шаг 2: Проверь консоль Web

При открытии http://localhost:3000 в консоли должны появиться логи:

```
========== PAGE RENDER START ==========
[Page] Fetching data from CMS...
[Page] CMS URL: http://localhost:3001
[API] getHero() called - fetching from http://localhost:3001/api/globals/hero
[API] Fetching: http://localhost:3001/api/globals/hero
[API] Success: http://localhost:3001/api/globals/hero - Status: 200
[API] getHero() response: {
  "hero": {
    "isActive": true,
    "title": "Ремонт промышленных холодильников 24/7",
    ...
  }
}
[Page] Hero data loaded: SUCCESS
[Page] Hero details: {
  title: 'Ремонт промышленных холодильников 24/7',
  isActive: true,
  backgroundType: 'color',
  backgroundColor: 'blue'
}
========== PAGE RENDER END ==========
```

### Шаг 3: Проверь индикатор

На странице в правом верхнем углу Hero блока должен быть зелёный индикатор:
```
🟢 CMS Connected
```

### Шаг 4: Измени данные в админке

1. Открой http://localhost:3001/admin
2. Перейди в **Globals → Hero**
3. Измени **Title** на "ТЕСТОВЫЙ ЗАГОЛОВОК"
4. Нажми **Save**

### Шаг 5: Проверь обновление на фронтенде

1. Просто обнови страницу http://localhost:3000 (F5)
2. **ВАЖНО:** Не перезапускай сервер Web!
3. Заголовок должен измениться на "ТЕСТОВЫЙ ЗАГОЛОВОК"
4. В консоли должны появиться новые логи с обновлёнными данными

### Шаг 6: Верни оригинальный заголовок

1. В админке измени Title обратно
2. Обнови страницу
3. Проверь, что изменения применились

## Что должно работать

✅ Изменения в админке отображаются сразу после обновления страницы
✅ В консоли видны логи API запросов
✅ Индикатор "CMS Connected" показывает, что данные из API
✅ Не нужно пересобирать проект

## Если не работает

### Проверь 1: CMS запущен?
```bash
curl http://localhost:3001/api/globals/hero
```
Должен вернуть JSON с hero данными.

### Проверь 2: Переменная окружения
```bash
cd apps/web
echo $NEXT_PUBLIC_CMS_URL
```
Должно вывести `http://localhost:3001`

Или добавь в `apps/web/next.config.js`:
```javascript
env: {
  NEXT_PUBLIC_CMS_URL: 'http://localhost:3001',
}
```

### Проверь 3: Очисти кэш Next.js
```bash
cd apps/web
rm -rf .next
pnpm dev
```

### Проверь 4: Проверь Network tab
1. Открой DevTools (F12)
2. Перейди во вкладку Network
3. Обнови страницу
4. Найди запрос к `hero`
5. Проверь Response — там должны быть актуальные данные

## Файлы, которые были изменены

| Файл | Изменения |
|------|-----------|
| `apps/web/src/app/page.tsx` | `dynamic = 'force-dynamic'`, `revalidate = 0`, логирование |
| `apps/web/src/lib/api.ts` | `cache: 'no-store'`, логирование |
| `apps/web/src/app/page.module.css` | Стили для индикатора CMS Connected |
| `apps/web/.env.local` | Переменная NEXT_PUBLIC_CMS_URL |
| `apps/web/src/lib/check-hero.ts` | Скрипт проверки API |

## Для production

Когда будешь деплоить в production, можно вернуть статическую генерацию:

```typescript
// page.tsx
export const dynamic = 'auto';  // или удали эту строку
export const revalidate = 60;   // ISR: обновление каждые 60 секунд
```

Но для development режима оставь `force-dynamic`.
