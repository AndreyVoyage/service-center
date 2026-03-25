# ИТЕРАЦИЯ 1: Payload Minimal — Checkpoint

## ✅ Verification (Checkpoint 1)

### Шаг 1: Установка зависимостей из ROOT

```bash
cd service-center-v3
pnpm install
```

**Ожидаемый результат:**
```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded X, added XXX, done
```

### Шаг 2: Запуск CMS

```bash
cd apps/cms
pnpm dev
```

**Ожидаемый результат:**
```
> @sc/cms@1.0.0 dev
> next dev -p 3001

ready - started server on 0.0.0.0:3001, url: http://localhost:3001
```

### Шаг 3: Проверка админки

Открыть в браузере: `http://localhost:3001/admin`

**Ожидаемый результат:**
- Страница загружается без ошибок
- Видна форма входа
- Поле email предзаполнено: `dev@service.center`

### Шаг 4: Создание первого пользователя

1. Войти с email: `dev@service.center`, password: `password`
2. Или создать нового пользователя через "Create New"

**Ожидаемый результат:**
- Пользователь создан с ролью `developer`
- Виден список пользователей

## 📋 Чек-лист

- [ ] `pnpm install` выполнен без ошибок
- [ ] `pnpm dev` запускает сервер на порту 3001
- [ ] `localhost:3001/admin` открывается
- [ ] Можно создать первого пользователя (developer)
- [ ] Коллекция Users видна в админке

## 🆘 Fallback Strategy

**Проблема:** Порт 3001 занят
**Решение:** Изменить в `apps/cms/package.json` на `"dev": "next dev -p 3002"` и в `.env.local` `NEXT_PUBLIC_SERVER_URL=http://localhost:3002`

**Проблема:** "Cannot find module"
**Решение:** Удалить `node_modules` и запустить `pnpm install` заново

**Проблема:** Ошибка с Payload config
**Решение:** Проверить что `next.config.mjs` правильно импортирует `withPayload`

---

**Если все галочки отмечены → переходим к ИТЕРАЦИИ 2 (RBAC)**
