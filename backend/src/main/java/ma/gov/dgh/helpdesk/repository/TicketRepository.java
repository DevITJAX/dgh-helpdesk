package ma.gov.dgh.helpdesk.repository;

import ma.gov.dgh.helpdesk.entity.Ticket;
import ma.gov.dgh.helpdesk.entity.TicketCategory;
import ma.gov.dgh.helpdesk.entity.TicketPriority;
import ma.gov.dgh.helpdesk.entity.TicketStatus;
import ma.gov.dgh.helpdesk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Ticket entity operations
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    /**
     * Find tickets by status
     */
    List<Ticket> findByStatus(TicketStatus status);
    
    /**
     * Find tickets by priority
     */
    List<Ticket> findByPriority(TicketPriority priority);
    
    /**
     * Find tickets by category
     */
    List<Ticket> findByCategory(TicketCategory category);
    
    /**
     * Find tickets created by a specific user
     */
    List<Ticket> findByCreatedBy(User createdBy);
    
    /**
     * Find tickets assigned to a specific user
     */
    List<Ticket> findByAssignedTo(User assignedTo);
    
    /**
     * Find unassigned tickets
     */
    List<Ticket> findByAssignedToIsNull();
    
    /**
     * Find tickets by equipment
     */
    List<Ticket> findByEquipmentId(Long equipmentId);
    
    /**
     * Find tickets created in a date range
     */
    List<Ticket> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find tickets resolved in a date range
     */
    List<Ticket> findByResolvedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find overdue tickets
     */
    @Query("SELECT t FROM Ticket t WHERE t.dueDate < :currentTime AND t.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    List<Ticket> findOverdueTickets(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * Find escalated tickets
     */
    List<Ticket> findByIsEscalatedTrue();
    
    /**
     * Find open tickets (not resolved, closed, or cancelled)
     */
    @Query("SELECT t FROM Ticket t WHERE t.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    List<Ticket> findOpenTickets();
    
    /**
     * Find tickets with pagination and search - Optimized for performance
     */
    @Query("SELECT t FROM Ticket t WHERE " +
           "(:search IS NULL OR " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "t.description LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(t.category) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:createdBy IS NULL OR t.createdBy = :createdBy) AND " +
           "(:assignedTo IS NULL OR t.assignedTo = :assignedTo) AND " +
           "(:equipmentId IS NULL OR t.equipment.id = :equipmentId)")
    Page<Ticket> findTicketsWithFilters(@Param("search") String search,
                                       @Param("status") TicketStatus status,
                                       @Param("priority") TicketPriority priority,
                                       @Param("category") TicketCategory category,
                                       @Param("createdBy") User createdBy,
                                       @Param("assignedTo") User assignedTo,
                                       @Param("equipmentId") Long equipmentId,
                                       Pageable pageable);

    /**
     * Find tickets with related entities loaded - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "LEFT JOIN FETCH t.equipment " +
           "WHERE (:search IS NULL OR " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "t.description LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(t.category) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:createdBy IS NULL OR t.createdBy = :createdBy) AND " +
           "(:assignedTo IS NULL OR t.assignedTo = :assignedTo) AND " +
           "(:equipmentId IS NULL OR t.equipment.id = :equipmentId)")
    List<Ticket> findTicketsWithFiltersAndEntities(@Param("search") String search,
                                                   @Param("status") TicketStatus status,
                                                   @Param("priority") TicketPriority priority,
                                                   @Param("category") TicketCategory category,
                                                   @Param("createdBy") User createdBy,
                                                   @Param("assignedTo") User assignedTo,
                                                   @Param("equipmentId") Long equipmentId);

    /**
     * Find ticket by ID with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "LEFT JOIN FETCH t.equipment " +
           "WHERE t.id = :id")
    Optional<Ticket> findByIdWithEntities(@Param("id") Long id);

    /**
     * Find tickets by status with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.status = :status")
    List<Ticket> findByStatusWithEntities(@Param("status") TicketStatus status);

    /**
     * Find tickets by priority with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.priority = :priority")
    List<Ticket> findByPriorityWithEntities(@Param("priority") TicketPriority priority);

    /**
     * Find tickets by category with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.category = :category")
    List<Ticket> findByCategoryWithEntities(@Param("category") TicketCategory category);

    /**
     * Find tickets created by user with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.createdBy = :createdBy")
    List<Ticket> findByCreatedByWithEntities(@Param("createdBy") User createdBy);

    /**
     * Find tickets assigned to user with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.assignedTo = :assignedTo")
    List<Ticket> findByAssignedToWithEntities(@Param("assignedTo") User assignedTo);

    /**
     * Find unassigned tickets with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "WHERE t.assignedTo IS NULL")
    List<Ticket> findUnassignedTicketsWithEntities();

    /**
     * Find open tickets with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    List<Ticket> findOpenTicketsWithEntities();

    /**
     * Find overdue tickets with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.dueDate < :currentTime AND t.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    List<Ticket> findOverdueTicketsWithEntities(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find escalated tickets with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.isEscalated = true")
    List<Ticket> findEscalatedTicketsWithEntities();

    /**
     * Find critical open tickets with related entities - Optimized to prevent N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Ticket t " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.assignedTo " +
           "WHERE t.priority = 'CRITICAL' AND t.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    List<Ticket> findCriticalOpenTicketsWithEntities();
    
    /**
     * Count tickets by status
     */
    long countByStatus(TicketStatus status);
    
    /**
     * Count tickets by priority
     */
    long countByPriority(TicketPriority priority);
    
    /**
     * Count tickets by category
     */
    long countByCategory(TicketCategory category);
    
    /**
     * Count tickets created by user
     */
    long countByCreatedBy(User createdBy);
    
    /**
     * Count tickets assigned to user
     */
    long countByAssignedTo(User assignedTo);
    
    /**
     * Count unassigned tickets
     */
    long countByAssignedToIsNull();
    
    /**
     * Count escalated tickets
     */
    long countByIsEscalatedTrue();
    
    /**
     * Find tickets created today
     */
    @Query("SELECT t FROM Ticket t WHERE t.createdAt >= :startOfDay AND t.createdAt < :endOfDay")
    List<Ticket> findTicketsCreatedToday(@Param("startOfDay") LocalDateTime startOfDay, 
                                        @Param("endOfDay") LocalDateTime endOfDay);
    
    /**
     * Find tickets resolved today
     */
    @Query("SELECT t FROM Ticket t WHERE t.resolvedAt >= :startOfDay AND t.resolvedAt < :endOfDay")
    List<Ticket> findTicketsResolvedToday(@Param("startOfDay") LocalDateTime startOfDay, 
                                         @Param("endOfDay") LocalDateTime endOfDay);
    
    /**
     * Find tickets by status and assigned user
     */
    List<Ticket> findByStatusAndAssignedTo(TicketStatus status, User assignedTo);
    
    /**
     * Find tickets by status and created by user
     */
    List<Ticket> findByStatusAndCreatedBy(TicketStatus status, User createdBy);
    
    /**
     * Find tickets with high priority that are not assigned
     */
    @Query("SELECT t FROM Ticket t WHERE t.priority = 'HIGH' AND t.assignedTo IS NULL")
    List<Ticket> findHighPriorityUnassignedTickets();
    
    /**
     * Find tickets with critical priority
     */
    @Query("SELECT t FROM Ticket t WHERE t.priority = 'CRITICAL' AND t.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    List<Ticket> findCriticalOpenTickets();
    
    /**
     * Get ticket statistics by date range
     */
    @Query("SELECT t.status, COUNT(t) FROM Ticket t WHERE t.createdAt BETWEEN :startDate AND :endDate GROUP BY t.status")
    List<Object[]> getTicketStatsByDateRange(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);
    
    /**
     * Get ticket statistics by category
     */
    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> getTicketStatsByCategory();
    
    /**
     * Get average resolution time by category
     */
    @Query("SELECT t.category, COUNT(t) FROM Ticket t WHERE t.resolvedAt IS NOT NULL GROUP BY t.category")
    List<Object[]> getAverageResolutionTimeByCategory();
    
    /**
     * Find tickets assigned to user with specific status
     */
    Page<Ticket> findByAssignedToAndStatus(User assignedTo, TicketStatus status, Pageable pageable);
    
    /**
     * Find tickets created by user with specific status
     */
    Page<Ticket> findByCreatedByAndStatus(User createdBy, TicketStatus status, Pageable pageable);
}
