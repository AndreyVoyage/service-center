@echo off
chcp 65001 >nul
echo.
echo ===========================================
echo    ColdService - Launch with Wait
echo    CMS compilation: ~40 seconds
echo ===========================================
echo.

set "NODE_OPTIONS=--max-old-space-size=8192"
set "NEXT_TELEMETRY_DISABLED=1"

:: 1. Start CMS
echo [1/3] Starting CMS...
start "CMS" cmd /k "cd /d "%~dp0apps\cms" && set NODE_OPTIONS=--max-old-space-size=8192 && pnpm dev"

:: 2. Wait for compilation (CRITICAL - don't skip!)
echo.
echo [2/3] Waiting for CMS compilation...
echo This takes 30-45 seconds...
echo.

set /a count=45
:wait_loop
if %count% leq 0 goto done_wait
echo | set /p="%count% "
timeout /t 1 /nobreak >nul
set /a count-=1
goto wait_loop

:done_wait
echo.
echo [OK] CMS should be ready

:: 3. Check health
echo.
echo [3/3] Checking CMS health...
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] CMS is responding
) else (
    echo [!] CMS not responding yet, continuing anyway...
)

:: 4. Start Web
echo.
echo Starting Web...
start "Web" cmd /k "cd /d "%~dp0apps\web" && set NODE_OPTIONS=--max-old-space-size=8192 && pnpm dev"

echo.
echo ===========================================
echo    Launched!
echo    Wait ~10 seconds for Web to start
echo ===========================================
echo.
echo CMS: http://localhost:3001
echo Web: http://localhost:3002
echo.
pause
