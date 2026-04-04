# 🚀 Быстрый старт с новой БД

## Вариант А: Автоматическое создание (рекомендуется)

Если `push: true` в `payload.config.ts`:

```bash
# 1. Создать БД в pgAdmin (только пустую БД)
#    - Открыть pgAdmin
#    - Create Database → service_center

# 2. Обновить .env.local
#    DATABASE_URI=postgresql://postgres:postgres@localhost:5432/service_center

# 3. Запустить
pnpm dev

# Payload автоматически создаст все таблицы при первом запуске
```

## Вариант Б: Ручное создание таблиц

Если `push: false` в `payload.config.ts`:

```bash
# 1. Создать БД в pgAdmin
#    - Create Database → service_center

# 2. Выполнить SQL скрипт
#    - Открыть create-database-full.sql в pgAdmin Query Tool
#    - Нажать F5

# 3. Обновить .env.local
#    DATABASE_URI=postgresql://postgres:postgres@localhost:5432/service_center

# 4. Запустить
pnpm dev
```

## Проверка после запуска

```bash
# В другом терминале
node verify-setup.js

# Или вручную:
curl http://localhost:3001/api/health
```

## Создание первого пользователя

1. Откройте http://localhost:3001/admin
2. Заполните форму (email, password)
3. Войдите в админку

## Если что-то пошло не так

```bash
# Полный сброс
# 1. Удалить БД в pgAdmin
# 2. Создать заново
# 3. Повторить шаги выше
```

## Текущая конфигурация

**push: true** - таблицы создаются автоматически

Можно просто запустить `pnpm dev` после создания пустой БД `service_center`.
