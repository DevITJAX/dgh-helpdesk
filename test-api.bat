@echo off
echo Testing DGH HelpDesk Login API...
echo.

echo Testing with admin credentials...
curl -X POST "http://localhost:8080/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

echo.
echo.
echo Testing with user credentials...
curl -X POST "http://localhost:8080/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"user\",\"password\":\"user123\"}"

echo.
echo.
pause 