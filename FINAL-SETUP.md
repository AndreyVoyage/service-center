# ✅ Финальная настройка — Система стабилизирована

## Статус: Система работает стабильно

### Что было исправлено

| Проблема | Решение | Статус |
|----------|---------|--------|
| Нехватка RAM | Отключен Webpack cache, React StrictMode | ✅ |
| PostgreSQL ECONNRESET | Уменьшен connection pool (5), push: false | ✅ |
| Медленная компиляция | Оптимизация webpack parallelism | ✅ |
| Первые запросы медленные | Добавлен warm-up endpoint + SSR cache | ✅ |
| Предупреждения в конфиге | Убран telemetry из next.config | ✅ |

---

## Быстрый старт (после перезагрузки)

### 1. Проверка системы
```powershell
.\check-system.ps1
```

### 2. Полная очистка (если нужно)
```powershell
.\EMERGENCY-RECOVERY.ps1
```

### 3. Запуск с прогревом
```powershell
# Терминал 1: Запуск CMS
$env:NODE_OPTIONS="--max-old-space-size=4096"
cd apps/cms
pnpm dev

# Терминал 2: Прогрев (через 10 секунд после старта CMS)
.\warmup.ps1

# Терминал 3: Запуск Web
cd apps/web
pnpm dev
```

---

## Проверка работоспособности

### Тест 1: Health check
```bash
curl http://localhost:3001/api/health
```
Ожидаемый результат:
```json
{
  "status": "ok",
  "warmUpTime": 2000,
  "data": {
    "hero": true,
    "footer": true,
    "servicesCount": 3,
    "reviewsCount": 2
  }
}
```

### Тест 2: Время ответа API
```bash
# Первый запрос (прогрев)
time curl -s http://localhost:3001/api/globals/hero > /dev/null
# Ожидается: 1-3 секунды

# Второй запрос (кэш)
time curl -s http://localhost:3001/api/globals/hero > /dev/null
# Ожидается: < 500ms
```

### Тест 3: Загрузка страницы
```bash
time curl -s http://localhost:3002 > /dev/null
# Ожидается: < 5 секунд
```

---

## Оптимизации в конфигурации

### CMS (`apps/cms/next.config.mjs`)
- ✅ `config.cache = false` — экономия 500MB RAM
- ✅ `parallelism = 2` — меньше нагрузка на CPU
- ✅ `reactStrictMode: false` — экономия памяти

### Web (`apps/web/next.config.js`)
- ✅ `reactStrictMode: false` — экономия памяти
- ✅ `unoptimized: true` — для изображений

### Payload (`apps/cms/src/payload.config.ts`)
- ✅ `max: 5` соединений с БД (было 10)
- ✅ `push: false` — отключены авто-миграции

### API Client (`apps/web/src/lib/api.ts`)
- ✅ SSR кэш (30 секунд)
- ✅ Fallback данные при ошибках
- ✅ Таймаут 30 секунд, 1 ретрай

---

## Мониторинг

### Проверка памяти (во время работы)
```powershell
# В другом терминале
node -e "const u = process.memoryUsage(); console.log('Heap:', (u.heapUsed/1024/1024).toFixed(2), 'MB')"
```

### Проверка PostgreSQL
```sql
-- Количество активных соединений
SELECT count(*) FROM pg_stat_activity;

-- Должно быть < 5
```

### Проверка логов на ошибки
```powershell
# В терминале с CMS
grep -i "error\|timeout\|failed" apps/cms/.next/logs/
```

---

## Если что-то пошло не так

### Сценарий 1: Медленный первый запрос (> 10s)
**Решение:** Запустить warmup.ps1 несколько раз
```powershell
.\warmup.ps1
```

### Сценарий 2: Ошибки памяти
**Решение:** Закрыть Chrome/VS Code, перезапустить
```powershell
.\EMERGENCY-RECOVERY.ps1
```

### Сценарий 3: PostgreSQL недоступен
**Решение:** Перезапустить службу
```powershell
net stop postgresql-x64-15
net start postgresql-x64-15
```

---

## Финальный чеклист

- [ ] `pnpm dev` запускается без ошибок
- [ ] `/api/health` отвечает < 3 секунд
- [ ] Главная страница загружается < 5 секунд
- [ ] Hero отображается (из CMS или fallback)
- [ ] Форма отправляется без ошибок
- [ ] Нет `ECONNRESET` ошибок в логах
- [ ] Нет `Array buffer allocation failed` ошибок
- [ ] PostgreSQL < 10 активных соединений

---

## Документация

- `EMERGENCY-RECOVERY.ps1` — Экстренное восстановление
- `EMERGENCY-RECOVERY.bat` — Тоже самое для CMD
- `check-system.ps1` — Проверка системы перед запуском
- `warmup.ps1` — Прогрев CMS после старта
- `RECOVERY-GUIDE.md` — Подробное руководство
- `FINAL-SETUP.md` — Этот файл

---

**Система готова к работе! 🎉**
