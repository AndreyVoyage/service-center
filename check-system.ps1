# Проверка системы перед запуском
Write-Host "🔍 Проверка системы..." -ForegroundColor Cyan
Write-Host ""

# Проверка памяти
$memory = Get-WmiObject -Class Win32_OperatingSystem
$totalMemoryGB = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
$freeMemoryGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)

Write-Host "💾 Память:" -ForegroundColor Yellow
Write-Host "   Всего: $totalMemoryGB GB"
Write-Host "   Свободно: $freeMemoryGB GB"

if ($freeMemoryGB -lt 2) {
    Write-Host "   ⚠️  КРИТИЧЕСКИ МАЛО ПАМЯТИ!" -ForegroundColor Red
    Write-Host "   Закройте Chrome, VS Code и другие программы!" -ForegroundColor Red
} elseif ($freeMemoryGB -lt 4) {
    Write-Host "   ⚠️  Мало памяти, рекомендуется закрыть лишние программы" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Памяти достаточно" -ForegroundColor Green
}

Write-Host ""

# Проверка PostgreSQL
Write-Host "🐘 PostgreSQL:" -ForegroundColor Yellow
try {
    $pgService = Get-Service postgresql-x64-15 -ErrorAction SilentlyContinue
    if ($pgService.Status -eq 'Running') {
        Write-Host "   ✅ Служба запущена" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Служба остановлена" -ForegroundColor Red
        Write-Host "   Запустите: net start postgresql-x64-15" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ⚠️  Не удалось проверить службу" -ForegroundColor Yellow
}

Write-Host ""

# Проверка Node.js
Write-Host "📦 Node.js:" -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✅ Установлен: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Не найден" -ForegroundColor Red
}

# Проверка pnpm
$pnpmVersion = pnpm --version 2>$null
if ($pnpmVersion) {
    Write-Host "   ✅ pnpm: $pnpmVersion" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  pnpm не найден" -ForegroundColor Yellow
}

Write-Host ""

# Проверка процессов
Write-Host "⚙️  Активные процессы:" -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Node.js процессов: $($nodeProcesses.Count)" -ForegroundColor Yellow
    Write-Host "   Используемая память: $([math]::Round(($nodeProcesses | Measure-Object WorkingSet -Sum).Sum / 1MB, 2)) MB" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Node.js процессов нет" -ForegroundColor Green
}

Write-Host ""

# Проверка диска
$disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
$freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
Write-Host "💽 Диск C: свободно: $freeSpaceGB GB" -ForegroundColor Yellow

if ($freeSpaceGB -lt 1) {
    Write-Host "   ⚠️  Мало места на диске!" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Проверка завершена" -ForegroundColor Green
Write-Host ""

# Рекомендации
if ($freeMemoryGB -lt 2) {
    Write-Host "⚠️  РЕКОМЕНДАЦИЯ: Закройте программы перед запуском!" -ForegroundColor Red
} else {
    Write-Host "✅ Можно запускать: pnpm dev" -ForegroundColor Green
}
