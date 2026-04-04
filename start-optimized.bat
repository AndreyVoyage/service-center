@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ===========================================
echo    ColdService - Optimized Launch
echo    Stable version with warmup
echo ===========================================
echo.

:: Store project root
set "PROJECT_ROOT=%CD%"

:: 1. System check
echo [1/4] Checking system...
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found. Please install Node.js.
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do set "NODE_VERSION=%%a"
echo [OK] Node.js: %NODE_VERSION%

:: Check pnpm
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] pnpm not found. Please install pnpm: npm install -g pnpm
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('pnpm --version') do set "PNPM_VERSION=%%a"
echo [OK] pnpm: %PNPM_VERSION%

:: Check PostgreSQL (optional)
pg_isready -h localhost -p 5432 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL: accepting connections
) else (
    echo [!] PostgreSQL check skipped or not ready
)

echo.

:: 2. Cleanup (optional)
echo [2/4] Checking caches...
if exist "apps\cms\.next" (
    set /p CLEAN="Clear caches before launch? (y/n): "
    if /i "!CLEAN!"=="y" (
        echo Clearing caches...
        rmdir /s /q "apps\cms\.next" 2>nul
        rmdir /s /q "apps\web\.next" 2>nul
        echo [OK] Caches cleared
    )
)
echo.

:: 3. Environment setup
echo [3/4] Setting up environment...
set "NODE_OPTIONS=--max-old-space-size=4096"
set "NEXT_TELEMETRY_DISABLED=1"
set "NEXT_DISABLE_CACHE=0"
echo [OK] Environment configured
echo    - NODE_OPTIONS: %NODE_OPTIONS%
echo    - NEXT_TELEMETRY_DISABLED: %NEXT_TELEMETRY_DISABLED%
echo.

:: 4. Launch CMS
echo [4/4] Launching CMS...
echo.

:: Start CMS in new window
start "CMS - Port 3001" cmd /k "cd /d "%PROJECT_ROOT%\apps\cms" && echo Starting CMS... && pnpm dev"

echo Waiting for CMS startup (20 seconds)...
timeout /t 20 /nobreak >nul

:: Health check
echo.
echo Checking CMS health...
curl -s http://localhost:3001/api/health > temp_health.json 2>nul
if %errorlevel% equ 0 (
    echo [OK] CMS health check passed
    type temp_health.json
    del temp_health.json 2>nul
) else (
    echo [!] CMS health check failed, continuing anyway...
    if exist temp_health.json del temp_health.json 2>nul
)

:: Warmup (optional)
set /p WARMUP="Run warmup? (y/n): "
if /i "%WARMUP%"=="y" (
    echo.
    echo Warming up CMS...
    echo   - Hero...
    curl -s http://localhost:3001/api/globals/hero >nul
    echo   - Footer...
    curl -s http://localhost:3001/api/globals/footer >nul
    echo   - ContactForm...
    curl -s http://localhost:3001/api/globals/contactForm >nul
    echo   - Services...
    curl -s http://localhost:3001/api/services?limit=100 >nul
    echo   - Reviews...
    curl -s http://localhost:3001/api/reviews?limit=20 >nul
    echo [OK] Warmup complete
)

:: 5. Launch Web
echo.
echo Launching Web...
start "Web - Port 3002" cmd /k "cd /d "%PROJECT_ROOT%\apps\web" && echo Starting Web... && pnpm dev"

echo Waiting for Web startup (10 seconds)...
timeout /t 10 /nobreak >nul

:: Final status
echo.
echo ===========================================
echo    System launched successfully!
echo ===========================================
echo.
echo    CMS:  http://localhost:3001
echo    Web:  http://localhost:3002
echo    Admin: http://localhost:3001/admin
echo.
echo ===========================================
echo    To stop: Close CMS and Web windows
echo ===========================================
echo.

:: Test final endpoints
echo Testing endpoints...
echo   - CMS: 
curl -s -o nul -w "%%{http_code}" http://localhost:3001/api/health
echo   - Web: 
curl -s -o nul -w "%%{http_code}" http://localhost:3002

echo.
pause