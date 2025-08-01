package ma.gov.dgh.helpdesk.controller;

import ma.gov.dgh.helpdesk.service.EquipmentService;
import ma.gov.dgh.helpdesk.service.TicketService;
import ma.gov.dgh.helpdesk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Dashboard operations and statistics
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200"})
public class DashboardController {
    
    private final UserService userService;
    private final EquipmentService equipmentService;
    private final TicketService ticketService;
    
    @Autowired
    public DashboardController(UserService userService, EquipmentService equipmentService, TicketService ticketService) {
        this.userService = userService;
        this.equipmentService = equipmentService;
        this.ticketService = ticketService;
    }
    
    /**
     * Get overall dashboard statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<DashboardStatistics> getDashboardStatistics() {
        UserService.UserStatistics userStats = userService.getUserStatistics();
        EquipmentService.EquipmentStatistics equipmentStats = equipmentService.getEquipmentStatistics();
        TicketService.TicketStatistics ticketStats = ticketService.getTicketStatistics();
        
        DashboardStatistics dashboardStats = new DashboardStatistics(userStats, equipmentStats, ticketStats);
        return ResponseEntity.ok(dashboardStats);
    }
    
    /**
     * Get user statistics
     */
    @GetMapping("/users/statistics")
    public ResponseEntity<UserService.UserStatistics> getUserStatistics() {
        UserService.UserStatistics statistics = userService.getUserStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get equipment statistics
     */
    @GetMapping("/equipment/statistics")
    public ResponseEntity<EquipmentService.EquipmentStatistics> getEquipmentStatistics() {
        EquipmentService.EquipmentStatistics statistics = equipmentService.getEquipmentStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get ticket statistics
     */
    @GetMapping("/tickets/statistics")
    public ResponseEntity<TicketService.TicketStatistics> getTicketStatistics() {
        TicketService.TicketStatistics statistics = ticketService.getTicketStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Inner class for combined dashboard statistics
     */
    public static class DashboardStatistics {
        private final UserService.UserStatistics userStatistics;
        private final EquipmentService.EquipmentStatistics equipmentStatistics;
        private final TicketService.TicketStatistics ticketStatistics;
        
        public DashboardStatistics(UserService.UserStatistics userStatistics,
                                 EquipmentService.EquipmentStatistics equipmentStatistics,
                                 TicketService.TicketStatistics ticketStatistics) {
            this.userStatistics = userStatistics;
            this.equipmentStatistics = equipmentStatistics;
            this.ticketStatistics = ticketStatistics;
        }
        
        public UserService.UserStatistics getUserStatistics() {
            return userStatistics;
        }
        
        public EquipmentService.EquipmentStatistics getEquipmentStatistics() {
            return equipmentStatistics;
        }
        
        public TicketService.TicketStatistics getTicketStatistics() {
            return ticketStatistics;
        }
    }
}
