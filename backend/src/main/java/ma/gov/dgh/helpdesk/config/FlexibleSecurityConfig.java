package ma.gov.dgh.helpdesk.config;

import ma.gov.dgh.helpdesk.security.CustomLdapAuthenticationProvider;
import ma.gov.dgh.helpdesk.security.DevAuthenticationProvider;
import ma.gov.dgh.helpdesk.security.JwtAuthenticationFilter;
import ma.gov.dgh.helpdesk.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Flexible Security Configuration that automatically adapts based on LDAP settings
 * 
 * This configuration:
 * - Automatically detects if LDAP is enabled
 * - Uses LDAP authentication when spring.ldap.enabled=true
 * - Falls back to local authentication when LDAP is disabled
 * - Provides consistent security policies regardless of authentication method
 */
@Configuration
@EnableWebSecurity
public class FlexibleSecurityConfig {

    @Value("${spring.ldap.enabled:false}")
    private boolean ldapEnabled;

    @Autowired(required = false)
    private CustomLdapAuthenticationProvider customLdapAuthenticationProvider;

    @Autowired(required = false)
    private DevAuthenticationProvider devAuthenticationProvider;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Password encoder for local authentication
     */
    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Default UserDetailsService for when no specific profile is active
     * This provides basic authentication for development/testing
     */
    @Bean
    @Profile("default")
    public UserDetailsService defaultUserDetailsService() {
        UserDetails admin = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("admin123"))
            .roles("ADMIN")
            .build();

        UserDetails user = User.builder()
            .username("user")
            .password(passwordEncoder().encode("user123"))
            .roles("EMPLOYEE")
            .build();

        UserDetails helpdeskAdmin = User.builder()
            .username("helpdesk-admin")
            .password(passwordEncoder().encode("helpdesk123"))
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(admin, user, helpdeskAdmin);
    }

    /**
     * JWT Authentication Filter
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        // Use the default UserDetailsService to avoid circular dependency
        return new JwtAuthenticationFilter(jwtTokenProvider, defaultUserDetailsService());
    }

    /**
     * CORS Configuration
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Security Filter Chain
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/health/**").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/logout").permitAll()
                .requestMatchers("/api/auth/check").permitAll()
                .requestMatchers("/api/auth/me").permitAll()
                .requestMatchers("/api/auth/verify").permitAll()
                .requestMatchers("/api/test/**").permitAll()
                .requestMatchers("/api/dashboard/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/users/profile").permitAll()
                .requestMatchers("/api/tickets/samples/create").permitAll()
                .requestMatchers("/api/tickets/**").permitAll()
                .requestMatchers("/api/equipment/**").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.IF_REQUIRED)
            )
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

    /**
     * Authentication Manager that automatically configures based on LDAP settings
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        
        if (ldapEnabled && customLdapAuthenticationProvider != null) {
            // Use LDAP authentication
            auth.authenticationProvider(customLdapAuthenticationProvider);
            System.out.println("🔐 LDAP Authentication ENABLED - Using LDAP provider");
        } else {
            // Use local authentication with default UserDetailsService
            auth.userDetailsService(defaultUserDetailsService()).passwordEncoder(passwordEncoder());
            if (devAuthenticationProvider != null) {
                auth.authenticationProvider(devAuthenticationProvider);
            }
            System.out.println("🔑 Local Authentication ENABLED - Using local provider");
        }
        
        return auth.build();
    }

    /**
     * LDAP Status Information Bean
     */
    @Bean
    public LdapStatusInfo ldapStatusInfo() {
        return new LdapStatusInfo(ldapEnabled);
    }

    /**
     * Simple class to provide LDAP status information
     */
    public static class LdapStatusInfo {
        private final boolean ldapEnabled;
        private final String authenticationMethod;

        public LdapStatusInfo(boolean ldapEnabled) {
            this.ldapEnabled = ldapEnabled;
            this.authenticationMethod = ldapEnabled ? "LDAP" : "Local Database";
        }

        public boolean isLdapEnabled() {
            return ldapEnabled;
        }

        public String getAuthenticationMethod() {
            return authenticationMethod;
        }

        @Override
        public String toString() {
            return String.format("LDAP Status: %s (Method: %s)", 
                ldapEnabled ? "ENABLED" : "DISABLED", 
                authenticationMethod);
        }
    }
} 