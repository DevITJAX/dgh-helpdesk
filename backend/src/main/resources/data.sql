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

-- Insert sample tickets (using admin user ID 1 for all relationships)
INSERT INTO tickets (title, description, priority, status, category, created_by, assigned_to, equipment_id, created_at, updated_at)
VALUES 
('Printer not working', 'The printer in Finance department is not responding to print jobs', 'HIGH', 'OPEN', 'PRINTER', 1, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Slow computer performance', 'My computer is running very slowly, especially when opening applications', 'MEDIUM', 'IN_PROGRESS', 'HARDWARE', 1, 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Email access issue', 'Cannot access email from Outlook, getting authentication errors', 'HIGH', 'OPEN', 'EMAIL', 1, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Network connectivity problem', 'Internet connection keeps dropping every few minutes', 'CRITICAL', 'OPEN', 'NETWORK', 1, 1, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Software installation request', 'Need Adobe Acrobat Pro installed on my workstation', 'LOW', 'OPEN', 'REQUEST', 1, null, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample ticket comments (using admin user ID 1)
INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal, created_at, comment_type)
VALUES 
(1, 1, 'The printer was working fine yesterday, but today it shows offline status', false, CURRENT_TIMESTAMP, 'COMMENT'),
(1, 1, 'I will check the printer connection and drivers', true, CURRENT_TIMESTAMP, 'COMMENT'),
(2, 1, 'The slowness started after the last Windows update', false, CURRENT_TIMESTAMP, 'COMMENT'),
(2, 1, 'Ticket assigned to technician', true, CURRENT_TIMESTAMP, 'ASSIGNMENT_CHANGE'),
(2, 1, 'Running diagnostic tests on the hardware', true, CURRENT_TIMESTAMP, 'COMMENT'),
(3, 1, 'This started happening this morning around 9 AM', false, CURRENT_TIMESTAMP, 'COMMENT'),
(4, 1, 'This is affecting my work productivity significantly', false, CURRENT_TIMESTAMP, 'COMMENT'),
(4, 1, 'Priority escalated to CRITICAL', true, CURRENT_TIMESTAMP, 'PRIORITY_CHANGE'),
(5, 1, 'This is needed for document processing in Finance department', false, CURRENT_TIMESTAMP, 'COMMENT');

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