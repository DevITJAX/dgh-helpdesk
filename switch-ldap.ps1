#!/usr/bin/env pwsh
# DGH HelpDesk - LDAP Profile Switcher (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DGH HelpDesk - LDAP Profile Switcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

param(
    [Parameter(Position=0)]
    [ValidateSet("enable", "disable", "status")]
    [string]$Action = "status"
)

function Enable-LDAP {
    Write-Host "[INFO] Enabling LDAP authentication..." -ForegroundColor Green
    Write-Host "[INFO] Setting profile to 'ldap'..." -ForegroundColor Green
    
    $env:SPRING_PROFILES_ACTIVE = "ldap"
    
    Write-Host "[INFO] LDAP is now ENABLED" -ForegroundColor Green
    Write-Host "[INFO] Restart your application to apply changes" -ForegroundColor Yellow
    Write-Host "[INFO] Use: mvn spring-boot:run -Dspring.profiles.active=ldap" -ForegroundColor Yellow
    Write-Host ""
}

function Disable-LDAP {
    Write-Host "[INFO] Disabling LDAP authentication..." -ForegroundColor Green
    Write-Host "[INFO] Setting profile to 'local'..." -ForegroundColor Green
    
    $env:SPRING_PROFILES_ACTIVE = "local"
    
    Write-Host "[INFO] LDAP is now DISABLED" -ForegroundColor Green
    Write-Host "[INFO] Restart your application to apply changes" -ForegroundColor Yellow
    Write-Host "[INFO] Use: mvn spring-boot:run -Dspring.profiles.active=local" -ForegroundColor Yellow
    Write-Host ""
}

function Show-LDAPStatus {
    Write-Host "[INFO] Current LDAP Status:" -ForegroundColor Green
    Write-Host ""
    
    $currentProfile = $env:SPRING_PROFILES_ACTIVE
    
    if ($currentProfile -eq "ldap") {
        Write-Host "[STATUS] LDAP: ENABLED (Profile: ldap)" -ForegroundColor Green
        Write-Host "[INFO] Authentication: LDAP Server" -ForegroundColor Cyan
    } elseif ($currentProfile -eq "local") {
        Write-Host "[STATUS] LDAP: DISABLED (Profile: local)" -ForegroundColor Yellow
        Write-Host "[INFO] Authentication: Local Database" -ForegroundColor Cyan
    } else {
        Write-Host "[STATUS] LDAP: UNKNOWN (No profile set)" -ForegroundColor Red
        Write-Host "[INFO] Check application.properties for spring.ldap.enabled" -ForegroundColor Cyan
    }
    Write-Host ""
}

function Show-Usage {
    Write-Host "Usage: .\switch-ldap.ps1 [enable|disable|status]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  enable  - Enable LDAP authentication" -ForegroundColor Cyan
    Write-Host "  disable - Disable LDAP (use local auth)" -ForegroundColor Cyan
    Write-Host "  status  - Show current LDAP status" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\switch-ldap.ps1 enable" -ForegroundColor Yellow
    Write-Host "  .\switch-ldap.ps1 disable" -ForegroundColor Yellow
    Write-Host "  .\switch-ldap.ps1 status" -ForegroundColor Yellow
    Write-Host ""
}

# Main execution
switch ($Action) {
    "enable" { Enable-LDAP }
    "disable" { Disable-LDAP }
    "status" { Show-LDAPStatus }
    default { Show-Usage }
}

Write-Host "========================================" -ForegroundColor Cyan 