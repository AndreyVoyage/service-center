# 🚨 Критический фикс: Ожидание компиляции CMS

## Проблема (13:48)
CMS компилирует `/api/[...slug]` 35 секунд, Web получает таймаут через 30s.

## Решение

### 1. Увеличены таймауты
```typescript
// apps/web/src/lib/api.ts
const API_TIMEOUT = 60000;  // Было: 30000
const API_RETRIES = 2;      // Было: 1
const RETRY_DELAY = 3000;   // Было: 2000
```

### 2. Добавлено ожидание CMS
```typescript
// apps/web/src/lib/api.ts
export const waitForCMS = async (maxWait = 60000): Promise<boolean>
```

### 3. Обновлена страница
```typescript
// apps/web/src/app/page.tsx
export default async function Home() {
  await waitForCMS(60000);  // Ждём CMS перед запросами
  // ... остальной код
}
```

### 4. Новые скрипты запуска
```powershell
# PowerShell (с ожиданием 45 секунд)
.\launch-with-wait.ps1

# Или BAT (с ожиданием 45 секунд)
.\launch-with-wait.bat
```

## Использование

### Вариант 1: Автоматический запуск (рекомендуется)
```powershell
.\launch-with-wait.ps1
# Или
.\launch-with-wait.bat
```

### Вариант 2: Ручной контроль
```powershell
# Терминал 1: CMS
$env:NODE_OPTIONS="--max-old-space-size=8192"
cd apps/cms && pnpm dev

# Ждать 40-45 секунд!

# Терминал 2: Web
cd apps/web && pnpm dev
```

## Ожидаемое поведение

1. Запускается CMS
2. Ждём 40-45 секунд (компиляция `/api/[...slug]`)
3. Запускается Web
4. Web ждёт CMS через `waitForCMS()`
5. Страница загружается без таймаутов

## Если всё ещё таймауты

Увеличить ожидание:
```powershell
.\launch-with-wait.ps1 -WaitSeconds 60
```

## Проверка

После запуска должно быть:
```
[API] Waiting for CMS to be ready...
[API] CMS ready after 45000ms
```

И страница загружается без ошибок `timeout after 30000ms`.
