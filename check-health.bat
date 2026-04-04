@echo off
echo Checking ColdService health...

echo.
echo CMS Health:
curl -s http://localhost:3001/api/health | findstr "status"

echo.
echo CMS Hero:
curl -s -o nul -w "Response time: %{time_total}s\n" http://localhost:3001/api/globals/hero

echo.
echo Web:
curl -s -o nul -w "Response time: %{time_total}s, Status: %{http_code}\n" http://localhost:3002

echo.
pause