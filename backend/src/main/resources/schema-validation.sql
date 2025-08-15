-- Database schema validation and performance optimization
-- This file contains indexes and constraints for optimal performance

-- Performance Indexes for Ticket table
CREATE INDEX IF NOT EXISTS idx_ticket_status ON ticket(status);
CREATE INDEX IF NOT EXISTS idx_ticket_priority ON ticket(priority);
CREATE INDEX IF NOT EXISTS idx_ticket_category ON ticket(category);
CREATE INDEX IF NOT EXISTS idx_ticket_created_at ON ticket(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_updated_at ON ticket(updated_at);
CREATE INDEX IF NOT EXISTS idx_ticket_due_date ON ticket(due_date);
CREATE INDEX IF NOT EXISTS idx_ticket_resolved_at ON ticket(resolved_at);
CREATE INDEX IF NOT EXISTS idx_ticket_created_by ON ticket(created_by_id);
CREATE INDEX IF NOT EXISTS idx_ticket_assigned_to ON ticket(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_ticket_equipment ON ticket(equipment_id);
CREATE INDEX IF NOT EXISTS idx_ticket_is_escalated ON ticket(is_escalated);
CREATE INDEX IF NOT EXISTS idx_ticket_status_priority ON ticket(status, priority);
CREATE INDEX IF NOT EXISTS idx_ticket_status_assigned ON ticket(status, assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_ticket_priority_due_date ON ticket(priority, due_date);

-- Performance Indexes for User table
CREATE INDEX IF NOT EXISTS idx_user_ldap_username ON user(ldap_username);
CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);
CREATE INDEX IF NOT EXISTS idx_user_department ON user(department);
CREATE INDEX IF NOT EXISTS idx_user_role ON user(role);
CREATE INDEX IF NOT EXISTS idx_user_is_active ON user(is_active);

-- Performance Indexes for Equipment table
CREATE INDEX IF NOT EXISTS idx_equipment_name ON equipment(name);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_ip_address ON equipment(ip_address);
CREATE INDEX IF NOT EXISTS idx_equipment_mac_address ON equipment(mac_address);

-- Performance Indexes for TicketComment table
CREATE INDEX IF NOT EXISTS idx_ticket_comment_ticket ON ticket_comment(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_comment_created_by ON ticket_comment(created_by_id);
CREATE INDEX IF NOT EXISTS idx_ticket_comment_created_at ON ticket_comment(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_comment_is_internal ON ticket_comment(is_internal);

-- Performance Indexes for ActivityLog table
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON activity_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_action ON activity_log(user_id, action);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ticket_composite_status_priority_category ON ticket(status, priority, category);
CREATE INDEX IF NOT EXISTS idx_ticket_composite_created_by_status ON ticket(created_by_id, status);
CREATE INDEX IF NOT EXISTS idx_ticket_composite_assigned_to_status ON ticket(assigned_to_id, status);
CREATE INDEX IF NOT EXISTS idx_ticket_composite_priority_due_date_status ON ticket(priority, due_date, status);

-- Full-text search indexes for better search performance
-- Note: H2 doesn't support full-text search, but these indexes help with LIKE queries
CREATE INDEX IF NOT EXISTS idx_ticket_title_lower ON ticket(LOWER(title));
CREATE INDEX IF NOT EXISTS idx_ticket_description_lower ON ticket(LOWER(description));
CREATE INDEX IF NOT EXISTS idx_equipment_name_lower ON equipment(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_user_full_name_lower ON user(LOWER(full_name));

-- Statistics and reporting indexes
CREATE INDEX IF NOT EXISTS idx_ticket_created_at_status ON ticket(created_at, status);
CREATE INDEX IF NOT EXISTS idx_ticket_resolved_at_status ON ticket(resolved_at, status);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at_action ON activity_log(created_at, action);

-- Performance optimization: Analyze tables after index creation
-- Note: H2 doesn't support ANALYZE, but this is a placeholder for other databases
-- ANALYZE ticket;
-- ANALYZE user;
-- ANALYZE equipment;
-- ANALYZE ticket_comment;
-- ANALYZE activity_log;
