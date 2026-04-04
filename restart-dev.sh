#!/bin/bash
# Скрипт для полной очистки и перезапуска dev серверов

echo "🧹 Очистка кэшей..."

# Останавливаем процессы
echo "⏹️  Остановка процессов..."
pkill -f "next dev" || true

# Очищаем кэши
echo "🗑️  Очистка .next и кэшей..."
cd apps/cms
rm -rf .next node_modules/.cache
cd ../web
rm -rf .next node_modules/.cache
cd ../..

# Очищаем Turbo кэш
rm -rf .turbo

echo "✅ Очистка завершена!"
echo ""
echo "🚀 Для запуска выполните:"
echo "   pnpm dev"
echo ""
echo "📋 Проверьте также:"
echo "   1. PostgreSQL запущен и доступен"
echo "   2. .env файлы настроены корректно"
echo "   3. PORT 3001 и 3002 свободны"
