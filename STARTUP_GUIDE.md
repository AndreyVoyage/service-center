# 🚀 Руководство по запуску ColdService

## Быстрая проверка перед запуском

### 1. Проверьте конфигурацию

```bash
# Node.js скрипт (рекомендуется)
node verify-connection.mjs

# Или CMD для Windows
verify-connection.bat

# Или PowerShell
.\start-and-verify.ps1
```

### 2. Что должно показать проверка

```
=== Проверка .env файлов ===

[✓] CMS: DATABASE_URI → service_center
[✓] Web: NEXT_PUBLIC_CMS_URL → localhost:3001

=== Проверка API ===

[✓] CMS API: HTTP 200
  Status: ok
  Globals:
    [✓] hero
    [✓] footer
    [✓] contactForm
[✓] Web: HTTP 200
```

Если есть `[X]` — смотрите раздел "Исправление ошибок".

---

## Запуск системы

### Вариант 1: Автоматический (PowerShell)

```powershell
.\start-and-verify.ps1
```

Этот скрипт:
1. Проверит .env файлы
2. Проверит существование БД
3. Запустит CMS с ожиданием инициализации
4. Проверит что CMS отвечает
5. Запустит Web сервер
6. Покажет финальные URL

### Вариант 2: Ручной

Терминал 1 — CMS:
```bash
pnpm dev:cms
# Или: pnpm --filter cms dev
```

Терминал 2 — Web:
```bash
pnpm dev:web
# Или: pnpm --filter web dev
```

### Вариант 3: Через launch-with-wait

```powershell
.\launch-with-wait.ps1
```

---

## Проверка после запуска

### API Health Check
```bash
curl http://localhost:3001/api/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T14:30:00.000Z",
  "data": {
    "hero": true,
    "footer": true,
    "contactForm": true
  }
}
```

### Проверка сайта
```bash
curl http://localhost:3002 | head -20
```

Должен вернуть HTML с контентом.

---

## Исправление ошибок

### Ошибка: "DATABASE_URI = payload (NEEDS FIX!)"

**Решение:**
```bash
# Отредактировать apps/cms/.env.local
# Заменить:
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/payload
# На:
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/service_center
```

### Ошибка: "Database 'service_center' not found"

**Решение:**
```sql
-- В pgAdmin Query Tool
CREATE DATABASE service_center;
```

### Ошибка: "CMS not responding"

**Возможные причины:**
1. CMS ещё компилируется (подождите 30-60 секунд)
2. Ошибка в .env.local
3. Порт 3001 занят другим процессом

**Проверка:**
```bash
# Проверить что на порту 3001
netstat -ano | findstr :3001

# Убить процессы Node если нужно
taskkill /F /IM node.exe
```

### Ошибка: "relation does not exist"

**Решение:**
Таблицы не созданы. Варианты:
1. Установить `push: true` в `payload.config.ts` временно
2. Или выполнить SQL скрипт `create-database-full.sql` в pgAdmin

---

## Доступ после запуска

| Сервис | URL | Назначение |
|--------|-----|-----------|
| CMS Admin | http://localhost:3001/admin | Панель управления |
| CMS API | http://localhost:3001/api | API endpoints |
| Health | http://localhost:3001/api/health | Проверка статуса |
| Website | http://localhost:3002 | Сайт для клиентов |

---

## Создание первого пользователя админки

1. Откройте http://localhost:3001/admin
2. Заполните форму:
   - Email: admin@example.com
   - Password: (минимум 8 символов)
3. Нажмите "Create"
4. Войдите с созданными учётными данными

---

## Остановка

```bash
# В каждом терминале нажмите
Ctrl+C

# Или убить все процессы Node
taskkill /F /IM node.exe
```

---

## Полезные команды

```bash
# Перезапуск с очисткой кэша
rm -rf apps/cms/.next apps/web/.next
pnpm dev

# Проверка логов CMS
pnpm dev:cms 2>&1 | tee cms.log

# Проверка логов Web
pnpm dev:web 2>&1 | tee web.log
```

---

## Готово! 🎉

Если все проверки прошли:
- ✓ CMS работает на http://localhost:3001
- ✓ Website работает на http://localhost:3002
- ✓ БД подключена к service_center
- ✓ Все globals загружаются

**Система готова к работе!**
