@echo off
chcp 65001 >nul
echo 🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ...
echo.

echo 1. Остановка процессов Node.js...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM postgres.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. Очистка кэшей...
rmdir /S /Q apps\cms\.next 2>nul
rmdir /S /Q apps\web\.next 2>nul
rmdir /S /Q .turbo 2>nul
rmdir /S /Q node_modules\.cache 2>nul

echo 3. Перезапуск PostgreSQL...
net stop postgresql-x64-15 2>nul
net start postgresql-x64-15 2>nul
timeout /t 3 /nobreak >nul

echo 4. Установка переменных окружения...
set NODE_OPTIONS=--max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_CACHE=1

echo.
echo ✅ Восстановление завершено!
echo.
echo Запуск: pnpm dev
echo.

pause
