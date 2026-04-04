#!/usr/bin/env pwsh
# Optimized launch for ColdService
# Run: .\start-optimized.ps1

param(
    [switch]$SkipWarmup,
    [switch]$TestOnly
)

$ErrorActionPreference = "Stop"

# Store original directory
$ProjectRoot = $PWD.Path

Write-Host @"
=====================================================
  ColdService - Optimized Launch
  Stable version with warmup
=====================================================
"@ -ForegroundColor Cyan

# 1. System check
Write-Host "`n[1/4] Checking system..." -ForegroundColor Yellow

# Simple check instead of external script
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "X Node.js not found. Please install Node.js." -ForegroundColor Red
    exit 1}
Write-Host "OK Node.js: $nodeVersion" -ForegroundColor Green

$pnpmVersion = pnpm --version 2>$null
if (-not $pnpmVersion) {
    Write-Host "X pnpm not found. Please install pnpm (npm install -g pnpm)." -ForegroundColor Red
    exit 1}
Write-Host "OK pnpm: $pnpmVersion" -ForegroundColor Green

# Check if PostgreSQL is running
try {
    $pgReady = pg_isready -h localhost -p 5432 2>$null
    if ($pgReady -match "accepting connections") {
        Write-Host "OK PostgreSQL: accepting connections" -ForegroundColor Green
    } else {
        Write-Host "! PostgreSQL may not be ready" -ForegroundColor Yellow
    }
} catch {
    Write-Host "! PostgreSQL check skipped" -ForegroundColor Yellow
}

if ($TestOnly) {
    Write-Host "`nSystem ready! (TestOnly mode)" -ForegroundColor Green
    exit 0
}

# 2. Cleanup (optional)
Write-Host "`n[2/4] Checking caches..." -ForegroundColor Yellow
if (Test-Path "$ProjectRoot/apps/cms/.next") {
    $clean = Read-Host "Clear caches before launch? (y/n)"
    if ($clean -eq 'y') {
        Remove-Item -Recurse -Force "$ProjectRoot/apps/cms/.next", "$ProjectRoot/apps/web/.next" -ErrorAction SilentlyContinue
        Write-Host "OK Caches cleared" -ForegroundColor Green
    }
}

# 3. Environment setup
Write-Host "`n[3/4] Setting up environment..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_DISABLE_CACHE = "0"

Write-Host "OK Environment configured" -ForegroundColor Green

# 4. Launch CMS
Write-Host "`n[4/4] Launching CMS..." -ForegroundColor Yellow

$cmsJob = Start-Job -ScriptBlock {
    param($RootPath)
    Set-Location "$RootPath/apps/cms"
    & pnpm dev 2>&1
} -ArgumentList $ProjectRoot

# Wait for CMS
Write-Host "Waiting for CMS startup (15 seconds)..." -ForegroundColor Gray
Start-Sleep 15

# Health check
$health = $null
$retries = 5
while ($retries -gt 0 -and -not $health) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 5 -ErrorAction Stop
        $health = $response.Content | ConvertFrom-Json
        Write-Host "OK CMS started (warmup: $($health.warmUpTime)ms)" -ForegroundColor Green
    } catch {
        $retries--
        if ($retries -eq 0) {
            Write-Host "! CMS not responding, continuing anyway..." -ForegroundColor Yellow
        } else {
            Write-Host "Retrying health check... ($retries left)" -ForegroundColor Gray
            Start-Sleep 3
        }
    }
}

# Warmup (if not skipped)
if (-not $SkipWarmup) {
    if ($health -and $health.warmed -eq $false) {
        Write-Host "`nWarming up CMS..." -ForegroundColor Yellow
        
        # Simple warmup - call all endpoints
        $endpoints = @(
            "http://localhost:3001/api/globals/hero",
            "http://localhost:3001/api/globals/footer",
            "http://localhost:3001/api/globals/contactForm",
            "http://localhost:3001/api/services?limit=100",
            "http://localhost:3001/api/reviews?limit=20"
        )
        
        foreach ($endpoint in $endpoints) {
            try {
                Invoke-WebRequest -Uri $endpoint -TimeoutSec 10 -ErrorAction Stop | Out-Null
                Write-Host "  OK $endpoint" -ForegroundColor Gray
            } catch {
                Write-Host "  X $endpoint failed" -ForegroundColor Red
            }
        }
        
        Write-Host "OK Warmup complete" -ForegroundColor Green
    }
}

# Launch Web
Write-Host "`nLaunching Web..." -ForegroundColor Yellow
$webJob = Start-Job -ScriptBlock {
    param($RootPath)
    Set-Location "$RootPath/apps/web"
    & pnpm dev 2>&1
} -ArgumentList $ProjectRoot

# Wait
Write-Host "Waiting for Web startup (10 seconds)..." -ForegroundColor Gray
Start-Sleep 10

Write-Host @"

=====================================================
  System launched!
=====================================================
  CMS:  http://localhost:3001
  Web:  http://localhost:3002
=====================================================
  To stop: Ctrl+C in this window
=====================================================
"@ -ForegroundColor Green

Write-Host "`nCMS Logs:" -ForegroundColor Cyan
Receive-Job $cmsJob -Keep | Select-Object -Last 20

Write-Host "`nWeb Logs:" -ForegroundColor Cyan
Receive-Job $webJob -Keep | Select-Object -Last 10

# Wait for completion
try {
    while ($true) {
        $cmsOutput = Receive-Job $cmsJob
        $webOutput = Receive-Job $webJob
        
        if ($cmsOutput) { $cmsOutput | ForEach-Object { Write-Host "[CMS] $_" -ForegroundColor DarkGray } }
        if ($webOutput) { $webOutput | ForEach-Object { Write-Host "[WEB] $_" -ForegroundColor DarkCyan } }
        
        Start-Sleep 1
    }
} finally {
    Stop-Job $cmsJob -ErrorAction SilentlyContinue
    Stop-Job $webJob -ErrorAction SilentlyContinue
    Remove-Job $cmsJob, $webJob -ErrorAction SilentlyContinue
    Write-Host "`nSystem stopped" -ForegroundColor Yellow
}