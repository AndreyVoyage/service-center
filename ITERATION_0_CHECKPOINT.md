# ИТЕРАЦИЯ 0: Infrastructure — Checkpoint

## ✅ Verification (Checkpoint 0)

### Шаг 1: Запуск PostgreSQL

```bash
docker-compose up -d
sleep 5
docker exec sc_postgres pg_isready -U postgres
```

**Ожидаемый результат:**
```
localhost:5432 - accepting connections
```

### Шаг 2: Проверка структуры проекта

```bash
ls -la
```

**Ожидаемый результат:**
```
package.json
turbo.json
docker-compose.yml
.gitignore
apps/
packages/
```

### Шаг 3: Проверка Docker

```bash
docker ps
```

**Ожидаемый результат:**
```
CONTAINER ID   IMAGE                STATUS         PORTS
xxxxxxxxxxxx   postgres:15-alpine   Up X seconds   0.0.0.0:5432->5432/tcp
```

## 📋 Чек-лист

- [ ] PostgreSQL запущен и принимает соединения
- [ ] Структура директорий создана
- [ ] Root package.json с workspaces
- [ ] turbo.json настроен
- [ ] docker-compose.yml работает

## 🆘 Fallback Strategy

**Проблема:** Порт 5432 занят
**Решение:** Изменить в docker-compose.yml на `5433:5432` и использовать `postgresql://postgres:postgres@localhost:5433/payload`

**Проблема:** Docker не запущен
**Решение:** Запустить Docker Desktop или `sudo systemctl start docker`

---

**Если все галочки отмечены → переходим к ИТЕРАЦИИ 1**
