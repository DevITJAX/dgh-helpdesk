# 🔧 DGH HelpDesk - Troubleshooting Guide

## 🚨 **Critical Issues & Solutions**

### **Issue: Login Page Refreshes Instead of Navigating to Dashboard**

**Root Cause**: The backend server is not running, causing network errors that trigger page refreshes.

**Solution**:
1. **Start the Backend Server**:
   ```bash
   # Option 1: Use the provided script
   start-backend.bat
   
   # Option 2: Manual start
   cd backend
   mvn spring-boot:run
   ```

2. **Verify Backend is Running**:
   - Open browser to: `http://localhost:8080/api/health`
   - Should return JSON response
   - Check console for Spring Boot startup messages

3. **Start the Frontend**:
   ```bash
   # Option 1: Use the provided script
   start-frontend.bat
   
   # Option 2: Manual start
   cd frontend
   npm start
   ```

### **Issue: "Cannot connect to server" Error**

**Causes**:
- Backend server not running
- Wrong port configuration
- Firewall blocking connection
- Network issues

**Solutions**:
1. **Check Backend Status**:
   ```bash
   curl http://localhost:8080/api/health
   ```

2. **Verify Port Configuration**:
   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:3000`
   - Check `frontend/src/services/apiClient.js` for correct backend URL

3. **Check Firewall**:
   - Allow Java/Spring Boot through Windows Firewall
   - Allow Node.js through Windows Firewall

### **Issue: Authentication Token Problems**

**Symptoms**:
- Login works but immediately logged out
- "Unauthorized" errors
- Token verification failures

**Solutions**:
1. **Clear Browser Storage**:
   - Open DevTools (F12)
   - Go to Application/Storage tab
   - Clear localStorage and sessionStorage
   - Refresh page

2. **Check Token Storage**:
   ```javascript
   // In browser console
   localStorage.getItem('authToken')
   ```

3. **Verify Backend Authentication**:
   - Check backend logs for authentication errors
   - Verify LDAP configuration

## 🔍 **Common Error Messages & Fixes**

### **"Network Error"**
- **Cause**: Backend server down
- **Fix**: Start backend with `start-backend.bat`

### **"401 Unauthorized"**
- **Cause**: Invalid credentials or expired token
- **Fix**: Clear localStorage and try logging in again

### **"500 Server Error"**
- **Cause**: Backend application error
- **Fix**: Check backend logs for specific error details

### **"ERR_NETWORK"**
- **Cause**: Cannot reach backend server
- **Fix**: Verify backend is running on correct port

## 🛠️ **Development Setup**

### **Prerequisites**
1. **Java 17+** installed
2. **Node.js 18+** installed
3. **Maven** installed
4. **Git** installed

### **Installation Steps**
```bash
# 1. Clone repository
git clone <repository-url>
cd dgh-helpdesk

# 2. Start Backend
start-backend.bat

# 3. Start Frontend (in new terminal)
start-frontend.bat
```

### **Verification**
1. **Backend Health Check**: `http://localhost:8080/api/health`
2. **Frontend**: `http://localhost:3000`
3. **H2 Database Console**: `http://localhost:8080/h2-console`

## 🔧 **Configuration Issues**

### **Backend Configuration**
- **Database**: H2 (development) / PostgreSQL (production)
- **Port**: 8080 (configurable in `application.properties`)
- **CORS**: Configured for `http://localhost:3000`

### **Frontend Configuration**
- **Backend URL**: `http://localhost:8080` (in `apiClient.js`)
- **Port**: 3000 (React default)
- **API Base**: `/api/`

## 🐛 **Debugging Tips**

### **Frontend Debugging**
1. **Open Browser DevTools** (F12)
2. **Check Console** for JavaScript errors
3. **Check Network Tab** for API calls
4. **Check Application Tab** for localStorage

### **Backend Debugging**
1. **Check Console Output** for Spring Boot logs
2. **Check Application Logs** in `backend/logs/`
3. **Use H2 Console** to verify database
4. **Test API Endpoints** with Postman/curl

### **Common Debug Commands**
```bash
# Test backend health
curl http://localhost:8080/api/health

# Test authentication endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Check if ports are in use
netstat -an | findstr :8080
netstat -an | findstr :3000
```

## 📋 **Checklist for Login Issues**

- [ ] Backend server is running (`http://localhost:8080/api/health` returns JSON)
- [ ] Frontend server is running (`http://localhost:3000` loads)
- [ ] No console errors in browser DevTools
- [ ] Network tab shows successful API calls
- [ ] localStorage contains valid authToken
- [ ] No CORS errors in console
- [ ] Backend logs show successful authentication

## 🚀 **Quick Fix Commands**

```bash
# Kill all Java processes (if backend stuck)
taskkill /f /im java.exe

# Kill all Node processes (if frontend stuck)
taskkill /f /im node.exe

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd frontend && npm install
cd ../backend && mvn clean install

# Start fresh
start-backend.bat
start-frontend.bat
```

## 📞 **Getting Help**

If issues persist:
1. Check this troubleshooting guide
2. Review console logs and error messages
3. Verify all prerequisites are installed
4. Try the quick fix commands
5. Check the project documentation

---

*Last updated: January 2025* 