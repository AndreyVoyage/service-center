#!/bin/bash
# docker/scripts/setup-docker.sh
# Скрипт настройки Docker для работы в РФ (с зеркалами)
# Использование: sudo ./setup-docker.sh

set -e

echo "=========================================="
echo "Настройка Docker для работы в РФ"
echo "=========================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Ошибка: Запустите скрипт с sudo${NC}"
    exit 1
fi

# Список зеркал Docker для РФ
DOCKER_MIRRORS=(
    "https://dockerhub1.beget.ru"
    "https://dockerhub.timeweb.ru"
    "https://mirror.gcr.io"
    "https://c.163.com"
    "https://registry.docker-cn.com"
)

# Список зеркал npm для РФ
NPM_REGISTRIES=(
    "https://registry.npmjs.org/"
    "https://registry.npmmirror.com/"
)

echo -e "${YELLOW}1. Создание директории Docker...${NC}"
mkdir -p /etc/docker

echo -e "${YELLOW}2. Настройка daemon.json с зеркалами...${NC}"
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://dockerhub1.beget.ru",
    "https://dockerhub.timeweb.ru",
    "https://mirror.gcr.io",
    "https://c.163.com",
    "https://registry.docker-cn.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "userland-proxy": false
}
EOF

echo -e "${GREEN}✓ daemon.json создан${NC}"

echo -e "${YELLOW}3. Перезапуск Docker...${NC}"
if systemctl is-active --quiet docker; then
    systemctl restart docker
    echo -e "${GREEN}✓ Docker перезапущен${NC}"
else
    echo -e "${YELLOW}⚠ Docker не запущен, пробуем запустить...${NC}"
    systemctl start docker || service docker start || true
fi

echo -e "${YELLOW}4. Проверка зеркал...${NC}"
echo "Тестирование подключения к зеркалам..."

for mirror in "${DOCKER_MIRRORS[@]}"; do
    if curl -s --max-time 5 "${mirror}/v2/" > /dev/null 2>&1 || \
       curl -s --max-time 5 "${mirror}" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ ${mirror} - доступно${NC}"
    else
        echo -e "${RED}✗ ${mirror} - недоступно${NC}"
    fi
done

echo -e "${YELLOW}5. Тестирование docker pull...${NC}"
if docker pull dockerhub1.beget.ru/library/hello-world:latest > /dev/null 2>&1; then
    echo -e "${GREEN}✓ docker pull работает через зеркало${NC}"
    docker rmi dockerhub1.beget.ru/library/hello-world:latest > /dev/null 2>&1 || true
else
    echo -e "${RED}✗ docker pull не работает, проверьте настройки${NC}"
fi

echo -e "${YELLOW}6. Установка Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Установка Docker Compose plugin..."
    DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
    mkdir -p $DOCKER_CONFIG/cli-plugins
    curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
    chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
    echo -e "${GREEN}✓ Docker Compose установлен${NC}"
else
    echo -e "${GREEN}✓ Docker Compose уже установлен${NC}"
fi

echo -e "${YELLOW}7. Настройка sysctl параметров...${NC}"
cat >> /etc/sysctl.conf <<EOF

# Docker optimization
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
EOF

sysctl -p > /dev/null 2>&1 || true
echo -e "${GREEN}✓ Параметры sysctl настроены${NC}"

echo -e "${YELLOW}8. Создание сети Docker...${NC}"
docker network create cms_network 2>/dev/null || echo -e "${YELLOW}⚠ Сеть уже существует${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}Настройка завершена!${NC}"
echo "=========================================="
echo ""
echo "Для проверки выполните:"
echo "  docker run --rm dockerhub1.beget.ru/library/hello-world"
echo ""
echo "Для запуска проекта:"
echo "  cd /path/to/project/docker"
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo ""
