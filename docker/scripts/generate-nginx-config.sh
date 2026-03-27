#!/bin/bash
# docker/scripts/generate-nginx-config.sh
# Генерация nginx конфигурации для клиента
# Использование: ./generate-nginx-config.sh example.com

set -e

DOMAIN=${1:-}

if [ -z "$DOMAIN" ]; then
    echo "Ошибка: Укажите домен"
    echo "Использование: $0 example.com"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_DIR="$(dirname "$SCRIPT_DIR")/nginx"
TEMPLATE_FILE="$NGINX_DIR/conf.d/default.conf.template"
OUTPUT_FILE="$NGINX_DIR/conf.d/$DOMAIN.conf"

echo "Генерация конфигурации для $DOMAIN..."

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Ошибка: Шаблон не найден: $TEMPLATE_FILE"
    exit 1
fi

# Замена переменных в шаблоне
export DOMAIN
export CMS_PORT=${CMS_PORT:-3001}
export WEB_PORT=${WEB_PORT:-3000}

envsubst < "$TEMPLATE_FILE" > "$OUTPUT_FILE"

echo "✓ Конфигурация создана: $OUTPUT_FILE"
echo ""
echo "Для применения конфигурации:"
echo "  docker-compose -f docker-compose.prod.yml restart nginx"
