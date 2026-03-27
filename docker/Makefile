# docker/Makefile
# Удобные команды для работы с Docker

.PHONY: help setup dev prod stop logs clean build push

# Переменные
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
COMPOSE_PROD = docker-compose -f docker-compose.prod.yml
CLIENT_NAME ?= client1

# Цвета
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m

help: ## Показать справку
	@echo "$(BLUE)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

setup: ## Настройка Docker на сервере (зеркала РФ)
	@echo "$(BLUE)Настройка Docker...$(NC)"
	chmod +x scripts/setup-docker.sh
	sudo ./scripts/setup-docker.sh

dev-up: ## Запуск development окружения (только Postgres)
	@echo "$(BLUE)Запуск development окружения...$(NC)"
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✓ Development окружение запущено$(NC)"
	@echo "  Postgres: localhost:5432"
	@echo "  Adminer:  localhost:8080"

dev-down: ## Остановка development окружения
	@echo "$(YELLOW)Остановка development окружения...$(NC)"
	$(COMPOSE_DEV) down

dev-logs: ## Логи development окружения
	$(COMPOSE_DEV) logs -f

dev-clean: ## Полная очистка development окружения
	@echo "$(RED)Очистка development окружения...$(NC)"
	$(COMPOSE_DEV) down -v --remove-orphans
	rm -rf postgres_dev_data

prod-up: ## Запуск production окружения
	@echo "$(BLUE)Запуск production окружения...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(RED)Ошибка: Создайте файл .env из .env.example$(NC)"; \
		exit 1; \
	fi
	$(COMPOSE_PROD) up -d
	@echo "$(GREEN)✓ Production окружение запущено$(NC)"

prod-build: ## Сборка production образов
	@echo "$(BLUE)Сборка production образов...$(NC)"
	$(COMPOSE_PROD) build --no-cache

prod-stop: ## Остановка production окружения
	@echo "$(YELLOW)Остановка production окружения...$(NC)"
	$(COMPOSE_PROD) stop

prod-down: ## Удаление production контейнеров
	@echo "$(YELLOW)Удаление production контейнеров...$(NC)"
	$(COMPOSE_PROD) down

prod-logs: ## Логи production окружения
	$(COMPOSE_PROD) logs -f

prod-clean: ## Полная очистка production окружения (ВНИМАНИЕ: удалит данные!)
	@echo "$(RED)ВНИМАНИЕ: Это удалит ВСЕ данные!$(NC)"
	@read -p "Вы уверены? [y/N] " confirm && [ $$confirm = y ] || exit 1
	$(COMPOSE_PROD) down -v --remove-orphans

build-cms: ## Сборка образа CMS
	@echo "$(BLUE)Сборка образа CMS...$(NC)"
	docker build -f ../apps/cms/Dockerfile.prod -t ghcr.io/$(GITHUB_OWNER)/cms:$(VERSION) ../..

build-web: ## Сборка образа Web
	@echo "$(BLUE)Сборка образа Web...$(NC)"
	docker build -f ../apps/web/Dockerfile.prod -t ghcr.io/$(GITHUB_OWNER)/web:$(VERSION) ../..

push: ## Пуш образов в GitHub Container Registry
	@echo "$(BLUE)Пуш образов в GHCR...$(NC)"
	docker push ghcr.io/$(GITHUB_OWNER)/cms:$(VERSION)
	docker push ghcr.io/$(GITHUB_OWNER)/web:$(VERSION)

logs: ## Просмотр логов всех сервисов
	$(COMPOSE_PROD) logs -f --tail=100

ps: ## Список запущенных контейнеров
	$(COMPOSE_PROD) ps

status: ## Статус всех сервисов
	@echo "$(BLUE)Статус сервисов:$(NC)"
	@$(COMPOSE_PROD) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

health: ## Проверка здоровья сервисов
	@echo "$(BLUE)Проверка здоровья...$(NC)"
	@docker inspect --format='{{.Name}}: {{.State.Health.Status}}' $(shell $(COMPOSE_PROD) ps -q) 2>/dev/null || echo "Health check не настроен"

backup: ## Бэкап базы данных
	@echo "$(BLUE)Создание бэкапа БД...$(NC)"
	@mkdir -p backups
	docker exec cms_postgres pg_dump -U payload payload_cms > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Бэкап создан$(NC)"

restore: ## Восстановление базы данных из бэкапа
	@echo "$(YELLOW)Восстановление БД...$(NC)"
	@ls -1 backups/*.sql | tail -5
	@read -p "Введите имя файла бэкапа: " backup_file; \
	docker exec -i cms_postgres psql -U payload payload_cms < backups/$$backup_file
	@echo "$(GREEN)✓ База данных восстановлена$(NC)"

shell-cms: ## Вход в контейнер CMS
	docker exec -it $(CLIENT_NAME)_cms /bin/sh

shell-web: ## Вход в контейнер Web
	docker exec -it $(CLIENT_NAME)_web /bin/sh

shell-db: ## Вход в контейнер PostgreSQL
	docker exec -it $(CLIENT_NAME)_postgres psql -U payload payload_cms

test: ## Запуск тестов
	@echo "$(BLUE)Запуск тестов...$(NC)"
	cd .. && pnpm test

lint: ## Проверка кода
	@echo "$(BLUE)Проверка кода...$(NC)"
	cd .. && pnpm lint

update: ## Обновление всех образов
	@echo "$(BLUE)Обновление образов...$(NC)"
	docker pull dockerhub1.beget.ru/library/postgres:16-alpine
	docker pull dockerhub1.beget.ru/library/nginx:alpine
	@echo "$(GREEN)✓ Образы обновлены$(NC)"

prune: ## Очистка неиспользуемых Docker ресурсов
	@echo "$(YELLOW)Очистка Docker...$(NC)"
	docker system prune -f
	docker volume prune -f
