@echo off
title Renting App - 1-Click Launcher
echo ========================================================
echo        STARTING RENTING APP FULL-STACK MVP
echo ========================================================
echo.
echo 1. Starting Backend REST API Server (Port 4000)...
start "Renting App - Backend (Port 4000)" /D "%~dp0backend" cmd /k "npm run start:dev"

timeout /t 5 /nobreak >nul

echo 2. Starting Customer & Provider Mobile App (Port 8081)...
start "Renting App - Customer App (Port 8081)" /D "%~dp0mobile" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo 3. Starting Admin Dashboard (Port 3000)...
start "Renting App - Admin Dashboard (Port 3000)" /D "%~dp0admin" cmd /k "npm run dev"

echo.
echo ========================================================
echo  All 3 services are launching in separate windows!
echo.
echo  Customer & Provider App:  http://localhost:8081
echo  Admin Operations Portal:  http://localhost:3000
echo  Backend Swagger API Docs: http://localhost:4000/api/docs
echo ========================================================
echo.
echo Opening apps in your default browser...
timeout /t 5 /nobreak >nul
start http://localhost:8081
start http://localhost:3000
