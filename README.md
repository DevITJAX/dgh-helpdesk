# DGH HelpDesk - IT Support Management System

**Direction Générale de l'Hydraulique** - Ministry of Equipment and Water, Morocco

A comprehensive IT helpdesk management system designed for government institutions, featuring role-based access control, ticket management, equipment monitoring, and comprehensive activity logging.

## 🏛️ **Project Overview**

The DGH HelpDesk is a modern, secure IT support management system built for the Moroccan Ministry of Equipment and Water. It provides a complete solution for managing IT support requests, user administration, equipment monitoring, and system auditing with government-grade security and compliance features.

### **Key Features**
- 🔐 **LDAP Authentication** - Secure government domain integration
- 👥 **Role-Based Access Control** - Admin, Technician, and Employee roles
- 🎫 **Ticket Management** - Complete lifecycle from creation to resolution
- 📊 **Real-time Dashboards** - Role-specific analytics and monitoring
- 🔍 **Activity Logging** - Comprehensive audit trail for security compliance
- 🖥️ **Equipment Monitoring** - SNMP-based network device discovery
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🏛️ **Government Compliance** - Moroccan government standards and branding

## 🏗️ **Architecture Deep Dive**

### **Technology Stack**

#### **Frontend Architecture**
- **React 18.2.0** - Modern functional components with hooks
- **Material-UI (MUI) v5** - Professional government-appropriate design system
- **React Router v6** - Client-side routing with protected routes
- **Axios** - HTTP client for API communication with interceptors
- **Recharts** - Data visualization for dashboards and analytics
- **React Context** - Global state management for authentication and user data
- **Custom Hooks** - Reusable logic for API calls and state management

#### **Backend Architecture**
- **Spring Boot 3.5.3** - Java-based REST API with modern Spring features
- **Java 17** - Latest LTS version with modern language features
- **Spring Security** - Comprehensive authentication and authorization
- **Spring Data JPA** - Database operations with Hibernate
- **H2 Database** - Development database with file persistence
- **PostgreSQL** - Production database support
- **LDAP Integration** - Active Directory authentication for government domain
- **JWT Tokens** - Secure session management with refresh tokens
- **SNMP4J** - Network device discovery and monitoring
- **Spring Actuator** - Health monitoring and metrics

### **Database Schema Analysis**

#### **Core Entities**

**User Entity** (`ma.gov.dgh.helpdesk.entity.User`)
```java
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_ldap_username", columnList = "ldap_username"),
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_department", columnList = "department")
})
```
- **LDAP Integration**: Synchronized with government Active Directory
- **Role Management**: ADMIN, TECHNICIAN, EMPLOYEE roles
- **Department Tracking**: Government department organization
- **Activity Tracking**: Last login and session management
- **Relationships**: One-to-many with tickets and comments

**Ticket Entity** (`ma.gov.dgh.helpdesk.entity.Ticket`)
```java
@Entity
@Table(name = "tickets", indexes = {
    @Index(name = "idx_ticket_status", columnList = "status"),
    @Index(name = "idx_ticket_priority", columnList = "priority"),
    @Index(name = "idx_ticket_category", columnList = "category"),
    @Index(name = "idx_ticket_created_by", columnList = "created_by"),
    @Index(name = "idx_ticket_assigned_to", columnList = "assigned_to"),
    @Index(name = "idx_ticket_equipment", columnList = "equipment_id"),
    @Index(name = "idx_ticket_created_at", columnList = "created_at")
})
```
- **Lifecycle Management**: Creation, assignment, resolution tracking
- **Priority System**: CRITICAL, HIGH, MEDIUM, LOW priorities
- **Status Tracking**: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- **SLA Management**: Due dates and escalation handling
- **Equipment Association**: Links to specific IT equipment
- **Time Tracking**: Estimated vs actual hours
- **Customer Satisfaction**: 1-5 rating system

**Equipment Entity** (`ma.gov.dgh.helpdesk.entity.Equipment`)
- **SNMP Monitoring**: Network device discovery and status
- **Inventory Management**: Asset tracking and categorization
- **Status Tracking**: ONLINE, OFFLINE, MAINTENANCE, RETIRED
- **Location Tracking**: Physical location and network location
- **Maintenance History**: Service records and warranty information

