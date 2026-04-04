# ============================================
# Apply Database Migration for ContactForm leftBlock.features
# ============================================

$ErrorActionPreference = "Stop"

Write-Host "=== Contact Form Database Migration ===" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
    Write-Host "❌ psql not found in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL client or add psql to PATH"
    Write-Host "Alternative: Run the SQL manually in pgAdmin or DBeaver"
    exit 1
}

# Database connection parameters
$env:PGDATABASE = "service_center"
$env:PGHOST = "localhost"
$env:PGPORT = "5432"
$env:PGUSER = "postgres"

# Check if .env file exists and load it
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]*)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    
    # Parse DATABASE_URI if present
    if ($env:DATABASE_URI) {
        $uri = $env:DATABASE_URI
        # postgresql://user:pass@host:port/dbname
        if ($uri -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.*)') {
            $env:PGUSER = $matches[1]
            $env:PGPASSWORD = $matches[2]
            $env:PGHOST = $matches[3]
            $env:PGPORT = $matches[4]
            $env:PGDATABASE = $matches[5]
        }
    }
}

Write-Host "Connecting to database: $env:PGDATABASE@$env:PGHOST`:$env:PGPORT" -ForegroundColor Yellow
Write-Host ""

# Check current tables
Write-Host "Current contact_form tables:" -ForegroundColor Cyan
psql -c "\dt contact_form*"
Write-Host ""

# Apply migration
Write-Host "Applying migration..." -ForegroundColor Cyan
psql -f MIGRATION_FIX.sql
Write-Host ""

# Verify
Write-Host "Verifying..." -ForegroundColor Cyan
psql -c "\dt contact_form*"
psql -c "\d contact_form_left_block_features"
Write-Host ""

Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart CMS: cd apps/cms && pnpm dev"
Write-Host "2. Check API: curl http://localhost:3001/api/globals/contactForm"
Write-Host "3. Open admin: http://localhost:3001/admin/globals/contactForm"
