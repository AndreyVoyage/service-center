# 🚨 Руководство по экстренному восстановлению

## Ситуация
Система падает с:
- `RangeError: Array buffer allocation failed` (нехватка RAM)
- `read ECONNRESET` (PostgreSQL отвергает соединения)
- `Jest worker encountered 2 child process exceptions`

## Быстрое восстановление (3 шага)

### Шаг 1: Закрыть всё
```powershell
# В PowerShell от имени администратора:
.\EMERGENCY-RECOVERY.ps1

# Или просто двойной клик:
EMERGENCY-RECOVERY.bat
```

### Шаг 2: Проверить память
- Закройте Chrome, VS Code, другие тяжелые программы
- Должно быть минимум **2GB свободной RAM**

### Шаг 3: Запуск с увеличенной памятью
```powershell
# PowerShell:
$env:NODE_OPTIONS="--max-old-space-size=4096"
$env:NEXT_TELEMETRY_DISABLED="1"
pnpm dev
```

## Если не помогло (радикальные меры)

### Вариант А: Пересоздать БД
```bash
# Только если данные не важны!
dropdb service_center
createdb service_center
```

### Вариант Б: Упростить Footer
Временно закомментировать сложные массивы в `apps/cms/src/globals/Footer.ts`.

### Вариант В: Отключить Hero SSR
В `apps/web/src/app/page.tsx` заменить SSR Hero на клиентский компонент.

## Что изменено для стабильности

1. **Отключен Webpack кэш** — экономия 500MB+ RAM
2. **Уменьшен connection pool** — с 10 до 5 соединений
3. **Отключен React StrictMode** — экономия памяти
4. **Увеличены таймауты** — 30 секунд вместо 10
5. **Уменьшены ретраи** — только 1 вместо 3

## Проверка после восстановления

```bash
# Проверить память
node -e "console.log('Free:', require('os').freemem() / 1024 / 1024, 'MB')"

# Проверить БД
curl http://localhost:3001/api/health

# Проверить сайт
curl http://localhost:3002
```

## Ожидаемый результат

- CMS загружается за 5-10 секунд
- Web загружает страницу за 3-5 секунд
- Нет ошибок `ECONNRESET`
- Нет ошибок `Array buffer allocation failed`

## Если всё ещё падает

1. Перезагрузить компьютер
2. Запустить только CMS: `cd apps/cms && pnpm dev`
3. Запустить Web в другом терминале: `cd apps/web && pnpm dev`
4. Следить за памятью в Task Manager
