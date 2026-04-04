#!/bin/bash
set -e

echo "🚨 Применение критического фикса..."
echo ""

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Остановка процессов...${NC}"
pkill -f "next dev" || true
sleep 2

echo -e "${YELLOW}2. Очистка кэшей...${NC}"
rm -rf apps/cms/.next apps/web/.next
rm -rf .turbo

echo -e "${YELLOW}3. Проверка DATABASE_URI...${NC}"
if [ -z "$DATABASE_URI" ]; then
    echo -e "${RED}⚠️  DATABASE_URI не установлен!${NC}"
    echo "Установите: export DATABASE_URI=postgresql://..."
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URI: $DATABASE_URI${NC}"

echo -e "${YELLOW}4. Применение миграции...${NC}"
cd apps/cms

# Пробуем применить через psql напрямую
if command -v psql &> /dev/null; then
    echo "Применение SQL миграции..."
    psql $DATABASE_URI -f fix-migration.sql || {
        echo -e "${RED}❌ SQL миграция не удалась${NC}"
        echo "Пробуем через Payload CLI..."
    }
else
    echo -e "${YELLOW}⚠️ psql не найден, пропускаем SQL миграцию${NC}"
fi

cd ../..

echo -e "${GREEN}✅ Миграция применена!${NC}"
echo ""
echo -e "${YELLOW}5. Запуск серверов...${NC}"
echo ""

pnpm dev