**ActivityLog Entity** (`ma.gov.dgh.helpdesk.entity.ActivityLog`)
- **Comprehensive Audit Trail**: All system activities logged
- **Security Events**: Login attempts, suspicious activities
- **User Actions**: Ticket operations, user management
- **IP Tracking**: Source IP address for security monitoring
- **Session Correlation**: Link activities to user sessions

#### **Enums & Types**

**UserRole** - Role-based access control
- `ADMIN` - Full system access and administration
- `TECHNICIAN` - Ticket resolution and equipment access
- `EMPLOYEE` - Ticket creation and status tracking

**TicketStatus** - Ticket lifecycle management
- `OPEN` - New ticket awaiting assignment
- `IN_PROGRESS` - Active work in progress
- `RESOLVED` - Completed with resolution
- `CLOSED` - Final closure after verification

**TicketPriority** - SLA and escalation management
- `CRITICAL` - Immediate attention required
- `HIGH` - Urgent business impact
- `MEDIUM` - Standard priority
- `LOW` - Non-urgent requests

**LogSeverity** - Activity log classification
- `ERROR` - System errors and failures
- `WARNING` - Potential issues and alerts
- `SUCCESS` - Successful operations
- `INFO` - General information and tracking

## 🎯 **Role-Based System Architecture**

### **Admin (ROLE_ADMIN) - Full System Control**

**Dashboard Features** (`AdminDashboard.js`)
- **Global Statistics**: System-wide metrics and trends
- **Ticket Distribution**: Visual charts and analytics
- **Technician Performance**: Individual and team metrics
- **Equipment Status**: Network device monitoring
- **Activity Log**: Real-time system audit trail
- **Quick Actions**: User creation, ticket assignment, reports

**System Management**
- **User Administration**: Create, edit, and manage all users
- **Role Assignment**: Assign and modify user roles
- **Department Management**: Organize users by government departments
- **System Configuration**: LDAP settings, SLA configuration
- **Security Monitoring**: Failed login detection and alerts

**Analytics & Reporting**
- **Performance Metrics**: Technician productivity analysis
- **SLA Compliance**: Service level agreement monitoring
- **Trend Analysis**: Historical data and forecasting
- **Export Capabilities**: Compliance and audit reports

### **Technician (ROLE_TECHNICIAN) - Support Operations**

**Dashboard Features** (`TechnicianDashboard.js`)
- **Personal Workload**: Assigned tickets and priorities
- **SLA Alerts**: Urgent ticket notifications
- **Performance Stats**: Resolution times and compliance
- **Recent Assignments**: Latest ticket updates
- **Weekly Trends**: Personal productivity analytics

**Operational Capabilities**
- **Ticket Resolution**: Handle assigned support requests
- **Equipment Access**: View-only equipment monitoring
- **Knowledge Base**: Access to technical documentation
- **Time Tracking**: Log hours spent on tickets
- **Communication**: Comment on tickets and update status

**Performance Tracking**
- **Resolution Metrics**: Average time to resolution
- **SLA Compliance**: Meeting service level agreements
- **Customer Satisfaction**: Rating tracking and improvement
- **Workload Management**: Balanced ticket distribution

### **Employee (ROLE_USER) - End User Interface**

**Dashboard Features** (`EmployeeDashboard.js`)
- **My Tickets**: Personal support request overview
- **Quick Creation**: Easy ticket submission
- **Status Updates**: Real-time ticket progress
- **Knowledge Base**: Self-service recommendations
- **Recent Activity**: Personal ticket history

**User Capabilities**
- **Ticket Creation**: Submit support requests
- **Status Tracking**: Monitor ticket progress
- **Communication**: Comment on tickets
- **Profile Management**: Update personal information
- **Self-Service**: Access knowledge base articles

## 📊 **Dashboard Architecture Analysis**

### **Admin Dashboard** (`AdminDashboard.js` - 43KB, 1150 lines)

**Component Structure**
```javascript
// Main dashboard with role-based rendering
<AdminDashboard>
  <StatisticsOverview />
  <TicketAnalytics />
  <TechnicianPerformance />
  <EquipmentMonitoring />
  <ActivityLog />
  <QuickActions />
</AdminDashboard>
```

