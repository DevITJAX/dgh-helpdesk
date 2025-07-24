package ma.gov.dgh.helpdesk.security;

import ma.gov.dgh.helpdesk.entity.User;
import ma.gov.dgh.helpdesk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Optional;

/**
 * Custom LDAP authentication provider that integrates with the User entity
 */
@Component
@Profile("prod") // Only active in production profile
public class CustomLdapAuthenticationProvider implements AuthenticationProvider {
    
    private final UserService userService;
    
    @Autowired
    public CustomLdapAuthenticationProvider(UserService userService) {
        this.userService = userService;
    }
    
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        
        try {
            // Authenticate against LDAP
            if (authenticateWithLdap(username, password)) {
                // Get or create user in database
                User user = getOrCreateUser(username);
                
                if (!user.getIsActive()) {
                    throw new BadCredentialsException("User account is deactivated");
                }
                
                // Update last login
                userService.updateLastLogin(username);
                
                // Create authorities based on user role
                List<GrantedAuthority> authorities = createAuthorities(user);
                
                // Create UserDetails
                UserDetails userDetails = new CustomUserDetails(user, authorities);
                
                return new UsernamePasswordAuthenticationToken(userDetails, password, authorities);
            } else {
                throw new BadCredentialsException("Invalid credentials");
            }
        } catch (Exception e) {
            throw new BadCredentialsException("Authentication failed: " + e.getMessage());
        }
    }
    
    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
    
    /**
     * Authenticate user against LDAP server
     */
    private boolean authenticateWithLdap(String username, String password) {
        try {
            // LDAP connection properties
            Hashtable<String, String> env = new Hashtable<>();
            env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
            env.put(Context.PROVIDER_URL, "ldap://192.168.1.100:389"); // Use your AD server IP
            env.put(Context.SECURITY_AUTHENTICATION, "simple");
            env.put(Context.SECURITY_PRINCIPAL, username + "@dgh.local"); // Use UPN for AD authentication
            env.put(Context.SECURITY_CREDENTIALS, password);
            // Attempt to create context (authenticate)
            DirContext ctx = new InitialDirContext(env);
            ctx.close();
            return true;
        } catch (NamingException e) {
            return false;
        }
    }
    
    /**
     * Get existing user or create new one from LDAP
     */
    private User getOrCreateUser(String ldapUsername) {
        Optional<User> existingUser = userService.findByLdapUsername(ldapUsername);
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            // Create new user with basic information
            // In a real implementation, you would fetch additional details from LDAP
            String email = ldapUsername + "@dgh.gov.ma"; // Default email format
            String fullName = ldapUsername; // Would be fetched from LDAP
            String department = "Unknown"; // Would be fetched from LDAP
            
            return userService.synchronizeFromLdap(ldapUsername, email, fullName, department);
        }
    }
    
    /**
     * Create authorities based on user role
     */
    private List<GrantedAuthority> createAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        switch (user.getRole()) {
            case ADMIN:
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_TECHNICIAN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            case TECHNICIAN:
                authorities.add(new SimpleGrantedAuthority("ROLE_TECHNICIAN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            case USER:
            default:
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
        }
        
        return authorities;
    }
}
