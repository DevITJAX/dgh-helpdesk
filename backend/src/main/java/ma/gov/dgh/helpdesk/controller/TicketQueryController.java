package ma.gov.dgh.helpdesk.controller;

import ma.gov.dgh.helpdesk.entity.*;
import ma.gov.dgh.helpdesk.service.TicketService;
import ma.gov.dgh.helpdesk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST Controller for Ticket query operations
 * Separated from main TicketController for better maintainability
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {
    "http://localhost:3000", 
    "http://localhost:4200",
    "http://20.124.43.230",
    "http://20.124.43.230:80",
    "https://dgh-helpdesk-h8ahdqhmhtdhg4bh.centralus-01.azurewebsites.net",
    "http://dgh-frontend-unique.eastus.azurecontainer.io"
})
public class TicketQueryController {
    
    private final TicketService ticketService;
    private final UserService userService;
    
    @Autowired
    public TicketQueryController(TicketService ticketService, UserService userService) {
        this.ticketService = ticketService;
        this.userService = userService;
    }
    
    /**
     * Get all tickets with pagination and filtering
     */
    @GetMapping
    public ResponseEntity<Page<TicketDTO>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) TicketCategory category,
            @RequestParam(required = false) Long createdById,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) Long equipmentId) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        User createdBy = createdById != null ? userService.findById(createdById).orElse(null) : null;
        User assignedTo = assignedToId != null ? userService.findById(assignedToId).orElse(null) : null;
        
        Page<Ticket> tickets = ticketService.findTicketsWithFilters(
            search, status, priority, category, createdBy, assignedTo, equipmentId, pageable);
        
        // Convert to DTOs
        Page<TicketDTO> ticketDTOs = tickets.map(TicketDTO::new);
        
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get ticket by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketService.findById(id);
        return ticket.map(t -> ResponseEntity.ok(new TicketDTO(t)))
                    .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get tickets by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TicketDTO>> getTicketsByStatus(@PathVariable TicketStatus status) {
        List<Ticket> tickets = ticketService.findByStatus(status);
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get tickets by priority
     */
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<TicketDTO>> getTicketsByPriority(@PathVariable TicketPriority priority) {
        List<Ticket> tickets = ticketService.findByPriority(priority);
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get tickets by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TicketDTO>> getTicketsByCategory(@PathVariable TicketCategory category) {
        List<Ticket> tickets = ticketService.findByCategory(category);
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get tickets created by user
     */
    @GetMapping("/created-by/{userId}")
    public ResponseEntity<List<TicketDTO>> getTicketsCreatedByUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Ticket> tickets = ticketService.findByCreatedBy(user.get());
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get tickets assigned to user
     */
    @GetMapping("/assigned-to/{userId}")
    public ResponseEntity<List<TicketDTO>> getTicketsAssignedToUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Ticket> tickets = ticketService.findByAssignedTo(user.get());
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get unassigned tickets
     */
    @GetMapping("/unassigned")
    public ResponseEntity<List<TicketDTO>> getUnassignedTickets() {
        List<Ticket> tickets = ticketService.findUnassignedTickets();
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get open tickets
     */
    @GetMapping("/open")
    public ResponseEntity<List<TicketDTO>> getOpenTickets() {
        List<Ticket> tickets = ticketService.findOpenTickets();
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get overdue tickets
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<TicketDTO>> getOverdueTickets() {
        List<Ticket> tickets = ticketService.findOverdueTickets();
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get escalated tickets
     */
    @GetMapping("/escalated")
    public ResponseEntity<List<TicketDTO>> getEscalatedTickets() {
        List<Ticket> tickets = ticketService.findEscalatedTickets();
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get critical open tickets
     */
    @GetMapping("/critical")
    public ResponseEntity<List<TicketDTO>> getCriticalOpenTickets() {
        List<Ticket> tickets = ticketService.findCriticalOpenTickets();
        List<TicketDTO> ticketDTOs = tickets.stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ticketDTOs);
    }
    
    /**
     * Get ticket statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<TicketService.TicketStatistics> getTicketStatistics() {
        TicketService.TicketStatistics statistics = ticketService.getTicketStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get ticket comments
     */
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketComment>> getTicketComments(@PathVariable Long id) {
        try {
            List<TicketComment> comments = ticketService.getTicketComments(id);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DTO classes for response
    public static class TicketDTO {
        private Long id;
        private String title;
        private String description;
        private TicketPriority priority;
        private TicketStatus status;
        private TicketCategory category;
        private UserDTO createdBy;
        private UserDTO assignedTo;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
        private java.time.LocalDateTime resolvedAt;
        private java.time.LocalDateTime dueDate;
        private String resolution;
        private Integer estimatedHours;
        private Integer actualHours;
        private Integer customerSatisfaction;
        private Boolean isEscalated;
        private String escalationReason;
        
        public TicketDTO(Ticket ticket) {
            this.id = ticket.getId();
            this.title = ticket.getTitle();
            this.description = ticket.getDescription();
            this.priority = ticket.getPriority();
            this.status = ticket.getStatus();
            this.category = ticket.getCategory();
            this.createdBy = ticket.getCreatedBy() != null ? new UserDTO(ticket.getCreatedBy()) : null;
            this.assignedTo = ticket.getAssignedTo() != null ? new UserDTO(ticket.getAssignedTo()) : null;
            this.createdAt = ticket.getCreatedAt();
            this.updatedAt = ticket.getUpdatedAt();
            this.resolvedAt = ticket.getResolvedAt();
            this.dueDate = ticket.getDueDate();
            this.resolution = ticket.getResolution();
            this.estimatedHours = ticket.getEstimatedHours();
            this.actualHours = ticket.getActualHours();
            this.customerSatisfaction = ticket.getCustomerSatisfaction();
            this.isEscalated = ticket.getIsEscalated();
            this.escalationReason = ticket.getEscalationReason();
        }
        
        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public TicketPriority getPriority() { return priority; }
        public void setPriority(TicketPriority priority) { this.priority = priority; }
        
        public TicketStatus getStatus() { return status; }
        public void setStatus(TicketStatus status) { this.status = status; }
        
        public TicketCategory getCategory() { return category; }
        public void setCategory(TicketCategory category) { this.category = category; }
        
        public UserDTO getCreatedBy() { return createdBy; }
        public void setCreatedBy(UserDTO createdBy) { this.createdBy = createdBy; }
        
        public UserDTO getAssignedTo() { return assignedTo; }
        public void setAssignedTo(UserDTO assignedTo) { this.assignedTo = assignedTo; }
        
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
        
        public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
        
        public java.time.LocalDateTime getResolvedAt() { return resolvedAt; }
        public void setResolvedAt(java.time.LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
        
        public java.time.LocalDateTime getDueDate() { return dueDate; }
        public void setDueDate(java.time.LocalDateTime dueDate) { this.dueDate = dueDate; }
        
        public String getResolution() { return resolution; }
        public void setResolution(String resolution) { this.resolution = resolution; }
        
        public Integer getEstimatedHours() { return estimatedHours; }
        public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }
        
        public Integer getActualHours() { return actualHours; }
        public void setActualHours(Integer actualHours) { this.actualHours = actualHours; }
        
        public Integer getCustomerSatisfaction() { return customerSatisfaction; }
        public void setCustomerSatisfaction(Integer customerSatisfaction) { this.customerSatisfaction = customerSatisfaction; }
        
        public Boolean getIsEscalated() { return isEscalated; }
        public void setIsEscalated(Boolean isEscalated) { this.isEscalated = isEscalated; }
        
        public String getEscalationReason() { return escalationReason; }
        public void setEscalationReason(String escalationReason) { this.escalationReason = escalationReason; }
    }
    
    public static class UserDTO {
        private Long id;
        private String ldapUsername;
        private String email;
        private String fullName;
        private String department;
        private UserRole role;
        private Boolean isActive;
        
        public UserDTO(User user) {
            this.id = user.getId();
            this.ldapUsername = user.getLdapUsername();
            this.email = user.getEmail();
            this.fullName = user.getFullName();
            this.department = user.getDepartment();
            this.role = user.getRole();
            this.isActive = user.getIsActive();
        }
        
        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getLdapUsername() { return ldapUsername; }
        public void setLdapUsername(String ldapUsername) { this.ldapUsername = ldapUsername; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        
        public UserRole getRole() { return role; }
        public void setRole(UserRole role) { this.role = role; }
        
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }
} 