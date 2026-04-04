@echo off
echo ============================================
echo Database Fix for Drizzle Migration
echo ============================================
echo.

set PGPASSWORD=
set PGUSER=postgres
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=service_center

echo [1/2] Adding source_page_id column...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);"
if %errorlevel% neq 0 (
    echo Failed to add column. Trying with password prompt...
    psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -W -c "ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);"
)

echo.
echo [2/2] Creating left_block_features table...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "CREATE TABLE IF NOT EXISTS contact_form_left_block_features (id SERIAL PRIMARY KEY, _order INTEGER NOT NULL DEFAULT 0, _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE, icon VARCHAR(50) DEFAULT 'check', text VARCHAR(500) NOT NULL);"
if %errorlevel% neq 0 (
    echo Failed to create table. Trying with password prompt...
    psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -W -c "CREATE TABLE IF NOT EXISTS contact_form_left_block_features (id SERIAL PRIMARY KEY, _order INTEGER NOT NULL DEFAULT 0, _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE, icon VARCHAR(50) DEFAULT 'check', text VARCHAR(500) NOT NULL);"
)

echo.
echo ============================================
echo Done! Now restart CMS with: pnpm dev
echo ============================================
pause
