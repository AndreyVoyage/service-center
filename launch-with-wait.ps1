#!/usr/bin/env pwsh
# Запуск с ожиданием компиляции CMS (критически важно!)

param(
    [int]$WaitSeconds = 45  # Время ожидания компиляции CMS
)

$ErrorActionPreference = "Continue"

Write-Host @"
╔═══════════════════════════════════════════════════╗
║  ColdService - Launch with Compilation Wait      ║
║  ⚠️  ВАЖНО: CMS компилируется 30-40 секунд!       ║
╚═══════════════════════════════════════════════════╝
"@ -ForegroundColor Yellow

# Environment
$env:NODE_OPTIONS = "--max-old-space-size=8192"
$env:NEXT_TELEMETRY_DISABLED = "1"

# 1. Запускаем CMS первым
Write-Host "`n[1/3] 🚀 Запуск CMS (первый старт ~40s)..." -ForegroundColor Yellow
$cmsJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD/apps/cms"
    $env:NODE_OPTIONS = "--max-old-space-size=8192"
    & pnpm dev 2>&1
}

# 2. Ждём компиляции (КРИТИЧЕСКИ ВАЖНО!)
Write-Host "`n[2/3] ⏳ Ожидание компиляции CMS ($WaitSeconds секунд)..." -ForegroundColor Cyan
Write-Host "    Не прерывайте! CMS компилирует /api/[...slug]..." -ForegroundColor Gray

$dots = 0
for ($i = $WaitSeconds; $i -gt 0; $i--) {
    # Показываем прогресс
    Write-Host "`r    Осталось: $i сек... " -NoNewline -ForegroundColor Gray
    
    # Проверяем логи на завершение компиляции
    $logs = Receive-Job $cmsJob 2>$null
    if ($logs -match "Compiled.*api.*\[.*\].*in.*s") {
        Write-Host "`n    ✅ CMS скомпилировался досрочно!" -ForegroundColor Green
        break
    }
    
    Start-Sleep 1
}

Write-Host "`n`n    ✅ CMS должен быть готов" -ForegroundColor Green

# 3. Проверяем health
Write-Host "`n[3/3] 🔍 Проверка readiness..." -ForegroundColor Yellow
$healthRetries = 10
$healthOk = $false

while ($healthRetries -gt 0 -and -not $healthOk) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            Write-Host "    ✅ CMS готов! (warmup: $($data.warmUpTime)ms)" -ForegroundColor Green
            $healthOk = $true
        }
    } catch {
        $healthRetries--
        Write-Host "    ⏳ Ожидание... ($healthRetries попыток)" -ForegroundColor Gray
        Start-Sleep 2
    }
}

if (-not $healthOk) {
    Write-Host "    ⚠️  CMS не отвечает, но продолжаем..." -ForegroundColor Yellow
}

# 4. Запускаем Web
Write-Host "`n🚀 Запуск Web..." -ForegroundColor Yellow
$webJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD/apps/web"
    $env:NODE_OPTIONS = "--max-old-space-size=8192"
    & pnpm dev 2>&1
}

# 5. Ждём Web
Write-Host "⏳ Ожидание Web (10 сек)..." -ForegroundColor Gray
Start-Sleep 10

Write-Host @"

╔═══════════════════════════════════════════════════╗
║  ✅ Система запущена!                            ║
╠═══════════════════════════════════════════════════╣
║  CMS:  http://localhost:3001                     ║
║  Web:  http://localhost:3002                     ║
╠═══════════════════════════════════════════════════╣
║  Для остановки: Ctrl+C в этом окне               ║
╚═══════════════════════════════════════════════════╝
"@ -ForegroundColor Green

# Вывод логов
try {
    while ($true) {
        $cmsLogs = Receive-Job $cmsJob
        if ($cmsLogs) { Write-Host "[CMS] $cmsLogs" -ForegroundColor Cyan }
        
        $webLogs = Receive-Job $webJob  
        if ($webLogs) { Write-Host "[Web] $webLogs" -ForegroundColor Magenta }
        
        Start-Sleep 0.5
    }
} finally {
    Stop-Job $cmsJob -ErrorAction SilentlyContinue
    Stop-Job $webJob -ErrorAction SilentlyContinue
    Remove-Job $cmsJob, $webJob -ErrorAction SilentlyContinue
    Write-Host "`n👋 Система остановлена" -ForegroundColor Yellow
}
