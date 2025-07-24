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

            Object principal = authentication.getPrincipal();
            CustomUserDetails userDetails;
            if (principal instanceof CustomUserDetails) {
                userDetails = (CustomUserDetails) principal;
            } else if (principal instanceof org.springframework.security.core.userdetails.User) {
                org.springframework.security.core.userdetails.User springUser = (org.springframework.security.core.userdetails.User) principal;
                // Create a dummy User entity for in-memory users
                User dummyUser = new User();
                dummyUser.setId(-1L); // Dummy ID for in-memory users
                dummyUser.setLdapUsername(springUser.getUsername());
                dummyUser.setFullName("Admin User");
                dummyUser.setEmail("admin@localhost");
                dummyUser.setDepartment("IT");
                dummyUser.setRole(UserRole.ADMIN);
                userDetails = new CustomUserDetails(dummyUser, new java.util.ArrayList<>(springUser.getAuthorities()));
            } else {
                throw new RuntimeException("Unknown principal type: " + principal.getClass());
            }

            LoginResponse response = new LoginResponse(
                userDetails.getUser().getId(),
                userDetails.getUsername(),
                userDetails.getUser().getFullName(),
                userDetails.getUser().getEmail(),
                userDetails.getUser().getDepartment(),
                userDetails.getUser().getRole().name(),
                "Login successful"
            );
            System.out.println("Login successful for user: " + userDetails.getUsername());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.out.println("Invalid credentials for user: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(null, null, null, null, null, null, "Invalid credentials"));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Authentication failed for user: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(null, null, null, null, null, null, "Authentication failed"));
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
        if (!(principal instanceof CustomUserDetails)) {
            // Log the actual principal type for debugging
            System.out.println("Principal is not CustomUserDetails: " + principal.getClass().getName());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) principal;

        UserInfoResponse response = new UserInfoResponse(
            userDetails.getUserId(),
            userDetails.getUsername(),
            userDetails.getFullName(),
            userDetails.getEmail(),
            userDetails.getDepartment(),
            userDetails.getRole()
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
        private String message;
        
        public LoginResponse(Long userId, String username, String fullName, String email, 
                           String department, String role, String message) {
            this.userId = userId;
            this.username = username;
            this.fullName = fullName;
            this.email = email;
            this.department = department;
            this.role = role;
            this.message = message;
        }
        
        // Getters
        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getDepartment() { return department; }
        public String getRole() { return role; }
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
