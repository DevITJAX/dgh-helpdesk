# DGH HelpDesk - Test Users Quick Reference

## Quick Login Credentials

### Admin Users (Full Access)
| Username | Password | Role | Department |
|----------|----------|------|------------|
| `test_admin` | `password` | ADMIN | IT Department |
| `test_admin2` | `password` | ADMIN | IT Department |

### Technician Users (Full Ticket Access)
| Username | Password | Role | Department |
|----------|----------|------|------------|
| `test_tech1` | `password` | TECHNICIAN | IT Department |
| `test_tech2` | `password` | TECHNICIAN | IT Department |
| `test_tech3` | `password` | TECHNICIAN | IT Department |

### Employee Users (Limited Access)
| Username | Password | Role | Department | Expected Tickets |
|----------|----------|------|------------|------------------|
| `test_emp1` | `password` | EMPLOYEE | Finance | 3 tickets |
| `test_emp2` | `password` | EMPLOYEE | HR | 3 tickets |
| `test_emp3` | `password` | EMPLOYEE | Operations | 2 tickets |
| `test_emp4` | `password` | EMPLOYEE | Legal | 2 tickets |
| `test_emp5` | `password` | EMPLOYEE | Planning | 2 tickets |

## Quick Test Scenarios

### Test Employee Access
1. Login as `test_emp1`
2. Should see only 3 tickets (Finance department issues)
3. Cannot see tickets from other employees

### Test Technician Access
1. Login as `test_tech1`
2. Should see all tickets (15+ tickets)
3. Can assign and update tickets

### Test Admin Access
1. Login as `test_admin`
2. Should see all tickets (15+ tickets)
3. Full system access

## Total Test Data
- **10 Test Users** (2 Admins, 3 Technicians, 5 Employees)
- **15+ Test Tickets** (various priorities and statuses)
- **Multiple Comments** (public and internal)

## Quick Commands

### Start Backend with Test Data
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### Access H2 Database Console
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

### View Test Data
```sql
-- View all test users
SELECT ldap_username, email, role, department FROM users WHERE ldap_username LIKE 'test_%';

-- View all test tickets
SELECT t.title, t.priority, t.status, u.ldap_username as created_by 
FROM tickets t 
JOIN users u ON t.created_by = u.id 
WHERE u.ldap_username LIKE 'test_%';
``` 