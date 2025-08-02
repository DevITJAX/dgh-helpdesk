package ma.gov.dgh.helpdesk.controller;

import ma.gov.dgh.helpdesk.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import ma.gov.dgh.helpdesk.entity.User;
import ma.gov.dgh.helpdesk.entity.UserRole;
import ma.gov.dgh.helpdesk.security.JwtTokenProvider;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;

/**
 * REST Controller for Authentication operations
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    
    @Autowired
    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    
    /**
     * Authenticate user with LDAP credentials
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            System.out.println("Login attempt for user: " + loginRequest.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.getSession(true); // Ensure session is created

            // Generate a simple session token for now
            String token = "session-token-" + System.currentTimeMillis() + "-" + authentication.getName();

            Object principal = authentication.getPrincipal();
            
            // Handle both CustomUserDetails and Spring Security User
            String username, fullName, email, department, role;
            Long userId;
            
            if (principal instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) principal;
                userId = userDetails.getUserId();
                username = userDetails.getUsername();
                fullName = userDetails.getFullName();
                email = userDetails.getEmail();
                department = userDetails.getDepartment();
                role = userDetails.getRole();
            } else if (principal instanceof org.springframework.security.core.userdetails.User) {
                org.springframework.security.core.userdetails.User springUser = (org.springframework.security.core.userdetails.User) principal;
                userId = -1L; // Dummy ID for in-memory users
                username = springUser.getUsername();
                fullName = username.equals("admin") ? "Admin User" : 
                          username.equals("user") ? "Regular User" : 
                          username.equals("helpdesk-admin") ? "Helpdesk Admin" : "User";
                email = username + "@localhost";
                department = "IT";
                role = springUser.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")) ? "ADMIN" : "USER";
            } else {
                throw new RuntimeException("Unknown principal type: " + principal.getClass());
            }

            LoginResponse response = new LoginResponse(
                userId,
                username,
                fullName,
                email,
                department,
                role,
                token,
                "Login successful"
            );
            System.out.println("Login successful for user: " + username);
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.out.println("Invalid credentials for user: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(null, null, null, null, null, null, null, "Invalid credentials"));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Authentication failed for user: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(null, null, null, null, null, null, null, "Authentication failed"));
        }
    }
    
    /**
     * Logout user
     */
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new LogoutResponse("Logout successful"));
    }
    
    /**
     * Get current user information
     */
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
            "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object principal = authentication.getPrincipal();
        
        // Handle both CustomUserDetails and Spring Security User
        Long userId;
        String username, fullName, email, department, role;
        
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            userId = userDetails.getUserId();
            username = userDetails.getUsername();
            fullName = userDetails.getFullName();
            email = userDetails.getEmail();
            department = userDetails.getDepartment();
            role = userDetails.getRole();
        } else if (principal instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User springUser = (org.springframework.security.core.userdetails.User) principal;
            userId = -1L; // Dummy ID for in-memory users
            username = springUser.getUsername();
            fullName = username.equals("admin") ? "Admin User" : 
                      username.equals("user") ? "Regular User" : 
                      username.equals("helpdesk-admin") ? "Helpdesk Admin" : "User";
            email = username + "@localhost";
            department = "IT";
            role = springUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")) ? "ADMIN" : "USER";
        } else {
            System.out.println("Unknown principal type: " + principal.getClass().getName());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserInfoResponse response = new UserInfoResponse(
            userId, username, fullName, email, department, role
        );

        return ResponseEntity.ok(response);
    }
    
    /**
     * Verify token and return user information
     */
    @GetMapping("/verify")
    public ResponseEntity<UserInfoResponse> verifyToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
            "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object principal = authentication.getPrincipal();
        
        // Handle both CustomUserDetails and Spring Security User
        Long userId;
        String username, fullName, email, department, role;
        
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            userId = userDetails.getUserId();
            username = userDetails.getUsername();
            fullName = userDetails.getFullName();
            email = userDetails.getEmail();
            department = userDetails.getDepartment();
            role = userDetails.getRole();
        } else if (principal instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User springUser = (org.springframework.security.core.userdetails.User) principal;
            userId = -1L; // Dummy ID for in-memory users
            username = springUser.getUsername();
            fullName = username.equals("admin") ? "Admin User" : 
                      username.equals("user") ? "Regular User" : 
                      username.equals("helpdesk-admin") ? "Helpdesk Admin" : "User";
            email = username + "@localhost";
            department = "IT";
            role = springUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")) ? "ADMIN" : "USER";
        } else {
            System.out.println("Unknown principal type: " + principal.getClass().getName());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserInfoResponse response = new UserInfoResponse(
            userId, username, fullName, email, department, role
        );

        return ResponseEntity.ok(response);
    }
    
    /**
     * Check if user is authenticated
     */
    @GetMapping("/check")
    public ResponseEntity<AuthCheckResponse> checkAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated() 
            && !"anonymousUser".equals(authentication.getPrincipal());
        
        return ResponseEntity.ok(new AuthCheckResponse(isAuthenticated));
    }
    
    // Inner classes for request/response DTOs
    
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    public static class LoginResponse {
        private Long userId;
        private String username;
        private String fullName;
        private String email;
        private String department;
        private String role;
        private String token;
        private String message;
        
        public LoginResponse(Long userId, String username, String fullName, String email, 
                           String department, String role, String token, String message) {
            this.userId = userId;
            this.username = username;
            this.fullName = fullName;
            this.email = email;
            this.department = department;
            this.role = role;
            this.token = token;
            this.message = message;
        }
        
        // Getters
        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getDepartment() { return department; }
        public String getRole() { return role; }
        public String getToken() { return token; }
        public String getMessage() { return message; }
    }
    
    public static class LogoutResponse {
        private String message;
        
        public LogoutResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
    }
    
    public static class UserInfoResponse {
        private Long userId;
        private String username;
        private String fullName;
        private String email;
        private String department;
        private String role;
        
        public UserInfoResponse(Long userId, String username, String fullName, String email, 
                              String department, String role) {
            this.userId = userId;
            this.username = username;
            this.fullName = fullName;
            this.email = email;
            this.department = department;
            this.role = role;
        }
        
        // Getters
        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getDepartment() { return department; }
        public String getRole() { return role; }
    }
    
    public static class AuthCheckResponse {
        private boolean authenticated;
        
        public AuthCheckResponse(boolean authenticated) {
            this.authenticated = authenticated;
        }
        
        public boolean isAuthenticated() {
            return authenticated;
        }
    }
}