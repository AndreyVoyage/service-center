# Emergency Recovery Script for Windows PowerShell
# Запуск: .\EMERGENCY-RECOVERY.ps1

Write-Host "🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ..." -ForegroundColor Red
Write-Host ""

# 1. Убить все процессы Node.js
Write-Host "1. Остановка всех процессов Node.js..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process postgres -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 2

# 2. Очистка кэшей
Write-Host "2. Очистка всех кэшей..." -ForegroundColor Yellow
Remove-Item -Recurse -Force apps/cms/.next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps/web/.next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps/cms/node_modules/.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps/web/node_modules/.cache -ErrorAction SilentlyContinue

# 3. Проверка памяти
Write-Host "3. Проверка памяти..." -ForegroundColor Yellow
$memory = Get-WmiObject -Class Win32_OperatingSystem
$freeMemoryGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
Write-Host "   Свободно RAM: $freeMemoryGB GB" -ForegroundColor Cyan

if ($freeMemoryGB -lt 2) {
    Write-Host "   ⚠️  КРИТИЧЕСКИ МАЛО ПАМЯТИ! Закройте другие программы!" -ForegroundColor Red
}

# 4. Перезапуск PostgreSQL
Write-Host "4. Перезапуск PostgreSQL..." -ForegroundColor Yellow
Restart-Service postgresql-x64-15 -ErrorAction SilentlyContinue
Start-Sleep 3

# Проверка
$pgStatus = Get-Service postgresql-x64-15 -ErrorAction SilentlyContinue
if ($pgStatus.Status -eq 'Running') {
    Write-Host "   ✅ PostgreSQL запущен" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Не удалось перезапустить PostgreSQL" -ForegroundColor Red
}

# 5. Установка переменных окружения
Write-Host "5. Настройка окружения..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_DISABLE_CACHE = "1"

Write-Host "   NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor Cyan

# 6. Проверка БД
Write-Host "6. Проверка PostgreSQL..." -ForegroundColor Yellow
$env:DATABASE_URI = "postgresql://postgres:postgres@localhost:5432/service_center"

# Проверка соединения
try {
    $result = psql $env:DATABASE_URI -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ БД доступна" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Нет доступа к БД" -ForegroundColor Red
    }
} catch {
    Write-Host "   ⚠️  psql не найден или ошибка подключения" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Восстановление завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "Запуск: pnpm dev" -ForegroundColor Cyan
Write-Host ""
