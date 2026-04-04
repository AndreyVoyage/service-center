@echo off
echo === Unblocking Drizzle Migration ===
echo.

echo [1/3] Creating source_page_id column...
psql service_center -c "ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create column
    echo Try running manually: psql service_center
    echo Then: ALTER TABLE form_submissions ADD COLUMN source_page_id VARCHAR(255);
    pause
    exit /b 1
)

echo.
echo [2/3] Verifying column exists...
psql service_center -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'form_submissions' AND column_name = 'source_page_id';"

echo.
echo [3/3] Done! Now restart CMS:
echo   1. Stop current process (Ctrl+C)
echo   2. Run: pnpm dev
echo.
pause
