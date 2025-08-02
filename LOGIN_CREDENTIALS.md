# 🔐 DGH HelpDesk - Login Credentials

## **Development Environment Credentials**

The following credentials are configured for testing in the development environment:

### **Admin User**
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN
- **Access**: Full system access

### **Regular User**
- **Username**: `user`
- **Password**: `user123`
- **Role**: USER
- **Access**: Limited access

### **Helpdesk Admin**
- **Username**: `helpdesk-admin`
- **Password**: `helpdesk123`
- **Role**: ADMIN
- **Access**: Full system access

## **How to Test**

1. **Open the application**: `http://localhost:3000`
2. **Use any of the credentials above**
3. **The form is pre-filled with admin credentials for testing**

## **Important Notes**

- These credentials are for **development only**
- In production, these will be replaced with LDAP authentication
- The passwords are BCrypt encoded in the backend
- Never use these credentials in production

## **Troubleshooting**

If login still doesn't work:
1. Make sure backend is running: `http://localhost:8080/api/health`
2. Check browser console for errors (F12)
3. Try the test page: `test-login.html`
4. Clear browser cache and localStorage

---

*Last updated: January 2025* 