Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       STARTING RENTING APP FULL-STACK MVP" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "`n1. Starting Backend REST API Server (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run start:dev"

Start-Sleep -Seconds 3

Write-Host "2. Starting Customer & Provider Mobile App (Port 8081)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\mobile'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "3. Starting Admin Dashboard (Port 3000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\admin'; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " All services are launching in separate windows!" -ForegroundColor Green
Write-Host " Customer & Provider App:  http://localhost:8081" -ForegroundColor White
Write-Host " Admin Operations Portal:  http://localhost:3000" -ForegroundColor White
Write-Host " Backend Swagger API Docs: http://localhost:4000/api/docs" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Cyan

Start-Sleep -Seconds 4
Start-Process "http://localhost:8081"
Start-Process "http://localhost:3000"
