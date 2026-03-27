#!/bin/bash
# docker/scripts/update-all-clients.sh
# Массовое обновление всех клиентских сайтов
# Использование: ./update-all-clients.sh [version]

set -e

VERSION=${1:-latest}
LOG_FILE="/var/log/cms-update-$(date +%Y%m%d-%H%M%S).log"
CLIENTS_DIR="/opt/cms-clients"
BACKUP_DIR="/opt/cms-backups"

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Проверка директории клиентов
if [ ! -d "$CLIENTS_DIR" ]; then
    log "${RED}Ошибка: Директория клиентов не найдена: $CLIENTS_DIR${NC}"
    exit 1
fi

# Создание директории для бэкапов
mkdir -p "$BACKUP_DIR"

log "${GREEN}========================================${NC}"
log "${GREEN}Массовое обновление клиентов${NC}"
log "${GREEN}Версия: $VERSION${NC}"
log "${GREEN}Начало: $(date)${NC}"
log "${GREEN}========================================${NC}"
log ""

# Получение списка клиентов
CLIENTS=$(ls -1 "$CLIENTS_DIR" 2>/dev/null || true)

if [ -z "$CLIENTS" ]; then
    log "${RED}Ошибка: Клиенты не найдены в $CLIENTS_DIR${NC}"
    exit 1
fi

TOTAL=$(echo "$CLIENTS" | wc -l)
SUCCESS=0
FAILED=0

log "Найдено клиентов: $TOTAL"
log ""

# Функция обновления одного клиента
update_client() {
    local client=$1
    local client_dir="$CLIENTS_DIR/$client"
    local backup_file="$BACKUP_DIR/${client}-$(date +%Y%m%d-%H%M%S).sql"

    log "${YELLOW}[$(($SUCCESS + $FAILED + 1))/$TOTAL] Обновление $client...${NC}"

    # Проверка наличия docker-compose.yml
    if [ ! -f "$client_dir/docker-compose.prod.yml" ]; then
        log "${RED}  ✗ docker-compose.prod.yml не найден${NC}"
        return 1
    fi

    cd "$client_dir"

    # Бэкап базы данных
    log "  Создание бэкапа БД..."
    if docker exec "${client}_postgres" pg_dump -U payload payload > "$backup_file" 2>/dev/null; then
        log "  ${GREEN}✓ Бэкап создан: $backup_file${NC}"
    else
        log "  ${RED}✗ Ошибка создания бэкапа${NC}"
        return 1
    fi

    # Обновление образов
    log "  Обновление образов..."
    export VERSION
    if docker-compose -f docker-compose.prod.yml pull 2>&1 | tee -a "$LOG_FILE"; then
        log "  ${GREEN}✓ Образы загружены${NC}"
    else
        log "  ${RED}✗ Ошибка загрузки образов${NC}"
        return 1
    fi

    # Перезапуск контейнеров
    log "  Перезапуск контейнеров..."
    if docker-compose -f docker-compose.prod.yml up -d 2>&1 | tee -a "$LOG_FILE"; then
        log "  ${GREEN}✓ Контейнеры перезапущены${NC}"
    else
        log "  ${RED}✗ Ошибка перезапуска контейнеров${NC}"
        log "  ${YELLOW}  Откат к предыдущей версии...${NC}"
        # Откат
        docker-compose -f docker-compose.prod.yml down
        docker exec -i "${client}_postgres" psql -U payload payload < "$backup_file" 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml up -d
        return 1
    fi

    # Проверка здоровья
    log "  Проверка здоровья..."
    sleep 10
    if docker inspect --format='{{.State.Health.Status}}' "${client}_web" 2>/dev/null | grep -q "healthy"; then
        log "  ${GREEN}✓ Сервисы работают нормально${NC}"
    else
        log "  ${YELLOW}⚠ Статус здоровья не определен${NC}"
    fi

    log ""
    return 0
}

# Обновление каждого клиента
for client in $CLIENTS; do
    if update_client "$client"; then
        ((SUCCESS++))
    else
        ((FAILED++))
    fi
done

# Итоги
log "${GREEN}========================================${NC}"
log "${GREEN}Обновление завершено${NC}"
log "${GREEN}Успешно: $SUCCESS${NC}"
log "${RED}Ошибок: $FAILED${NC}"
log "${GREEN}Время: $(date)${NC}"
log "${GREEN}Лог: $LOG_FILE${NC}"
log "${GREEN}========================================${NC}"

if [ $FAILED -gt 0 ]; then
    exit 1
fi

exit 0
