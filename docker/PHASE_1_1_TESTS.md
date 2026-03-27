# ФАЗА 1.1: Чек-лист тестирования Docker-инфраструктуры

## Тест 1: Зеркала Docker работают

```bash
# Проверка каждого зеркала
docker pull dockerhub1.beget.ru/library/hello-world
docker pull dockerhub.timeweb.ru/library/alpine:latest
docker pull mirror.gcr.io/library/nginx:alpine

# Ожидаемый результат: Все образы успешно скачаны
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 2: docker-compose up --build запускается без ошибок

```bash
cd docker
make dev-up

# Проверка статуса
docker-compose -f docker-compose.dev.yml ps

# Ожидаемый результат:
# NAME                STATUS
# cms_postgres_dev    Up (healthy)
# cms_adminer_dev     Up
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 3: CMS доступна на localhost:3001

```bash
# Запуск production окружения
make prod-up

# Проверка
curl http://localhost:3001/api/health

# Ожидаемый результат:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "services": {
#     "database": "connected",
#     "api": "ok"
#   }
# }
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 4: Web доступен на localhost:3000

```bash
# Проверка
curl http://localhost:3000/api/health

# Ожидаемый результат:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "services": {
#     "cms": "connected",
#     "web": "ok"
#   }
# }
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 5: PostgreSQL доступна и работает

```bash
# Проверка через psql
docker exec cms_postgres_dev psql -U payload -d payload_dev -c "SELECT 1;"

# Или через Adminer (http://localhost:8080)
# Server: postgres
# Username: payload
# Password: payload_dev
# Database: payload_dev

# Ожидаемый результат: Успешное подключение
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 6: Nginx reverse proxy работает

```bash
# После настройки домена
curl -I http://localhost

# Ожидаемый результат:
# HTTP/1.1 200 OK
# Server: nginx
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 7: Скрипт setup-docker.sh работает

```bash
# На чистом сервере
sudo ./scripts/setup-docker.sh

# Проверка
docker --version
docker-compose --version

# Ожидаемый результат:
# Docker version 24.x.x
# Docker Compose version v2.x.x
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 8: Health check endpoints работают

```bash
# CMS health
curl http://localhost:3001/api/health | jq

# Web health
curl http://localhost:3000/api/health | jq

# Ожидаемый результат: HTTP 200, status: "healthy"
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 9: Makefile команды работают

```bash
# Проверка всех команд
make help
make status
make logs
make backup

# Ожидаемый результат: Команды выполняются без ошибок
```

✅ **Пройден** / ❌ **Не пройден**

---

## Тест 10: GitHub Actions workflow валиден

```bash
# Проверка синтаксиса
act -l

# Или на GitHub
# Settings -> Actions -> General -> Allow all actions

# Ожидаемый результат: Workflow запускается без ошибок
```

✅ **Пройден** / ❌ **Не пройден**

---

## Итоговый результат

| Тест | Статус | Примечания |
|------|--------|------------|
| 1. Зеркала Docker | ⬜ | |
| 2. docker-compose up | ⬜ | |
| 3. CMS доступна | ⬜ | |
| 4. Web доступен | ⬜ | |
| 5. PostgreSQL | ⬜ | |
| 6. Nginx proxy | ⬜ | |
| 7. setup-docker.sh | ⬜ | |
| 8. Health checks | ⬜ | |
| 9. Makefile | ⬜ | |
| 10. GitHub Actions | ⬜ | |

**Всего пройдено: __ / 10**

---

## Переход к следующей задаче

Все тесты пройдены? **Да / Нет**

Если да → переходим к **ФАЗА 1.2: Универсальная коллекция Services с Field Builder**

Если нет → исправляем ошибки и повторяем тесты
