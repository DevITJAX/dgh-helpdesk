-- Initial data for DGH HelpDesk System
-- This script will be executed on application startup

-- Insert sample users
INSERT INTO users (ldap_username, email, full_name, department, role, is_active, created_at, updated_at) 
VALUES 
('admin', 'admin@dgh.gov.ma', 'System Administrator', 'IT Department', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('john.doe', 'john.doe@dgh.gov.ma', 'John Doe', 'IT Department', 'TECHNICIAN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('jane.smith', 'jane.smith@dgh.gov.ma', 'Jane Smith', 'IT Department', 'TECHNICIAN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('alice.finance', 'alice.johnson@dgh.gov.ma', 'Alice Johnson', 'Finance Department', 'EMPLOYEE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bob.hr', 'bob.williams@dgh.gov.ma', 'Bob Williams', 'HR Department', 'EMPLOYEE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample equipment
INSERT INTO equipment (hostname, ip_address, mac_address, equipment_type, manufacturer, model, os_name, location, status, is_managed, created_at, updated_at, last_seen)
VALUES 
('server-01', '192.168.1.10', '00:1B:44:11:3A:B7', 'SERVER', 'Dell', 'PowerEdge R740', 'Windows Server 2019', 'Server Room', 'ONLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('switch-01', '192.168.1.20', '00:1B:44:11:3A:B8', 'SWITCH', 'Cisco', 'Catalyst 2960', null, 'Server Room', 'ONLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('printer-01', '192.168.1.30', '00:1B:44:11:3A:B9', 'PRINTER', 'HP', 'LaserJet Pro 400', null, 'Office Floor 1', 'ONLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pc-finance-01', '192.168.1.100', '00:1B:44:11:3A:C0', 'DESKTOP', 'HP', 'EliteDesk 800', 'Windows 10', 'Finance Department', 'ONLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pc-hr-01', '192.168.1.101', '00:1B:44:11:3A:C1', 'DESKTOP', 'Dell', 'OptiPlex 7070', 'Windows 10', 'HR Department', 'ONLINE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample tickets (distributed among employees for more realistic data)
INSERT INTO tickets (title, description, priority, status, category, created_by, assigned_to, equipment_id, created_at, updated_at)
VALUES 
('Printer not working', 'The printer in Finance department is not responding to print jobs', 'HIGH', 'OPEN', 'PRINTER', 4, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Slow computer performance', 'My computer is running very slowly, especially when opening applications', 'MEDIUM', 'IN_PROGRESS', 'HARDWARE', 4, 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Email access issue', 'Cannot access email from Outlook, getting authentication errors', 'HIGH', 'OPEN', 'EMAIL', 5, 3, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Network connectivity problem', 'Internet connection keeps dropping every few minutes', 'CRITICAL', 'OPEN', 'NETWORK', 4, 3, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Software installation request', 'Need Adobe Acrobat Pro installed on my workstation', 'LOW', 'OPEN', 'REQUEST', 5, 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Monitor display issue', 'Monitor shows flickering and distorted colors', 'MEDIUM', 'IN_PROGRESS', 'HARDWARE', 4, 2, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('VPN connection problem', 'Cannot connect to VPN from home office', 'HIGH', 'OPEN', 'NETWORK', 5, 3, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Finance software access', 'Need access to the new accounting software', 'MEDIUM', 'OPEN', 'REQUEST', 4, 2, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HR system login issue', 'Cannot log into the HR management system', 'HIGH', 'RESOLVED', 'SOFTWARE', 5, 2, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Printer cartridge replacement', 'Printer needs new black ink cartridge', 'LOW', 'OPEN', 'PRINTER', 4, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Server maintenance request', 'Need to schedule maintenance for server-01', 'MEDIUM', 'OPEN', 'REQUEST', 1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Switch configuration issue', 'Network switch showing connectivity problems', 'HIGH', 'IN_PROGRESS', 'NETWORK', 1, 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Desktop upgrade request', 'Need RAM upgrade for better performance', 'LOW', 'OPEN', 'HARDWARE', 4, 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Software license renewal', 'Adobe Creative Suite license expires next month', 'MEDIUM', 'OPEN', 'REQUEST', 5, 3, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Backup system check', 'Need to verify backup system is working properly', 'HIGH', 'OPEN', 'REQUEST', 1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample ticket comments (using admin user ID 1)
INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal, created_at, comment_type)
VALUES 
(1, 1, 'The printer was working fine yesterday, but today it shows offline status', false, CURRENT_TIMESTAMP, 'COMMENT'),
(1, 2, 'I will check the printer connection and drivers', true, CURRENT_TIMESTAMP, 'COMMENT'),
(2, 1, 'The slowness started after the last Windows update', false, CURRENT_TIMESTAMP, 'COMMENT'),
(2, 1, 'Ticket assigned to technician', true, CURRENT_TIMESTAMP, 'ASSIGNMENT_CHANGE'),
(2, 2, 'Running diagnostic tests on the hardware', true, CURRENT_TIMESTAMP, 'COMMENT'),
(3, 1, 'This started happening this morning around 9 AM', false, CURRENT_TIMESTAMP, 'COMMENT'),
(3, 3, 'Checking email server configuration', true, CURRENT_TIMESTAMP, 'COMMENT'),
(4, 1, 'This is affecting my work productivity significantly', false, CURRENT_TIMESTAMP, 'COMMENT'),
(4, 1, 'Priority escalated to CRITICAL', true, CURRENT_TIMESTAMP, 'PRIORITY_CHANGE'),
(4, 3, 'Investigating network infrastructure', true, CURRENT_TIMESTAMP, 'COMMENT'),
(5, 1, 'This is needed for document processing in Finance department', false, CURRENT_TIMESTAMP, 'COMMENT'),
(5, 2, 'Software installation scheduled for tomorrow', true, CURRENT_TIMESTAMP, 'COMMENT'),
(6, 4, 'Monitor issue started after power outage', false, CURRENT_TIMESTAMP, 'COMMENT'),
(6, 2, 'Ordering replacement monitor', true, CURRENT_TIMESTAMP, 'COMMENT'),
(7, 5, 'VPN worked fine last week, issue started today', false, CURRENT_TIMESTAMP, 'COMMENT'),
(7, 3, 'Checking VPN server logs', true, CURRENT_TIMESTAMP, 'COMMENT'),
(8, 4, 'Need access for quarterly reporting', false, CURRENT_TIMESTAMP, 'COMMENT'),
(8, 2, 'Setting up user permissions', true, CURRENT_TIMESTAMP, 'COMMENT'),
(9, 5, 'Cannot access HR system since yesterday', false, CURRENT_TIMESTAMP, 'COMMENT'),
(9, 2, 'Issue resolved - password reset completed', true, CURRENT_TIMESTAMP, 'COMMENT'),
(10, 4, 'Printer showing low ink warning', false, CURRENT_TIMESTAMP, 'COMMENT'),
(10, 3, 'Ordering replacement cartridge', true, CURRENT_TIMESTAMP, 'COMMENT'),
(11, 1, 'Regular maintenance due this month', false, CURRENT_TIMESTAMP, 'COMMENT'),
(11, 2, 'Scheduling maintenance window', true, CURRENT_TIMESTAMP, 'COMMENT'),
(12, 1, 'Switch showing packet loss', false, CURRENT_TIMESTAMP, 'COMMENT'),
(12, 3, 'Investigating switch configuration', true, CURRENT_TIMESTAMP, 'COMMENT'),
(13, 4, 'Computer running slow with multiple applications', false, CURRENT_TIMESTAMP, 'COMMENT'),
(13, 2, 'RAM upgrade approved, ordering parts', true, CURRENT_TIMESTAMP, 'COMMENT'),
(14, 5, 'License expires on 15th of next month', false, CURRENT_TIMESTAMP, 'COMMENT'),
(14, 3, 'Processing license renewal', true, CURRENT_TIMESTAMP, 'COMMENT'),
(15, 1, 'Backup system not responding to scheduled jobs', false, CURRENT_TIMESTAMP, 'COMMENT'),
(15, 2, 'Running backup system diagnostics', true, CURRENT_TIMESTAMP, 'COMMENT');

-- Create indexes for better performance (if not already created by JPA)
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_status_priority ON tickets(status, priority);
CREATE INDEX IF NOT EXISTS idx_equipment_last_seen ON equipment(last_seen);
CREATE INDEX IF NOT EXISTS idx_equipment_status_type ON equipment(status, equipment_type);
CREATE INDEX IF NOT EXISTS idx_users_department_role ON users(department, role);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_created_at ON ticket_comments(created_at);

-- Insert some sample departments for reference
-- Note: This would typically come from LDAP, but we're adding some for testing
-- These are just for demonstration and would be populated from LDAP in production

-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    user_identifier VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    severity VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    session_id VARCHAR(255),
    affected_resource VARCHAR(255),
    old_value TEXT,
    new_value TEXT,
    department VARCHAR(100),
    location VARCHAR(100)
);

-- Create indexes for activity_logs table
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_identifier ON activity_logs(user_identifier);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_severity ON activity_logs(severity);

-- Insert sample activity logs (using H2-compatible DATEADD function instead of INTERVAL)
INSERT INTO activity_logs (timestamp, user_identifier, action, details, severity, ip_address, user_agent, session_id, affected_resource, old_value, new_value, department, location) 
VALUES 
(DATEADD('HOUR', -1, CURRENT_TIMESTAMP), 'admin', 'LOGIN', 'User logged in successfully', 'SUCCESS', '192.168.1.1', 'Chrome/120.0.0.0', 'session-001', 'USER:admin', NULL, NULL, 'IT Department', 'Server Room'),
(DATEADD('HOUR', -2, CURRENT_TIMESTAMP), 'admin', 'TICKET_CREATED', 'Created ticket #1: Network connectivity issue', 'INFO', '192.168.1.1', 'Chrome/120.0.0.0', 'session-001', 'TICKET:1', NULL, NULL, 'IT Department', 'Server Room'),
(DATEADD('HOUR', -3, CURRENT_TIMESTAMP), 'john.doe', 'TICKET_STATUS_CHANGE', 'Changed ticket #1 status from OPEN to IN_PROGRESS', 'INFO', '192.168.1.45', 'Firefox/121.0.0', 'session-002', 'TICKET:1', 'OPEN', 'IN_PROGRESS', 'IT Department', 'Office Floor 1'),
(DATEADD('HOUR', -4, CURRENT_TIMESTAMP), 'admin', 'USER_CREATED', 'Created new user: jane.smith (TECHNICIAN)', 'SUCCESS', '192.168.1.1', 'Chrome/120.0.0.0', 'session-001', 'USER:jane.smith', NULL, 'TECHNICIAN', 'IT Department', 'Server Room'),
(DATEADD('HOUR', -5, CURRENT_TIMESTAMP), 'jane.smith', 'LOGIN', 'User logged in successfully', 'SUCCESS', '192.168.1.67', 'Edge/120.0.0.0', 'session-003', 'USER:jane.smith', NULL, NULL, 'IT Department', 'Office Floor 2'),
(DATEADD('HOUR', -6, CURRENT_TIMESTAMP), 'unknown', 'LOGIN_FAILED', 'Failed login attempt for user: test@dgh.gov.ma', 'ERROR', '192.168.1.100', 'Chrome/120.0.0.0', NULL, 'USER:test@dgh.gov.ma', NULL, NULL, NULL, NULL),
(DATEADD('HOUR', -7, CURRENT_TIMESTAMP), 'admin', 'SYSTEM_CONFIG_CHANGE', 'Updated SLA settings for critical tickets', 'WARNING', '192.168.1.1', 'Chrome/120.0.0.0', 'session-001', 'CONFIG:SLA', '24 hours', '12 hours', 'IT Department', 'Server Room'),
(DATEADD('HOUR', -8, CURRENT_TIMESTAMP), 'john.doe', 'TICKET_RESOLVED', 'Resolved ticket #1: Network connectivity issue', 'SUCCESS', '192.168.1.45', 'Firefox/121.0.0', 'session-002', 'TICKET:1', NULL, 'Network cable replaced', 'IT Department', 'Office Floor 1'),
(DATEADD('HOUR', -9, CURRENT_TIMESTAMP), 'admin', 'EQUIPMENT_DISCOVERED', 'SNMP discovery found 3 new network devices', 'INFO', '192.168.1.1', 'Chrome/120.0.0.0', 'session-001', 'EQUIPMENT:DISCOVERY', NULL, '3 devices', 'IT Department', 'Server Room'),
(DATEADD('HOUR', -10, CURRENT_TIMESTAMP), 'alice.finance', 'LOGIN', 'User logged in successfully', 'SUCCESS', '192.168.1.89', 'Edge/120.0.0.0', 'session-004', 'USER:alice.finance', NULL, NULL, 'Finance Department', 'Finance Office');