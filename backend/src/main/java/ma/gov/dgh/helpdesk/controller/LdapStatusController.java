package ma.gov.dgh.helpdesk.controller;

import ma.gov.dgh.helpdesk.config.FlexibleSecurityConfig.LdapStatusInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller to provide LDAP configuration status and information
 * 
 * This endpoint helps administrators and developers understand:
 * - Whether LDAP is currently enabled
 * - What authentication method is being used
 * - Current LDAP configuration settings
 */
@RestController
@RequestMapping("/api/ldap")
public class LdapStatusController {

    @Autowired
    private LdapStatusInfo ldapStatusInfo;

    @Value("${spring.ldap.enabled:false}")
    private boolean ldapEnabled;

    @Value("${spring.ldap.urls:}")
    private String ldapUrl;

    @Value("${spring.ldap.base:}")
    private String ldapBase;

    @Value("${spring.ldap.auth.domain:}")
    private String ldapDomain;

    /**
     * Get current LDAP status and configuration
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getLdapStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("ldapEnabled", ldapEnabled);
        status.put("authenticationMethod", ldapStatusInfo.getAuthenticationMethod());
        status.put("status", ldapStatusInfo.toString());
        
        if (ldapEnabled) {
            status.put("ldapUrl", ldapUrl);
            status.put("ldapBase", ldapBase);
            status.put("ldapDomain", ldapDomain);
            status.put("message", "LDAP authentication is active");
        } else {
            status.put("message", "Local database authentication is active");
        }
        
        return ResponseEntity.ok(status);
    }

    /**
     * Get LDAP configuration details
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getLdapConfig() {
        Map<String, Object> config = new HashMap<>();
        
        config.put("enabled", ldapEnabled);
        config.put("url", ldapUrl);
        config.put("base", ldapBase);
        config.put("domain", ldapDomain);
        
        return ResponseEntity.ok(config);
    }

    /**
     * Health check for LDAP connectivity (only when enabled)
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getLdapHealth() {
        Map<String, Object> health = new HashMap<>();
        
        if (!ldapEnabled) {
            health.put("status", "DISABLED");
            health.put("message", "LDAP is not enabled in current configuration");
            return ResponseEntity.ok(health);
        }
        
        // TODO: Implement actual LDAP connectivity test
        // This would test the connection to the LDAP server
        health.put("status", "ENABLED");
        health.put("message", "LDAP configuration is active");
        health.put("note", "Connectivity test not implemented yet");
        
        return ResponseEntity.ok(health);
    }
} 