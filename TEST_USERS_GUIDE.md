# DGH HelpDesk - Test Users Guide

This guide provides test users and scenarios to verify ticket visibility and creation permissions in the DGH HelpDesk system.

## Test Users Overview

### Admin Users (Full Access)
- **Username**: `test_admin`
- **Email**: test.admin@dgh.gov.ma
- **Role**: ADMIN
- **Department**: IT Department
- **Permissions**: Can see all tickets, create/edit/delete any ticket, manage users

- **Username**: `test_admin2`
- **Email**: test.admin2@dgh.gov.ma
- **Role**: ADMIN
- **Department**: IT Department
- **Permissions**: Same as test_admin

### Technician Users (Full Ticket Access)
- **Username**: `test_tech1`
- **Email**: test.tech1@dgh.gov.ma
- **Role**: TECHNICIAN
- **Department**: IT Department
- **Permissions**: Can see all tickets, be assigned to tickets, update ticket status

- **Username**: `test_tech2`
- **Email**: test.tech2@dgh.gov.ma
- **Role**: TECHNICIAN
- **Department**: IT Department
- **Permissions**: Same as test_tech1

- **Username**: `test_tech3`
- **Email**: test.tech3@dgh.gov.ma
- **Role**: TECHNICIAN
- **Department**: IT Department
- **Permissions**: Same as test_tech1

### Employee Users (Limited Access)
- **Username**: `test_emp1`
- **Email**: test.emp1@dgh.gov.ma
- **Role**: EMPLOYEE
- **Department**: Finance Department
- **Permissions**: Can only see tickets they created, can create new tickets

- **Username**: `test_emp2`
- **Email**: test.emp2@dgh.gov.ma
- **Role**: EMPLOYEE
- **Department**: HR Department
- **Permissions**: Can only see tickets they created, can create new tickets

- **Username**: `test_emp3`
- **Email**: test.emp3@dgh.gov.ma
- **Role**: EMPLOYEE
- **Department**: Operations Department
- **Permissions**: Can only see tickets they created, can create new tickets

- **Username**: `test_emp4`
- **Email**: test.emp4@dgh.gov.ma
- **Role**: EMPLOYEE
- **Department**: Legal Department
- **Permissions**: Can only see tickets they created, can create new tickets

- **Username**: `test_emp5`
- **Email**: test.emp5@dgh.gov.ma
- **Role**: EMPLOYEE
- **Department**: Planning Department
- **Permissions**: Can only see tickets they created, can create new tickets

## Test Data Summary

### Tickets Created by test_emp1 (Finance Employee)
1. **Printer not working in Finance** - HIGH priority, OPEN status
2. **Need access to accounting software** - MEDIUM priority, OPEN status
3. **Computer running very slow** - HIGH priority, IN_PROGRESS status

### Tickets Created by test_emp2 (HR Employee)
1. **Cannot access HR system** - CRITICAL priority, OPEN status
2. **Need new employee account setup** - MEDIUM priority, OPEN status
3. **Email signature update** - LOW priority, RESOLVED status

### Tickets Created by test_emp3 (Operations Employee)
1. **Network connectivity issues** - HIGH priority, OPEN status
2. **Software installation request** - MEDIUM priority, OPEN status

### Tickets Created by test_emp4 (Legal Employee)
1. **Document scanner not working** - MEDIUM priority, IN_PROGRESS status
2. **VPN access from home** - LOW priority, OPEN status

### Tickets Created by test_emp5 (Planning Employee)
1. **Monitor display problem** - HIGH priority, OPEN status
2. **Database access request** - MEDIUM priority, OPEN status

### Tickets Created by test_tech1 (Technician)
1. **Server maintenance scheduled** - MEDIUM priority, OPEN status
2. **Backup system check needed** - HIGH priority, OPEN status

### Tickets Created by test_admin (Admin)
1. **System-wide security update** - CRITICAL priority, OPEN status
2. **Network infrastructure upgrade** - HIGH priority, OPEN status

## Testing Scenarios

### Scenario 1: Employee Ticket Visibility
**Objective**: Verify that employees can only see their own tickets

**Steps**:
1. Login as `test_emp1`
2. Navigate to Tickets page
3. **Expected Result**: Should see only 3 tickets (created by test_emp1)
4. Login as `test_emp2`
5. Navigate to Tickets page
6. **Expected Result**: Should see only 3 tickets (created by test_emp2)

