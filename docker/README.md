# Docker Инфраструктура для Мультитенантной CMS

## Структура

```
docker/
├── docker-compose.prod.yml      # Production конфигурация
├── docker-compose.dev.yml       # Development конфигурация
├── .env.example                 # Пример переменных окружения
├── Makefile                     # Удобные команды
├── nginx/
│   ├── nginx.conf              # Основная конфигурация Nginx
│   └── conf.d/
│       └── default.conf.template # Шаблон для клиентов
└── scripts/
    ├── setup-docker.sh         # Настройка Docker на сервере РФ
    ├── generate-nginx-config.sh # Генерация конфига для клиента
    └── update-all-clients.sh   # Массовое обновление клиентов
```

## Быстрый старт

### 1. Настройка Docker на сервере (РФ)

```bash
cd docker
sudo ./scripts/setup-docker.sh
```

Этот скрипт:
- Настраивает зеркала Docker (beget, timeweb, gcr)
- Устанавливает Docker Compose
- Настраивает sysctl параметры

### 2. Development окружение

```bash
# Запуск только PostgreSQL и Adminer
make dev-up

# Проверка
# PostgreSQL: localhost:5432
# Adminer: localhost:8080
```

### 3. Production окружение

```bash
# Создать .env файл
cp .env.example .env
# Отредактировать .env

# Запуск
make prod-up

# Проверка статуса
make status
```

## Команды Makefile

| Команда | Описание |
|---------|----------|
| `make setup` | Настройка Docker на сервере |
| `make dev-up` | Запуск development окружения |
| `make dev-down` | Остановка development окружения |
| `make prod-up` | Запуск production окружения |
| `make prod-build` | Сборка production образов |
| `make prod-down` | Остановка production окружения |
| `make logs` | Просмотр логов |
| `make status` | Статус сервисов |
| `make backup` | Бэкап базы данных |
| `make shell-cms` | Вход в контейнер CMS |
| `make shell-web` | Вход в контейнер Web |

## Зеркала Docker для РФ

Используются следующие зеркала (в порядке приоритета):
1. `https://dockerhub1.beget.ru`
2. `https://dockerhub.timeweb.ru`
3. `https://mirror.gcr.io`
4. `https://c.163.com`
5. `https://registry.docker-cn.com`

## Мультитенантность

Для каждого клиента создается отдельная директория:

```
/opt/cms-clients/
├── client1/
│   ├── docker-compose.prod.yml
│   ├── .env
│   └── nginx/conf.d/client1.com.conf
├── client2/
│   └── ...
```

### Добавление нового клиента

```bash
# 1. Создать директорию
mkdir -p /opt/cms-clients/newclient

# 2. Скопировать docker-compose
cp docker/docker-compose.prod.yml /opt/cms-clients/newclient/

# 3. Создать .env
nano /opt/cms-clients/newclient/.env

# 4. Сгенерировать nginx конфиг
./scripts/generate-nginx-config.sh newclient.com

# 5. Запуск
cd /opt/cms-clients/newclient
docker-compose -f docker-compose.prod.yml up -d
```

## Массовое обновление

```bash
# Обновить всех клиентов до версии v1.2.3
./scripts/update-all-clients.sh v1.2.3
```

## CI/CD (GitHub Actions)

При push в `main` или `develop`:
1. Запускаются lint и type check
2. Запускаются unit тесты
3. Собираются Docker образы
4. Образы пушатся в GHCR
5. Запускаются E2E тесты (Playwright)
6. Запускается Lighthouse CI
7. Деплой на staging/production

## Тестирование

### Проверка Docker зеркал

```bash
docker pull dockerhub1.beget.ru/library/hello-world
docker run --rm dockerhub1.beget.ru/library/hello-world
```

### Проверка сервисов

```bash
# CMS API
curl http://localhost:3001/api/health

# Web
curl http://localhost:3000/api/health

# PostgreSQL
docker exec client1_postgres pg_isready -U payload
```

## Безопасность

- Контейнеры запускаются от непривилегированных пользователей
- Используются health checks
- Rate limiting для админки
- Security headers в Nginx
- SSL/TLS обязателен для production

## Мониторинг

```bash
# Логи всех сервисов
make logs

# Логи конкретного сервиса
docker logs -f client1_cms

# Метрики Docker
docker stats
```
