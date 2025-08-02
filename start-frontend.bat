@echo off
echo Starting DGH HelpDesk Frontend...
echo.

cd frontend

echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo Installing dependencies if needed...
npm install

echo Starting development server...
echo Frontend will be available at: http://localhost:3000
echo.
npm start

pause 