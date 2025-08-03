# DGH HelpDesk - IT Support Management System

**Direction Générale de l'Hydraulique** - Ministry of Equipment and Water, Morocco

A comprehensive IT helpdesk management system designed for government institutions, featuring role-based access control, ticket management, equipment monitoring, and comprehensive activity logging.

## 🏛️ **Project Overview**

The DGH HelpDesk is a modern, secure IT support management system built for the Moroccan Ministry of Equipment and Water. It provides a complete solution for managing IT support requests, user administration, equipment monitoring, and system auditing.

### **Key Features**
- 🔐 **LDAP Authentication** - Secure government domain integration
- 👥 **Role-Based Access Control** - Admin, Technician, and Employee roles
- 🎫 **Ticket Management** - Complete lifecycle from creation to resolution
- 📊 **Real-time Dashboards** - Role-specific analytics and monitoring
- 🔍 **Activity Logging** - Comprehensive audit trail for security compliance
- 🖥️ **Equipment Monitoring** - SNMP-based network device discovery
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🏗️ **Architecture**

### **Technology Stack**

#### **Frontend**
- **React 18.2.0** - Modern UI framework
- **Material-UI (MUI) v5** - Professional government-appropriate design
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Recharts** - Data visualization for dashboards
- **React Context** - State management

#### **Backend**
- **Spring Boot 3.5.3** - Java-based REST API
- **Java 17** - Modern Java features
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **H2 Database** - Development database
- **PostgreSQL** - Production database
- **LDAP Integration** - Active Directory authentication
- **JWT Tokens** - Secure session management

### **Database Schema**

#### **Core Entities**
- **Users** - User management with roles and departments
- **Tickets** - Support requests with status tracking
- **Equipment** - IT asset inventory and monitoring
- **ActivityLogs** - Comprehensive audit trail
- **Comments** - Ticket communication system

#### **Enums & Types**
- **UserRole** - ADMIN, TECHNICIAN, USER
- **TicketStatus** - OPEN, IN_PROGRESS, RESOLVED, CLOSED
- **TicketPriority** - CRITICAL, HIGH, MEDIUM, LOW
- **LogSeverity** - ERROR, WARNING, SUCCESS, INFO

## 🎯 **Role-Based System**

### **Admin (ROLE_ADMIN)**
- **Full System Access** - Complete administrative control
- **User Management** - Create, edit, and manage all users
- **Ticket Oversight** - View and reassign all tickets
- **Equipment Monitoring** - SNMP network discovery
- **Activity Logs** - Comprehensive audit trail access
- **System Configuration** - LDAP, SLA, and security settings
- **Reports & Analytics** - Full statistical access

### **Technician (ROLE_TECHNICIAN)**
- **Ticket Resolution** - Handle assigned support requests
- **Personal Dashboard** - Performance metrics and SLA tracking
- **Equipment Access** - View-only equipment monitoring
- **Knowledge Base** - Access to technical documentation
- **Limited Reports** - Personal performance analytics

### **Employee (ROLE_USER)**
- **Ticket Creation** - Submit support requests
- **Status Tracking** - Monitor ticket progress
- **Communication** - Comment on tickets
- **Knowledge Base** - Access self-service documentation
- **Profile Management** - Update personal information

## 📊 **Dashboard Features**

### **Admin Dashboard**
- **Global Statistics** - System-wide metrics and trends
- **Ticket Distribution** - Visual charts and analytics
- **Technician Performance** - Individual and team metrics
- **Equipment Status** - Network device monitoring
- **Activity Log** - Real-time system audit trail
- **Quick Actions** - User creation, ticket assignment, reports

### **Technician Dashboard**
- **Personal Workload** - Assigned tickets and priorities
- **SLA Alerts** - Urgent ticket notifications
- **Performance Stats** - Resolution times and compliance
- **Recent Assignments** - Latest ticket updates
- **Weekly Trends** - Personal productivity analytics

### **Employee Dashboard**
- **My Tickets** - Personal support request overview
- **Quick Creation** - Easy ticket submission
- **Status Updates** - Real-time ticket progress
- **Knowledge Base** - Self-service recommendations
- **Recent Activity** - Personal ticket history

## 🔍 **Activity Logging System**

### **Comprehensive Audit Trail**
- **User Actions** - Login, logout, and system interactions
- **Ticket Operations** - Creation, updates, assignments, resolution
- **User Management** - Account creation, updates, role changes
- **System Changes** - Configuration modifications
- **Security Events** - Failed logins, suspicious activities
- **Equipment Discovery** - Network device monitoring

### **Security Features**
- **IP Address Tracking** - Monitor access patterns
- **Session Correlation** - Link activities to user sessions
- **Suspicious Activity Detection** - Multiple failed login alerts
- **Export Capabilities** - Compliance reporting
- **Real-time Monitoring** - Live activity dashboard

### **Admin Monitoring**
- **Advanced Filtering** - Search by user, action, severity, date
- **Pagination** - Handle large datasets efficiently
- **Export Functionality** - Compliance and audit reports
- **Statistics Overview** - Activity trends and patterns
- **Security Alerts** - Failed login and suspicious activity detection

## 🎨 **UI/UX Design**

