@echo off
echo ========================================
echo DGH HelpDesk - LDAP Profile Switcher
echo ========================================
echo.

if "%1"=="enable" goto enable_ldap
if "%1"=="disable" goto disable_ldap
if "%1"=="status" goto show_status

echo Usage: switch-ldap.bat [enable^|disable^|status]
echo.
echo Commands:
echo   enable  - Enable LDAP authentication
echo   disable - Disable LDAP (use local auth)
echo   status  - Show current LDAP status
echo.
echo Examples:
echo   switch-ldap.bat enable
echo   switch-ldap.bat disable
echo   switch-ldap.bat status
echo.
goto end

:enable_ldap
echo [INFO] Enabling LDAP authentication...
echo [INFO] Setting profile to 'ldap'...
set SPRING_PROFILES_ACTIVE=ldap
echo [INFO] LDAP is now ENABLED
echo [INFO] Restart your application to apply changes
echo [INFO] Use: mvn spring-boot:run -Dspring.profiles.active=ldap
echo.
goto end

:disable_ldap
echo [INFO] Disabling LDAP authentication...
echo [INFO] Setting profile to 'local'...
set SPRING_PROFILES_ACTIVE=local
echo [INFO] LDAP is now DISABLED
echo [INFO] Restart your application to apply changes
echo [INFO] Use: mvn spring-boot:run -Dspring.profiles.active=local
echo.
goto end

:show_status
echo [INFO] Current LDAP Status:
echo.
if "%SPRING_PROFILES_ACTIVE%"=="ldap" (
    echo [STATUS] LDAP: ENABLED (Profile: ldap)
    echo [INFO] Authentication: LDAP Server
) else if "%SPRING_PROFILES_ACTIVE%"=="local" (
    echo [STATUS] LDAP: DISABLED (Profile: local)
    echo [INFO] Authentication: Local Database
) else (
    echo [STATUS] LDAP: UNKNOWN (No profile set)
    echo [INFO] Check application.properties for spring.ldap.enabled
)
echo.
goto end

:end
echo ========================================
pause 