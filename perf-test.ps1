# Performance Test Script
# Запуск: .\perf-test.ps1

Write-Host "=== Performance Test ===" -ForegroundColor Cyan
Write-Host ""

$results = @()

# Функция для измерения времени
function Test-Endpoint {
    param($Name, $Url)
    
    Write-Host "Testing $Name..." -ForegroundColor Yellow -NoNewline
    
    $start = Get-Date
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 30 -ErrorAction Stop
        $duration = ((Get-Date) - $start).TotalMilliseconds
        
        Write-Host " $($duration.ToString('F0'))ms" -ForegroundColor Green
        
        return @{
            Name = $Name
            Url = $Url
            Duration = [math]::Round($duration, 2)
            Status = $response.StatusCode
            Success = $true
        }
    } catch {
        $duration = ((Get-Date) - $start).TotalMilliseconds
        Write-Host " FAILED (${duration.ToString('F0')}ms)" -ForegroundColor Red
        
        return @{
            Name = $Name
            Url = $Url
            Duration = [math]::Round($duration, 2)
            Status = 0
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Тесты
$results += Test-Endpoint "Health" "http://localhost:3001/api/health"
$results += Test-Endpoint "Hero (warm)" "http://localhost:3001/api/globals/hero"
$results += Test-Endpoint "Footer" "http://localhost:3001/api/globals/footer"
$results += Test-Endpoint "Services" "http://localhost:3001/api/services?limit=100"
$results += Test-Endpoint "Reviews" "http://localhost:3001/api/reviews?limit=20"
$results += Test-Endpoint "Web Page" "http://localhost:3002"

# Статистика
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
$successful = $results | Where-Object { $_.Success }
$failed = $results | Where-Object { -not $_.Success }

if ($successful) {
    $avgTime = ($successful | Measure-Object Duration -Average).Average
    $maxTime = ($successful | Measure-Object Duration -Maximum).Maximum
    $minTime = ($successful | Measure-Object Duration -Minimum).Minimum
    
    Write-Host "Successful: $($successful.Count)" -ForegroundColor Green
    Write-Host "Failed: $($failed.Count)" -ForegroundColor $(if ($failed.Count -gt 0) { "Red" } else { "Green" })
    Write-Host "Average: $([math]::Round($avgTime, 2))ms" -ForegroundColor Yellow
    Write-Host "Min: $([math]::Round($minTime, 2))ms" -ForegroundColor Green
    Write-Host "Max: $([math]::Round($maxTime, 2))ms" -ForegroundColor $(if ($maxTime -gt 3000) { "Red" } else { "Green" })
}

if ($failed) {
    Write-Host ""
    Write-Host "Failed requests:" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "  - $($_.Name): $($_.Error)" -ForegroundColor Red }
}

Write-Host ""
Write-Host "=== Target ===" -ForegroundColor Cyan
Write-Host "Goal: All endpoints < 3000ms" -ForegroundColor Gray

$allFast = $successful | Where-Object { $_.Duration -lt 3000 }
if ($allFast.Count -eq $successful.Count -and $failed.Count -eq 0) {
    Write-Host "✅ ALL TARGETS MET!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some endpoints are slow" -ForegroundColor Yellow
}
