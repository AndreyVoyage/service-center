#!/usr/bin/env pwsh
# ColdService Startup Script with Verification

$ErrorActionPreference = "Stop"

function Write-Header($text) {
    Write-Host ""
    Write-Host "═══ $text ═══" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Status($status, $message) {
    switch ($status) {
        "ok" { Write-Host "  [OK] $message" -ForegroundColor Green }
        "warn" { Write-Host "  [!] $message" -ForegroundColor Yellow }
        "error" { Write-Host "  [X] $message" -ForegroundColor Red }
    }
}

# Check 1: .env files
Write-Header "Step 1: Checking Configuration"

$cmsEnv = Get-Content apps/cms/.env.local -ErrorAction SilentlyContinue
if ($cmsEnv -match "service_center") {
    Write-Status "ok" "CMS .env: DATABASE_URI = service_center"
} elseif ($cmsEnv -match "payload") {
    Write-Status "error" "CMS .env: DATABASE_URI = payload (NEEDS FIX!)"
    Write-Host "       Run: Fix-DatabaseUri" -ForegroundColor Yellow
} else {
    Write-Status "error" "CMS .env.local not found or invalid"
}

$webEnv = Get-Content apps/web/.env.local -ErrorAction SilentlyContinue
if ($webEnv -match "localhost:3001") {
    Write-Status "ok" "Web .env: NEXT_PUBLIC_CMS_URL configured"
} else {
    Write-Status "warn" "Web .env: Configuration may be missing"
}

# Check 2: Database exists
Write-Header "Step 2: Checking Database"

try {
    $result = psql service_center -c "SELECT current_database();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "ok" "Database 'service_center' exists"
    } else {
        Write-Status "error" "Database 'service_center' not found"
        Write-Host "       Create it in pgAdmin: CREATE DATABASE service_center;" -ForegroundColor Yellow
    }
} catch {
    Write-Status "warn" "Cannot check database (psql not in PATH)"
}

# Check 3: Start services
Write-Header "Step 3: Starting Services"

Write-Host "Starting CMS..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "pnpm dev:cms" -WindowStyle Normal

Write-Host "Waiting for CMS to initialize (30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verify CMS
Write-Header "Step 4: Verifying CMS"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -TimeoutSec 5
    Write-Status "ok" "CMS is running"
    Write-Host ""
    Write-Host "  Health Status: $($response.status)" -ForegroundColor Green
    if ($response.data) {
        Write-Host "  Globals loaded:" -ForegroundColor Cyan
        $response.data.PSObject.Properties | ForEach-Object {
            $symbol = if ($_.Value) { "✓" } else { "✗" }
            $color = if ($_.Value) { "Green" } else { "Red" }
            Write-Host "    [$symbol] $($_.Name)" -ForegroundColor $color
        }
    }
} catch {
    Write-Status "error" "CMS not responding"
    Write-Host "       Check: http://localhost:3001/api/health" -ForegroundColor Yellow
}

# Start Web
Write-Header "Step 5: Starting Web"
Write-Host "Starting Web server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "pnpm dev:web" -WindowStyle Normal

Write-Host ""
Write-Host "Waiting for Web to initialize (10s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Final check
Write-Header "Step 6: Final Verification"

try {
    $webResponse = Invoke-WebRequest -Uri "http://localhost:3002" -TimeoutSec 5
    if ($webResponse.StatusCode -eq 200) {
        Write-Status "ok" "Web server is running on http://localhost:3002"
    }
} catch {
    Write-Status "warn" "Web server may still be starting..."
}

Write-Header "Startup Complete"
Write-Host "  CMS Admin:  http://localhost:3001/admin" -ForegroundColor Cyan
Write-Host "  Website:    http://localhost:3002" -ForegroundColor Cyan
Write-Host "  Health API: http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
