# 🔧 Исправление отображения услуг на главной

## Проблема
На главной странице показывается fallback "Услуги временно недоступны", хотя на /services услуги есть.

## Причина
В `page.tsx` использовался `.catch(() => ({ docs: [] }))` который блокировал fallback данные из `getServices()`.

## Исправления

### 1. Убран блокирующий .catch()

**Файл:** `apps/web/src/app/page.tsx`

```typescript
// Было:
getMemoized('services', () => getServices().catch(() => ({ docs: [] })))

// Стало:
getMemoized('services', () => getServices())
```

Теперь при ошибке API сработает fallback внутри `getServices()` из `lib/api.ts`.

### 2. Обновлены fallback данные

**Файл:** `apps/web/src/lib/fallback-data.ts`

Добавлены недостающие поля (`price`, `image`, `gallery`) для совместимости с `ServiceCard`.

### 3. Добавлено логирование

```typescript
console.log('[HomePage] Services loaded:', services.length);
console.log('[HomePage] Services data source:', servicesData.docs.length > 0 ? 'API' : 'Fallback/Empty');
```

## Проверка после исправления

```bash
# Перезапустить
pnpm dev

# В логах должно быть:
# [HomePage] Services loaded: 3
# [HomePage] Services data source: Fallback/Empty (если API не работает)
# или
# [HomePage] Services data source: API (если API работает)
```

## Отладка API

```bash
# Проверить API напрямую
node debug-services.mjs
```

## Если всё ещё не работает

1. Проверьте что CMS запущен: `curl http://localhost:3001/api/health`
2. Проверьте что услуги есть в админке: http://localhost:3001/admin/collections/services
3. Проверьте логи CMS на ошибки БД