**Key Features**
- **Real-time Statistics**: Live data updates via API polling
- **Interactive Charts**: Recharts integration for data visualization
- **Advanced Filtering**: Date ranges, departments, status filters
- **Export Functionality**: PDF and Excel report generation
- **Responsive Design**: Mobile-first approach with Material-UI

**Analytics Components**
- **Ticket Distribution**: Pie charts and bar graphs
- **Performance Metrics**: Line charts for trends
- **Equipment Status**: Real-time network monitoring
- **User Activity**: Heat maps and activity graphs

### **Technician Dashboard** (`TechnicianDashboard.js` - 14KB, 376 lines)

**Personalized Interface**
- **Workload Overview**: Assigned tickets with priorities
- **SLA Alerts**: Color-coded urgency indicators
- **Performance Tracking**: Personal metrics and goals
- **Quick Actions**: Status updates and time logging

**Productivity Features**
- **Time Tracking**: Log hours spent on tickets
- **SLA Monitoring**: Real-time deadline tracking
- **Communication Tools**: Quick comment and update features
- **Knowledge Access**: Integrated technical documentation

### **Employee Dashboard** (`EmployeeDashboard.js` - 7.3KB, 248 lines)

**User-Centric Design**
- **Ticket Overview**: Personal support request summary
- **Quick Creation**: Streamlined ticket submission
- **Status Tracking**: Visual progress indicators
- **Self-Service**: Knowledge base integration

## 🔍 **Activity Logging System Architecture**

### **Comprehensive Audit Trail** (`ActivityLog.java`)

**Log Categories**
- **Authentication Events**: Login, logout, failed attempts
- **Ticket Operations**: Creation, updates, assignments, resolution
- **User Management**: Account creation, updates, role changes
- **System Changes**: Configuration modifications
- **Security Events**: Suspicious activities and alerts
- **Equipment Discovery**: Network device monitoring

**Security Features**
- **IP Address Tracking**: Monitor access patterns and locations
- **Session Correlation**: Link activities to user sessions
- **Suspicious Activity Detection**: Multiple failed login alerts
- **Export Capabilities**: Compliance reporting and audit trails
- **Real-time Monitoring**: Live activity dashboard

**Admin Monitoring Interface**
- **Advanced Filtering**: Search by user, action, severity, date
- **Pagination**: Handle large datasets efficiently
- **Export Functionality**: Compliance and audit reports
- **Statistics Overview**: Activity trends and patterns
- **Security Alerts**: Failed login and suspicious activity detection

## 🎨 **UI/UX Design Architecture**

### **Professional Government Branding**

