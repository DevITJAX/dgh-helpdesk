package ma.gov.dgh.helpdesk.controller;

import ma.gov.dgh.helpdesk.entity.*;
import ma.gov.dgh.helpdesk.service.TicketService;
import ma.gov.dgh.helpdesk.service.UserService;
import ma.gov.dgh.helpdesk.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Ticket operations
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200"})
public class TicketController {
    
    private final TicketService ticketService;
    private final UserService userService;
    private final TicketRepository ticketRepository;
    
    @Autowired
    public TicketController(TicketService ticketService, UserService userService, TicketRepository ticketRepository) {
        this.ticketService = ticketService;
        this.userService = userService;
        this.ticketRepository = ticketRepository;
    }
    
    /**
     * Get all tickets with pagination and filtering
     */
    @GetMapping
    public ResponseEntity<Page<Ticket>> getAllTickets(
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
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get ticket by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketService.findById(id);
        return ticket.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get tickets by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable TicketStatus status) {
        List<Ticket> tickets = ticketService.findByStatus(status);
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get tickets by priority
     */
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Ticket>> getTicketsByPriority(@PathVariable TicketPriority priority) {
        List<Ticket> tickets = ticketService.findByPriority(priority);
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get tickets by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Ticket>> getTicketsByCategory(@PathVariable TicketCategory category) {
        List<Ticket> tickets = ticketService.findByCategory(category);
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get tickets created by user
     */
    @GetMapping("/created-by/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsCreatedByUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Ticket> tickets = ticketService.findByCreatedBy(user.get());
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get tickets assigned to user
     */
    @GetMapping("/assigned-to/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsAssignedToUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Ticket> tickets = ticketService.findByAssignedTo(user.get());
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get unassigned tickets
     */
    @GetMapping("/unassigned")
    public ResponseEntity<List<Ticket>> getUnassignedTickets() {
        List<Ticket> tickets = ticketService.findUnassignedTickets();
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get open tickets
     */
    @GetMapping("/open")
    public ResponseEntity<List<Ticket>> getOpenTickets() {
        List<Ticket> tickets = ticketService.findOpenTickets();
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get overdue tickets
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<Ticket>> getOverdueTickets() {
        List<Ticket> tickets = ticketService.findOverdueTickets();
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get escalated tickets
     */
    @GetMapping("/escalated")
    public ResponseEntity<List<Ticket>> getEscalatedTickets() {
        List<Ticket> tickets = ticketService.findEscalatedTickets();
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Get critical open tickets
     */
    @GetMapping("/critical")
    public ResponseEntity<List<Ticket>> getCriticalOpenTickets() {
        List<Ticket> tickets = ticketService.findCriticalOpenTickets();
        return ResponseEntity.ok(tickets);
    }
    
    /**
     * Create a new ticket
     */
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketCreateRequest request) {
        try {
            Optional<User> createdBy = userService.findById(request.getCreatedById());
            if (createdBy.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Ticket ticket = new Ticket(request.getTitle(), request.getDescription(), createdBy.get());
            ticket.setPriority(request.getPriority());
            ticket.setCategory(request.getCategory());
            
            if (request.getEquipmentId() != null) {
                // Equipment will be set by service if needed
            }
            
            Ticket createdTicket = ticketService.createTicket(ticket);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update an existing ticket
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketUpdateRequest request) {
        try {
            Optional<Ticket> existingTicket = ticketService.findById(id);
            if (existingTicket.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Ticket ticket = existingTicket.get();
            ticket.setTitle(request.getTitle());
            ticket.setDescription(request.getDescription());
            ticket.setPriority(request.getPriority());
            ticket.setCategory(request.getCategory());
            ticket.setStatus(request.getStatus());
            
            if (request.getAssignedToId() != null) {
                Optional<User> assignedTo = userService.findById(request.getAssignedToId());
                ticket.setAssignedTo(assignedTo.orElse(null));
            }
            
            Ticket updatedTicket = ticketService.updateTicket(ticket);
            return ResponseEntity.ok(updatedTicket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Assign ticket to user
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTicket(@PathVariable Long id, @RequestBody AssignTicketRequest request) {
        try {
            Optional<User> assignedTo = userService.findById(request.getAssignedToId());
            if (assignedTo.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Ticket ticket = ticketService.assignTicket(id, assignedTo.get());
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Change ticket status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> changeTicketStatus(@PathVariable Long id, @RequestBody StatusChangeRequest request) {
        try {
            Ticket ticket = ticketService.changeStatus(id, request.getStatus(), request.getComment());
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Escalate ticket
     */
    @PutMapping("/{id}/escalate")
    public ResponseEntity<Ticket> escalateTicket(@PathVariable Long id, @RequestBody EscalateTicketRequest request) {
        try {
            Ticket ticket = ticketService.escalateTicket(id, request.getReason());
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Add comment to ticket
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(@PathVariable Long id, @RequestBody AddCommentRequest request) {
        try {
            Optional<User> user = userService.findById(request.getUserId());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            TicketComment comment = ticketService.addComment(id, user.get(), request.getComment(), request.getIsInternal());
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
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
    
    /**
     * Delete ticket
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get ticket statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<TicketService.TicketStatistics> getTicketStatistics() {
        TicketService.TicketStatistics statistics = ticketService.getTicketStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    // Inner classes for request DTOs
    
    public static class TicketCreateRequest {
        private String title;
        private String description;
        private TicketPriority priority;
        private TicketCategory category;
        private Long createdById;
        private Long equipmentId;
        
        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public TicketPriority getPriority() { return priority; }
        public void setPriority(TicketPriority priority) { this.priority = priority; }
        
        public TicketCategory getCategory() { return category; }
        public void setCategory(TicketCategory category) { this.category = category; }
        
        public Long getCreatedById() { return createdById; }
        public void setCreatedById(Long createdById) { this.createdById = createdById; }
        
        public Long getEquipmentId() { return equipmentId; }
        public void setEquipmentId(Long equipmentId) { this.equipmentId = equipmentId; }
    }
    
    public static class TicketUpdateRequest {
        private String title;
        private String description;
        private TicketPriority priority;
        private TicketCategory category;
        private TicketStatus status;
        private Long assignedToId;
        
        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public TicketPriority getPriority() { return priority; }
        public void setPriority(TicketPriority priority) { this.priority = priority; }
        
        public TicketCategory getCategory() { return category; }
        public void setCategory(TicketCategory category) { this.category = category; }
        
        public TicketStatus getStatus() { return status; }
        public void setStatus(TicketStatus status) { this.status = status; }
        
        public Long getAssignedToId() { return assignedToId; }
        public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
    }
    
    public static class AssignTicketRequest {
        private Long assignedToId;
        
        public Long getAssignedToId() { return assignedToId; }
        public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
    }
    
    public static class StatusChangeRequest {
        private TicketStatus status;
        private String comment;
        
        public TicketStatus getStatus() { return status; }
        public void setStatus(TicketStatus status) { this.status = status; }
        
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
    
    public static class EscalateTicketRequest {
        private String reason;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
    
    public static class AddCommentRequest {
        private Long userId;
        private String comment;
        private Boolean isInternal;
        
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        
        public Boolean getIsInternal() { return isInternal; }
        public void setIsInternal(Boolean isInternal) { this.isInternal = isInternal; }
    }
    
    /**
     * Create sample tickets for testing - GET endpoint to avoid auth issues
     */
    @GetMapping("/samples/create")
    public ResponseEntity<String> createSampleTickets() {
        try {
            // Check if we already have tickets
            long ticketCount = ticketService.countAllTickets();
            if (ticketCount > 0) {
                return ResponseEntity.ok("Sample tickets already exist. Current count: " + ticketCount + " tickets");
            }
            
            // Find the admin user (should exist from data.sql)
            Optional<User> adminUserOpt = userService.findByLdapUsername("admin");
            if (!adminUserOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Admin user not found. Please check if data.sql was executed properly.");
            }
            
            User adminUser = adminUserOpt.get();
            
            // Create additional sample tickets
            Ticket ticket1 = new Ticket("Network Connectivity Issue", "WiFi keeps disconnecting every few minutes in conference room", adminUser);
            ticket1.setPriority(TicketPriority.HIGH);
            ticket1.setCategory(TicketCategory.NETWORK);
            ticketService.createTicket(ticket1);
            
            Ticket ticket2 = new Ticket("Software Installation Request", "Need Microsoft Teams installed on new laptop", adminUser);
            ticket2.setPriority(TicketPriority.LOW);
            ticket2.setCategory(TicketCategory.REQUEST);
            ticketService.createTicket(ticket2);
            
            Ticket ticket3 = new Ticket("Backup System Problem", "Daily backup job failed for 3 consecutive days", adminUser);
            ticket3.setPriority(TicketPriority.CRITICAL);
            ticket3.setCategory(TicketCategory.SECURITY);
            ticketService.createTicket(ticket3);
            
            // Count total tickets after creation
            long newTicketCount = ticketService.countAllTickets();
            return ResponseEntity.ok("3 additional sample tickets created successfully. Total tickets: " + newTicketCount);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }
}
