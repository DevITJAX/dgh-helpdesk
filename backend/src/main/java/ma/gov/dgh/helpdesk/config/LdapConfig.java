package ma.gov.dgh.helpdesk.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator;
import org.springframework.security.ldap.userdetails.LdapUserDetailsService;

/**
 * Flexible LDAP Configuration that can be easily enabled/disabled
 * 
 * Usage:
 * - Set spring.ldap.enabled=true to enable LDAP
 * - Set spring.ldap.enabled=false to disable LDAP
 * - Use environment variables or command line arguments to override
 * 
 * Examples:
 * - java -jar app.jar --spring.ldap.enabled=true
 * - SPRING_LDAP_ENABLED=true java -jar app.jar
 * - docker run -e SPRING_LDAP_ENABLED=true your-app
 */
@Configuration
@ConditionalOnProperty(name = "spring.ldap.enabled", havingValue = "true")
public class LdapConfig {

    @Value("${spring.ldap.urls}")
    private String ldapUrl;

    @Value("${spring.ldap.base}")
    private String ldapBase;

    @Value("${spring.ldap.username}")
    private String ldapUsername;

    @Value("${spring.ldap.password}")
    private String ldapPassword;

    @Value("${spring.ldap.auth.principal-suffix:@dgh.local}")
    private String principalSuffix;

    @Value("${spring.ldap.auth.domain:dgh.local}")
    private String domain;

    /**
     * LDAP Context Source for connection management
     */
    @Bean
    public LdapContextSource contextSource() {
        LdapContextSource contextSource = new LdapContextSource();
        contextSource.setUrl(ldapUrl);
        contextSource.setBase(ldapBase);
        contextSource.setUserDn(ldapUsername);
        contextSource.setPassword(ldapPassword);
        
        // Basic connection settings
        contextSource.setPooled(true);
        
        return contextSource;
    }

    /**
     * LDAP Template for LDAP operations
     */
    @Bean
    public LdapTemplate ldapTemplate() {
        return new LdapTemplate(contextSource());
    }

    /**
     * LDAP User Search for finding users
     */
    @Bean
    public FilterBasedLdapUserSearch userSearch() {
        // Search for users with uid attribute
        String userSearchFilter = "(uid={0})";
        String userSearchBase = ldapBase;
        return new FilterBasedLdapUserSearch(userSearchBase, userSearchFilter, contextSource());
    }

    /**
     * LDAP Authorities Populator for role mapping
     */
    @Bean
    public DefaultLdapAuthoritiesPopulator authoritiesPopulator() {
        DefaultLdapAuthoritiesPopulator authoritiesPopulator = new DefaultLdapAuthoritiesPopulator(
            contextSource(), 
            "ou=groups," + ldapBase
        );
        
        // Group search filter
        authoritiesPopulator.setGroupSearchFilter("(member={0})");
        authoritiesPopulator.setGroupRoleAttribute("ou");
        authoritiesPopulator.setRolePrefix("ROLE_");
        authoritiesPopulator.setConvertToUpperCase(true);
        
        return authoritiesPopulator;
    }

    /**
     * LDAP Bind Authenticator for authentication
     */
    @Bean
    public BindAuthenticator bindAuthenticator() {
        BindAuthenticator authenticator = new BindAuthenticator(contextSource());
        authenticator.setUserSearch(userSearch());
        return authenticator;
    }

    /**
     * LDAP Authentication Provider
     */
    @Bean
    public LdapAuthenticationProvider ldapAuthenticationProvider() {
        LdapAuthenticationProvider provider = new LdapAuthenticationProvider(
            bindAuthenticator(), 
            authoritiesPopulator()
        );
        
        // Set authentication strategy
        provider.setHideUserNotFoundExceptions(false);
        
        return provider;
    }

    /**
     * LDAP User Details Service
     */
    @Bean
    public LdapUserDetailsService ldapUserDetailsService() {
        return new LdapUserDetailsService(userSearch(), authoritiesPopulator());
    }
} 