### **Professional Government Branding**
- **DGH Logo Integration** - Official branding throughout
- **Material Design** - Professional, accessible interface
- **Responsive Layout** - Mobile-first design approach
- **Government Colors** - Official blue theme (#1976d2)
- **Bilingual Support** - French and Arabic text

### **Enhanced Login Experience**
- **Centered Design** - Perfect vertical and horizontal centering
- **Gradient Background** - Professional blue gradient
- **Glass Morphism** - Modern semi-transparent effects
- **Large Logo Display** - Prominent DGH branding
- **Professional Typography** - Government-appropriate styling

### **Navigation & Layout**
- **Sidebar Navigation** - Role-based menu system
- **App Bar Integration** - Logo and user profile access
- **Mobile Responsive** - Drawer navigation on mobile
- **Breadcrumb Navigation** - Clear page hierarchy
- **Quick Actions** - Context-sensitive buttons

## 🚀 **Getting Started**

### **Prerequisites**
- **Java 17** - JDK installation
- **Node.js 18+** - Frontend development
- **Maven** - Backend build tool
- **PostgreSQL** - Production database (optional)

### **Backend Setup**
```bash
cd backend
mvn spring-boot:run
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

### **Default Credentials**
- **Admin**: `admin` / `admin123`
- **Technician**: `tech` / `tech123`
- **Employee**: `user` / `user123`

## 🔧 **Configuration**

### **Environment Variables**
```properties
# Database
spring.datasource.url=jdbc:h2:file:./data/dgh_helpdesk
spring.datasource.username=sa
spring.datasource.password=password

# LDAP Configuration
spring.ldap.urls=ldap://192.168.1.100:389
spring.ldap.base=dc=dgh,dc=local

# JWT Settings
app.jwtSecret=your-secret-key
app.jwtExpirationInMs=86400000
```

### **API Endpoints**

#### **Authentication**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

#### **Dashboard**
- `GET /api/dashboard/statistics` - System statistics
- `GET /api/dashboard/users/statistics` - User analytics
- `GET /api/dashboard/tickets/statistics` - Ticket metrics

#### **Activity Logs**
- `GET /api/activity-logs` - Paginated activity logs
- `GET /api/activity-logs/statistics` - Activity statistics
- `GET /api/activity-logs/export` - Export logs

#### **Users**
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### **Tickets**
- `GET /api/tickets` - List tickets
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/{id}` - Update ticket
- `PUT /api/tickets/{id}/assign` - Assign ticket
- `PUT /api/tickets/{id}/status` - Change status

## 📈 **Features Overview**

### **✅ Implemented Features**
- [x] **LDAP Authentication** - Secure government domain integration
- [x] **Role-Based Access Control** - Three distinct user roles
- [x] **Ticket Management** - Complete lifecycle management
- [x] **User Administration** - Full user management system
- [x] **Equipment Monitoring** - SNMP network discovery
- [x] **Activity Logging** - Comprehensive audit trail
- [x] **Dashboard Analytics** - Role-specific dashboards
- [x] **Responsive Design** - Mobile and tablet support
- [x] **DGH Branding** - Official logo and styling
- [x] **Security Features** - JWT tokens, IP tracking
- [x] **Export Capabilities** - Compliance reporting
- [x] **Real-time Updates** - Live data synchronization

### **🔄 In Progress**
- [ ] **Email Notifications** - Automated ticket updates
- [ ] **File Attachments** - Ticket file upload system
- [ ] **Advanced Reporting** - Custom report generation
- [ ] **Mobile App** - Native mobile application
- [ ] **API Documentation** - Swagger/OpenAPI specs

## 🔒 **Security Features**

### **Authentication & Authorization**
- **LDAP Integration** - Government domain authentication
- **JWT Tokens** - Secure session management
- **Role-Based Access** - Granular permission system
- **Session Tracking** - User activity correlation

### **Audit & Compliance**
- **Activity Logging** - Complete system audit trail
- **IP Address Tracking** - Access pattern monitoring
- **Security Alerts** - Suspicious activity detection
- **Export Capabilities** - Compliance reporting

### **Data Protection**
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content security policies
- **CSRF Protection** - Cross-site request forgery prevention

## 📱 **Responsive Design**

### **Device Support**
- **Desktop** - Full-featured interface
- **Tablet** - Optimized touch interface
- **Mobile** - Mobile-first responsive design

### **Accessibility**
- **WCAG Compliance** - Web accessibility standards
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - ARIA labels and descriptions
- **High Contrast** - Government accessibility requirements

## 🏛️ **Government Compliance**

### **Moroccan Government Standards**
- **Official Branding** - DGH logo and colors
- **Bilingual Support** - French and Arabic text
- **Security Standards** - Government security requirements
- **Audit Requirements** - Comprehensive logging system

### **Data Protection**
- **Local Storage** - Data sovereignty compliance
- **Access Controls** - Role-based permissions
- **Audit Trails** - Complete activity logging
- **Export Capabilities** - Compliance reporting

## 🤝 **Contributing**

### **Development Guidelines**
- **Code Standards** - Follow project coding conventions
- **Testing** - Unit and integration tests
- **Documentation** - Comprehensive code documentation
- **Security Review** - Security-focused code review

### **Project Structure**
```
dgh-helpdesk/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── ma/gov/dgh/helpdesk/
│   │       ├── controller/  # REST API controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access layer
│   │       ├── entity/      # JPA entities
│   │       └── config/      # Configuration classes
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-based modules
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
└── README.md               # Project documentation
```

## 📞 **Support**

### **Technical Support**
- **Documentation** - Comprehensive project documentation
- **API Reference** - Complete endpoint documentation
- **Troubleshooting** - Common issues and solutions
- **Security Updates** - Regular security patches

### **Contact Information**
- **Organization**: Direction Générale de l'Hydraulique
- **Ministry**: Ministry of Equipment and Water
- **Country**: Morocco
- **System**: DGH HelpDesk IT Support Management

---

**© 2024 Direction Générale de l'Hydraulique - Ministry of Equipment and Water, Morocco**

*Built with modern technologies for government IT support excellence.* 
