@echo off
title Renting App - Stop All Services
echo ========================================================
echo        STOPPING RENTING APP SERVICES
echo ========================================================
echo.

echo Stopping processes on Port 4000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo Stopping processes on Port 8081 (Mobile App)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo Stopping processes on Port 3000 (Admin Dashboard)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo.
echo All Renting App services have been stopped.
pause
