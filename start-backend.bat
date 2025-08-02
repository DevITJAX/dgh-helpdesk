@echo off
echo Starting DGH HelpDesk Backend...
echo.

cd backend

echo Checking if Maven is installed...
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven and try again
    pause
    exit /b 1
)

echo Building and starting the application...
echo.
mvn spring-boot:run

pause 