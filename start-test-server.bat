@echo off
echo Starting Test Server for API Testing...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo Starting test server...
echo Test page will be available at: http://localhost:3001
echo.
node test-server.js

pause 