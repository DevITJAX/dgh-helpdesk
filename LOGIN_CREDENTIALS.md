# 🔐 DGH HelpDesk - Login Credentials

## **Development Environment Credentials**

The following credentials are configured for testing in the development environment:

### **Admin Users**
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN
- **Access**: Full system access

- **Username**: `helpdesk-admin`
- **Password**: `helpdesk123`
- **Role**: ADMIN
- **Access**: Full system access

### **Technician Users**
- **Username**: `john.doe`
- **Password**: `password123`
- **Role**: TECHNICIAN
- **Access**: Ticket management, equipment access

- **Username**: `jane.smith`
- **Password**: `password123`
- **Role**: TECHNICIAN
- **Access**: Ticket management, equipment access

### **Employee Users**
- **Username**: `alice.finance`
- **Password**: `password123`
- **Role**: EMPLOYEE
- **Access**: Create tickets, view own tickets

- **Username**: `bob.hr`
- **Password**: `password123`
- **Role**: EMPLOYEE
- **Access**: Create tickets, view own tickets

### **Legacy Test User**
- **Username**: `user`
- **Password**: `user123`
- **Role**: USER
- **Access**: Limited access

## **How to Test Role-Based Dashboards**

1. **Open the application**: `http://localhost:3000`
2. **Use different credentials to test different dashboards**:
   - **Admin Dashboard**: Use `admin` or `helpdesk-admin`
   - **Technician Dashboard**: Use `john.doe` or `jane.smith`
   - **Employee Dashboard**: Use `alice.finance` or `bob.hr`

## **Important Notes**

- These credentials are for **development only**
- In production, these will be replaced with LDAP authentication
- The passwords are BCrypt encoded in the backend
- Never use these credentials in production
- All users have the same password (`password123`) for easy testing

## **Troubleshooting**

If login still doesn't work:
1. Make sure backend is running: `http://localhost:8080/api/health`
2. Check browser console for errors (F12)
3. Try the test page: `test-login.html`
4. Clear browser cache and localStorage
5. Restart the backend server to pick up new user configurations

---

*Last updated: January 2025* 