@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════
echo    ColdService Connection Verifier
echo ═══════════════════════════════════════
echo.

echo [1/3] Checking .env files...
echo.

findstr /C:"service_center" apps\cms\.env.local >nul
if %errorlevel% equ 0 (
    echo [OK] CMS: DATABASE_URI = service_center
) else (
    findstr /C:"payload" apps\cms\.env.local >nul
    if %errorlevel% equ 0 (
        echo [X] CMS: DATABASE_URI = payload (NEEDS FIX!)
    ) else (
        echo [!] CMS: DATABASE_URI unknown
    )
)

findstr /C:"localhost:3001" apps\web\.env.local >nul
if %errorlevel% equ 0 (
    echo [OK] Web: NEXT_PUBLIC_CMS_URL configured
) else (
    echo [X] Web: NEXT_PUBLIC_CMS_URL not found
)

echo.
echo [2/3] Checking API endpoints...
echo.

curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] CMS API: Running on localhost:3001
    
    echo.
    echo CMS Health Details:
    curl -s http://localhost:3001/api/health | findstr "status"
) else (
    echo [X] CMS API: Not responding
    echo     Make sure: pnpm dev:cms is running
)

echo.
curl -s http://localhost:3002 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Web: Running on localhost:3002
) else (
    echo [X] Web: Not responding
    echo     Make sure: pnpm dev:web is running
)

echo.
echo ═══════════════════════════════════════
echo.

if %errorlevel% equ 0 (
    echo All checks passed! System is ready.
) else (
    echo Some checks failed. Please:
    echo   1. Start CMS:  pnpm dev:cms
    echo   2. Start Web:  pnpm dev:web
    echo   3. Check .env files
)

echo.
pause