### Scenario 2: Technician Ticket Visibility
**Objective**: Verify that technicians can see all tickets

**Steps**:
1. Login as `test_tech1`
2. Navigate to Tickets page
3. **Expected Result**: Should see all tickets in the system (15+ tickets)
4. Verify they can see tickets created by employees, other technicians, and admins

### Scenario 3: Admin Ticket Visibility
**Objective**: Verify that admins can see all tickets

**Steps**:
1. Login as `test_admin`
2. Navigate to Tickets page
3. **Expected Result**: Should see all tickets in the system (15+ tickets)
4. Verify they can see tickets from all users

### Scenario 4: Ticket Creation Permissions
**Objective**: Verify that all users can create tickets

**Steps**:
1. Login as `test_emp1`
2. Create a new ticket
3. **Expected Result**: Ticket should be created successfully
4. Login as `test_tech1`
5. Create a new ticket
6. **Expected Result**: Ticket should be created successfully
7. Login as `test_admin`
8. Create a new ticket
9. **Expected Result**: Ticket should be created successfully

### Scenario 5: Ticket Assignment Permissions
**Objective**: Verify ticket assignment permissions

**Steps**:
1. Login as `test_emp1`
2. Try to assign a ticket to a technician
3. **Expected Result**: Should NOT be able to assign tickets (employees can't assign)
4. Login as `test_tech1`
5. Try to assign a ticket to another technician
6. **Expected Result**: Should be able to assign tickets
7. Login as `test_admin`
8. Try to assign a ticket to a technician
9. **Expected Result**: Should be able to assign tickets

### Scenario 6: Ticket Status Update Permissions
**Objective**: Verify ticket status update permissions

**Steps**:
1. Login as `test_emp1`
2. Try to change ticket status
3. **Expected Result**: Should NOT be able to change status (employees can't update status)
4. Login as `test_tech1`
5. Try to change ticket status
6. **Expected Result**: Should be able to change status
7. Login as `test_admin`
8. Try to change ticket status
9. **Expected Result**: Should be able to change status

### Scenario 7: Comment Visibility
**Objective**: Verify comment visibility based on user role

**Steps**:
1. Login as `test_emp1`
2. View a ticket with comments
3. **Expected Result**: Should see public comments, internal comments should be hidden
4. Login as `test_tech1`
5. View the same ticket
6. **Expected Result**: Should see both public and internal comments
7. Login as `test_admin`
8. View the same ticket
9. **Expected Result**: Should see both public and internal comments

## How to Load Test Data

### Option 1: Using Test Profile
```bash
# Start the backend with test profile
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### Option 2: Manual Database Execution
1. Start the backend application
2. Access H2 console at: http://localhost:8080/h2-console
3. Connect with:
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`
4. Execute the SQL from `test-data.sql`

### Option 3: Using Application Properties
Add to `application.properties`:
```properties
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:test-data.sql
```

## Expected Test Results

| User Type | Can See Own Tickets | Can See Other Tickets | Can Create Tickets | Can Assign Tickets | Can Update Status |
|-----------|-------------------|---------------------|------------------|------------------|------------------|
| EMPLOYEE  | ✅ Yes            | ❌ No               | ✅ Yes           | ❌ No            | ❌ No            |
| TECHNICIAN| ✅ Yes            | ✅ Yes              | ✅ Yes           | ✅ Yes           | ✅ Yes           |
| ADMIN     | ✅ Yes            | ✅ Yes              | ✅ Yes           | ✅ Yes           | ✅ Yes           |

## Troubleshooting

### If test data doesn't load:
1. Check if the database is using the correct schema
2. Verify that `test-data.sql` is in the classpath
3. Check application logs for SQL errors
4. Ensure the application is using the test profile

### If users can't login:
1. Verify that the authentication system is configured for test users
2. Check if LDAP authentication is disabled for test environment
3. Ensure test users are properly inserted into the database

### If ticket visibility is incorrect:
1. Check the ticket filtering logic in the backend
2. Verify that user roles are properly set
3. Check if the frontend is correctly passing user context
4. Review the security configuration

## Notes

- All test users have the password: `password` (for testing purposes)
- The test data includes realistic scenarios that might occur in a government IT environment
- Comments include both public and internal notes to test visibility permissions
- Ticket priorities range from LOW to CRITICAL to test different scenarios
- Ticket statuses include OPEN, IN_PROGRESS, and RESOLVED to test workflow 