**Design System**
- **DGH Logo Integration**: Official branding throughout application
- **Material Design**: Professional, accessible interface
- **Responsive Layout**: Mobile-first design approach
- **Government Colors**: Official blue theme (#1976d2)
- **Bilingual Support**: French and Arabic text support

**Enhanced Login Experience** (`Login.js` - 9.6KB, 341 lines)
- **Centered Design**: Perfect vertical and horizontal centering
- **Gradient Background**: Professional blue gradient
- **Glass Morphism**: Modern semi-transparent effects
- **Large Logo Display**: Prominent DGH branding
- **Professional Typography**: Government-appropriate styling

**Navigation & Layout** (`Layout.js`)
- **Sidebar Navigation**: Role-based menu system
- **App Bar Integration**: Logo and user profile access
- **Mobile Responsive**: Drawer navigation on mobile
- **Breadcrumb Navigation**: Clear page hierarchy
- **Quick Actions**: Context-sensitive buttons

### **Component Architecture**

**Protected Routes** (`ProtectedRoute.js`, `RoleBasedRoute.js`)
```javascript
// Authentication and authorization middleware
<ProtectedRoute>
  <RoleBasedRoute requiredRole="ADMIN">
    <Component />
  </RoleBasedRoute>
</ProtectedRoute>
```

**Feature-Based Organization**
```
frontend/src/features/
├── auth/           # Authentication and user management
├── dashboard/      # Role-specific dashboards
├── tickets/        # Ticket management system
├── users/          # User administration (admin only)
├── equipment/      # Equipment monitoring
└── knowledge/      # Knowledge base system
```

## 🚀 **Getting Started**

### **Prerequisites**
- **Java 17** - JDK installation required
- **Node.js 18+** - Frontend development environment
- **Maven** - Backend build tool
- **PostgreSQL** - Production database (optional, H2 for development)

### **Backend Setup**
```bash
cd backend
mvn spring-boot:run
```

**Backend Configuration**
```properties
# Database Configuration
spring.datasource.url=jdbc:h2:file:./data/dgh_helpdesk
spring.datasource.username=sa
spring.datasource.password=password

# LDAP Configuration
spring.ldap.urls=ldap://192.168.1.100:389
spring.ldap.base=dc=dgh,dc=local

# JWT Settings
app.jwtSecret=your-secret-key
app.jwtExpirationInMs=86400000

# SNMP Configuration
snmp.community=public
snmp.timeout=3000
snmp.retries=2
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

**Frontend Configuration**
```javascript
// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Authentication Configuration
const AUTH_CONFIG = {
  tokenKey: 'dgh_auth_token',
  refreshTokenKey: 'dgh_refresh_token',
  tokenExpiry: 24 * 60 * 60 * 1000 // 24 hours
};
```

### **Default Credentials**
- **Admin**: `admin` / `admin123`
- **Technician**: `tech` / `tech123`
- **Employee**: `user` / `user123`

## ⚙️ CI/CD: GitHub Actions → Azure Container Registry (ACR) → Azure Container Instances (ACI)

This repository is wired for automated build and deploy on pushes to the `main` branch.

- Workflow: `.github/workflows/deploy.yml`
- Trigger: push to `main` (and manual Run workflow)
- What it does:
  - Builds Docker images for backend and frontend
  - Pushes to `myregistrydgh.azurecr.io` with tag `latest`
  - Logs in to Azure and restarts ACI:
    - Backend: `dgh-backend`
    - Frontend: `dgh-frontend`

Required GitHub repository secrets (Settings → Secrets and variables → Actions):
- `ACR_LOGIN_SERVER` = `myregistrydgh.azurecr.io`
- `ACR_USERNAME` = ACR admin username
- `ACR_PASSWORD` = ACR admin password (rotate if exposed)
- `AZURE_CREDENTIALS` = Output JSON from `az ad sp create-for-rbac --sdk-auth` (scoped to RG `DGH`)
- `RESOURCE_GROUP` = `DGH`
- `ACI_BACKEND_NAME` = `dgh-backend`
- `ACI_FRONTEND_NAME` = `dgh-frontend`
- `FRONTEND_API_URL` = `http://dgh-backend-unique.eastus.azurecontainer.io:8080`

Notes:
- React API URL is baked at build time via `REACT_APP_API_BASE_URL`. Update the secret if the backend URL changes.
- Docker Desktop is not required for CI/CD; actions run on GitHub runners.
- `docker-compose.yml` is optional for local development only.

## 🔧 **API Architecture**

### **RESTful Endpoints**

#### **Authentication** (`AuthController.java`)
```java
POST /api/auth/login          // User authentication
POST /api/auth/logout         // User logout
POST /api/auth/refresh        // Token refresh
GET  /api/auth/me            // Current user info
```

#### **Dashboard** (`DashboardController.java`)
```java
GET /api/dashboard/statistics           // System statistics
GET /api/dashboard/users/statistics     // User analytics
GET /api/dashboard/tickets/statistics   // Ticket metrics
GET /api/dashboard/equipment/status     // Equipment monitoring
```

#### **Activity Logs** (`ActivityLogController.java`)
```java
GET /api/activity-logs                  // Paginated activity logs
GET /api/activity-logs/statistics       // Activity statistics
GET /api/activity-logs/export          // Export logs
POST /api/activity-logs                 // Create log entry
```

#### **Users** (`UserController.java`)
```java
GET    /api/users                      // List all users
POST   /api/users                      // Create new user
PUT    /api/users/{id}                 // Update user
DELETE /api/users/{id}                 // Delete user
GET    /api/users/{id}/tickets         // User's tickets
```

#### **Tickets** (`TicketController.java`)
```java
GET    /api/tickets                    // List tickets
POST   /api/tickets                    // Create ticket
PUT    /api/tickets/{id}               // Update ticket
PUT    /api/tickets/{id}/assign        // Assign ticket
PUT    /api/tickets/{id}/status        // Change status
GET    /api/tickets/{id}/comments      // Ticket comments
POST   /api/tickets/{id}/comments      // Add comment
```

#### **Equipment** (`EquipmentController.java`)
```java
GET    /api/equipment                  // List equipment
POST   /api/equipment                  // Add equipment
PUT    /api/equipment/{id}             // Update equipment
DELETE /api/equipment/{id}             // Delete equipment
GET    /api/equipment/status           // Equipment status
```

#### **Network Discovery** (`NetworkDiscoveryController.java`)
```java
GET /api/network/discover              // Discover network devices
GET /api/network/scan                  // Scan network range
GET /api/network/devices               // List discovered devices
```

## 📈 **Features Implementation Status**

### **✅ Fully Implemented Features**

**Authentication & Security**
- [x] **LDAP Integration** - Government domain authentication
- [x] **JWT Token Management** - Secure session handling
- [x] **Role-Based Access Control** - Granular permissions
- [x] **Session Tracking** - User activity correlation
- [x] **Security Alerts** - Failed login detection

**Ticket Management**
- [x] **Complete Lifecycle** - Creation to resolution
- [x] **Priority System** - CRITICAL, HIGH, MEDIUM, LOW
- [x] **Status Tracking** - OPEN, IN_PROGRESS, RESOLVED, CLOSED
- [x] **Assignment System** - Technician assignment
- [x] **Comment System** - Ticket communication
- [x] **SLA Management** - Due dates and escalation
- [x] **Time Tracking** - Estimated vs actual hours
- [x] **Customer Satisfaction** - Rating system

**User Management**
- [x] **User Administration** - Full CRUD operations
- [x] **Role Management** - ADMIN, TECHNICIAN, EMPLOYEE
- [x] **Department Organization** - Government structure
- [x] **Profile Management** - Personal information updates
- [x] **Activity Tracking** - Login history and actions

**Equipment Monitoring**
- [x] **SNMP Integration** - Network device discovery
- [x] **Inventory Management** - Asset tracking
- [x] **Status Monitoring** - Real-time device status
- [x] **Location Tracking** - Physical and network location
- [x] **Maintenance Records** - Service history

**Dashboard & Analytics**
- [x] **Role-Specific Dashboards** - Admin, Technician, Employee
- [x] **Real-time Statistics** - Live data updates
- [x] **Performance Metrics** - Productivity analytics
- [x] **SLA Monitoring** - Compliance tracking
- [x] **Export Capabilities** - Report generation

**Activity Logging**
- [x] **Comprehensive Audit Trail** - All system activities
- [x] **Security Events** - Authentication and authorization
- [x] **User Actions** - Ticket and user operations
- [x] **System Changes** - Configuration modifications
- [x] **Export Functionality** - Compliance reporting

**UI/UX Features**
- [x] **Responsive Design** - Mobile, tablet, desktop
- [x] **Material-UI Integration** - Professional design
- [x] **DGH Branding** - Official logo and colors
- [x] **Bilingual Support** - French and Arabic
- [x] **Accessibility** - WCAG compliance

### **🔄 Planned Features**

**Advanced Features**
- [ ] **Email Notifications** - Automated ticket updates
- [ ] **File Attachments** - Ticket file upload system
- [ ] **Advanced Reporting** - Custom report generation
- [ ] **Mobile App** - Native mobile application
- [ ] **API Documentation** - Swagger/OpenAPI specs

**Integration Features**
- [ ] **SMS Notifications** - Text message alerts
- [ ] **Calendar Integration** - Schedule management
- [ ] **Third-party Integrations** - External system connections
- [ ] **Advanced Analytics** - Machine learning insights

## 🔒 **Security Architecture**

### **Authentication & Authorization**

**LDAP Integration**
```java
// LDAP Configuration
@Configuration
@EnableLdapRepositories
public class LdapConfig {
    @Value("${spring.ldap.urls}")
    private String ldapUrl;
    
    @Value("${spring.ldap.base}")
    private String ldapBase;
}
```

**JWT Token Management**
```java
// JWT Configuration
@Component
public class JwtTokenProvider {
    @Value("${app.jwtSecret}")
    private String jwtSecret;
    
    @Value("${app.jwtExpirationInMs}")
    private long jwtExpirationInMs;
}
```

**Role-Based Security**
```java
// Security Configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/technician/**").hasAnyRole("ADMIN", "TECHNICIAN")
                .anyRequest().authenticated()
            )
            .build();
    }
}
```

### **Audit & Compliance**

**Activity Logging**
```java
// Activity Log Entity
@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    @Enumerated(EnumType.STRING)
    private LogSeverity severity;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "session_id")
    private String sessionId;
}
```

**Security Monitoring**
- **IP Address Tracking** - Monitor access patterns
- **Session Correlation** - Link activities to user sessions
- **Suspicious Activity Detection** - Multiple failed login alerts
- **Export Capabilities** - Compliance reporting
- **Real-time Monitoring** - Live activity dashboard

### **Data Protection**

**Input Validation**
```java
// Validation Annotations
@NotBlank(message = "Title is required")
@Size(max = 255, message = "Title must not exceed 255 characters")
private String title;

@Email(message = "Email should be valid")
@Size(max = 255, message = "Email must not exceed 255 characters")
private String email;
```

**SQL Injection Prevention**
- **Parameterized Queries** - JPA/Hibernate ORM
- **Input Sanitization** - Server-side validation
- **Prepared Statements** - Database security

**XSS Protection**
- **Content Security Policies** - CSP headers
- **Input Encoding** - HTML entity encoding
- **Output Sanitization** - React XSS protection

## 📱 **Responsive Design Architecture**

### **Device Support**

**Desktop Interface**
- **Full-featured Interface** - Complete functionality
- **Multi-column Layout** - Efficient space utilization
- **Advanced Controls** - Keyboard shortcuts and shortcuts
- **Large Data Tables** - Comprehensive information display

**Tablet Interface**
- **Optimized Touch Interface** - Touch-friendly controls
- **Adaptive Layout** - Responsive grid system
- **Gesture Support** - Swipe and touch gestures
- **Medium Data Display** - Balanced information density

**Mobile Interface**
- **Mobile-first Design** - Progressive enhancement
- **Single-column Layout** - Vertical information flow
- **Touch-optimized Controls** - Large touch targets
- **Minimal Data Display** - Essential information only

### **Accessibility Features**

**WCAG Compliance**
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - ARIA labels and descriptions
- **High Contrast** - Government accessibility requirements
- **Focus Management** - Clear focus indicators

**Government Standards**
- **Official Branding** - DGH logo and colors
- **Bilingual Support** - French and Arabic text
- **Security Standards** - Government security requirements
- **Audit Requirements** - Comprehensive logging system

## 🏛️ **Government Compliance**

### **Moroccan Government Standards**

**Official Branding**
- **DGH Logo Integration**: Official branding throughout
- **Government Colors**: Official blue theme (#1976d2)
- **Professional Typography**: Government-appropriate styling
- **Bilingual Support**: French and Arabic text

**Security Requirements**
- **LDAP Integration** - Government domain authentication
- **Role-Based Access** - Granular permission system
- **Audit Trails** - Complete activity logging
- **Data Sovereignty** - Local data storage compliance

**Compliance Features**
- **Activity Logging** - Comprehensive audit trail
- **Export Capabilities** - Compliance reporting
- **Security Monitoring** - Real-time threat detection
- **Access Controls** - Role-based permissions

## 🤝 **Contributing**

### **Development Guidelines**

**Code Standards**
- **Java 17** - Modern Java features and best practices
- **React 18** - Functional components and hooks
- **Material-UI** - Consistent design system
- **TypeScript** - Type safety and better development experience

**Testing Strategy**
- **Unit Tests** - JUnit for backend, Jest for frontend
- **Integration Tests** - API endpoint testing
- **Component Tests** - React component testing
- **Security Tests** - Authentication and authorization testing

**Documentation**
- **Code Documentation** - Comprehensive JavaDoc and JSDoc
- **API Documentation** - REST endpoint documentation
- **Architecture Documentation** - System design and patterns
- **User Documentation** - End-user guides and tutorials

### **Project Structure**

```
dgh-helpdesk/
├── backend/                          # Spring Boot application
│   ├── src/main/java/
│   │   └── ma/gov/dgh/helpdesk/
│   │       ├── controller/           # REST API controllers
│   │       │   ├── AuthController.java
│   │       │   ├── DashboardController.java
│   │       │   ├── TicketController.java
│   │       │   ├── UserController.java
│   │       │   ├── EquipmentController.java
│   │       │   └── ActivityLogController.java
│   │       ├── service/              # Business logic layer
│   │       │   ├── AuthService.java
│   │       │   ├── TicketService.java
│   │       │   ├── UserService.java
│   │       │   └── EquipmentService.java
│   │       ├── repository/           # Data access layer
│   │       │   ├── UserRepository.java
│   │       │   ├── TicketRepository.java
│   │       │   └── EquipmentRepository.java
│   │       ├── entity/               # JPA entities
│   │       │   ├── User.java
│   │       │   ├── Ticket.java
│   │       │   ├── Equipment.java
│   │       │   └── ActivityLog.java
│   │       ├── config/               # Configuration classes
│   │       │   ├── SecurityConfig.java
│   │       │   ├── LdapConfig.java
│   │       │   └── JwtConfig.java
│   │       ├── security/             # Security components
│   │       │   ├── JwtTokenProvider.java
│   │       │   └── CustomUserDetailsService.java
│   │       └── utils/                # Utility classes
│   │           ├── NetworkDiscovery.java
│   │           └── SnmpUtils.java
│   └── src/main/resources/
│       ├── application.properties     # Configuration
│       └── data.sql                  # Initial data
├── frontend/                         # React application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Login.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── RoleBasedRoute.js
│   │   │   └── common/
│   │   │       ├── Layout.js
│   │   │       ├── Header.js
│   │   │       └── Sidebar.js
│   │   ├── features/                 # Feature-based modules
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── Profile.js
│   │   │   │   └── AuthContext.js
│   │   │   ├── dashboard/            # Dashboards
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── TechnicianDashboard.js
│   │   │   │   └── EmployeeDashboard.js
│   │   │   ├── tickets/              # Ticket management
│   │   │   │   ├── Tickets.js
│   │   │   │   ├── TicketForm.js
│   │   │   │   └── TicketDetails.js
│   │   │   ├── users/                # User administration
│   │   │   │   ├── Users.js
│   │   │   │   └── UserForm.js
│   │   │   ├── equipment/            # Equipment monitoring
│   │   │   │   ├── Equipment.js
│   │   │   │   └── EquipmentDetails.js
│   │   │   └── knowledge/            # Knowledge base
│   │   │       └── Knowledge.js
│   │   ├── services/                 # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── ticketService.js
│   │   │   └── userService.js
│   │   ├── contexts/                 # React contexts
│   │   │   └── AuthContext.js
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── utils/                    # Utility functions
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── theme/                    # Material-UI theme
│   │   │   └── index.js
│   │   └── types/                    # TypeScript types
│   │       └── index.ts
│   ├── public/                       # Static assets
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── dgh_logo.png
│   ├── package.json                  # Dependencies
│   └── tsconfig.json                 # TypeScript config
├── data/                             # Data directory
│   └── dgh_helpdesk.mv.db           # H2 database file
├── .gitignore                        # Git ignore rules
└── README.md                         # Project documentation
```

## 📞 **Support & Contact**

### **Technical Support**

**Documentation**
- **API Reference** - Complete endpoint documentation
- **User Guides** - Role-specific user manuals
- **Troubleshooting** - Common issues and solutions
- **Security Updates** - Regular security patches

**Development Support**
- **Code Documentation** - Comprehensive inline documentation
- **Architecture Guides** - System design documentation
- **Best Practices** - Development guidelines
- **Security Guidelines** - Security-focused development

### **Contact Information**

**Organization**: Direction Générale de l'Hydraulique  
**Ministry**: Ministry of Equipment and Water  
**Country**: Morocco  
**System**: DGH HelpDesk IT Support Management  
**Version**: 1.0.0  
**Last Updated**: 2025

---

**© 2025 Direction Générale de l'Hydraulique - Ministry of Equipment and Water, Morocco**

*Built with modern technologies for government IT support excellence, featuring comprehensive security, role-based access control, and government compliance standards.*
