# Скрипт прогрева CMS после запуска
Write-Host "🔥 Прогрев CMS..." -ForegroundColor Cyan

$maxRetries = 15
$delay = 2000
$healthUrl = "http://localhost:3001/api/health"

for ($i = 1; $i -le $maxRetries; $i++) {
  try {
    Write-Host "Попытка $i/$maxRetries..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 5 -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
      $data = $response.Content | ConvertFrom-Json
      Write-Host "✅ Прогрев завершен за $($data.warmUpTime)ms!" -ForegroundColor Green
      
      if ($data.data) {
        Write-Host "   Hero: $($data.data.hero)" -ForegroundColor Gray
        Write-Host "   Footer: $($data.data.footer)" -ForegroundColor Gray
        Write-Host "   Services: $($data.data.servicesCount)" -ForegroundColor Gray
        Write-Host "   Reviews: $($data.data.reviewsCount)" -ForegroundColor Gray
      }
      
      exit 0
    }
  } catch {
    Write-Host "   CMS еще не готов, ждем..." -ForegroundColor Gray
  }
  
  Start-Sleep -Milliseconds $delay
}

Write-Host "⚠️  Не удалось прогреть CMS после $maxRetries попыток" -ForegroundColor Red
Write-Host "   Но система должна работать с fallback данными" -ForegroundColor Yellow
exit 1
