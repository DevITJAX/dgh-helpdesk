# Cursor Rule: DGH HelpDesk Project Structure & Conventions

- **Full-stack IT helpdesk system for the Moroccan Ministry of Equipment and Water**
- **Backend:** Java 17, Spring Boot 3.5.3, organized by domain (controller, service, repository, entity, dto, exception, security, validation). RESTful API, all endpoints under `/api/`. Features: LDAP/JWT auth (in-memory), role-based access (ADMIN, TECHNICIAN, USER), ticket/user/equipment management, dashboard, network discovery. Security: JWT in memory, HTTPS in prod, input validation, route guards.
- **Frontend:** React 18, JavaScript (not TypeScript), Material-UI v5 (sx prop only), React Context/useReducer, Axios, React Router v6, Vite. Strict folder structure: components, features, hooks, services, types, contexts, utils, constants. UI/UX: MUI only, no custom CSS/Tailwind, government branding, Arabic/French support, responsive, accessibility.
- **Development Standards:** ESLint, Prettier, feature branches, code review, React Testing Library, accessibility tests. High priority: ticket management module.
- **All code and contributions must follow these conventions for consistency, maintainability, and government standards.**

---

# 📋 DGH HelpDesk - Complete Project Index

> **Last Updated**: July 20, 2025  
> **Version**: 1.0.0  
> **Status**: ~70% Complete (Backend Infrastructure Complete, Frontend Core Components Done)

## 🎯 **Project Overview**

**DGH HelpDesk** is a comprehensive IT helpdesk management system designed for the Moroccan government's Ministry of Equipment and Water (وزارة التجهيز والماء). It's a full-stack application inspired by Zammad but tailored for government requirements.

### **Technology Stack**
- **Backend**: Java 17 + Spring Boot 3.5.3
- **Frontend**: Angular 18 + TypeScript 5.5
- **Database**: H2 (development) / PostgreSQL (production)
- **Authentication**: LDAP/Active Directory integration
- **UI**: Angular Material + PrimeNG (Pure Material Design)
- **Network Discovery**: SNMP4J, NMAP integration

### **Key Statistics**
- **Backend**: 90+ Java files
- **Frontend**: 74+ TypeScript files
- **Entities**: 11 JPA entities with relationships
- **Controllers**: 8 REST controllers
- **Services**: 6 business logic services
- **Angular Modules**: 6 feature modules

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Angular Frontend  │    │  Spring Boot API    │    │    H2 Database      │
│   (Port 4200)       │◄──►│   (Port 8080)       │◄──►│  + LDAP Server      │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
         │                           │                           │
    ┌─────────┐              ┌─────────────┐            ┌─────────────┐
    │Material │              │Spring       │            │Network      │
    │PrimeNG  │              │Security     │            │Discovery    │
    │         │              │JPA/Hibernate│            │SNMP/NMAP    │
    └─────────┘              └─────────────┘            └─────────────┘
```

---

## 📊 **Implementation Status**

### ✅ **Backend - COMPLETE (95%)**

#### **Infrastructure & Configuration**
- ✅ Spring Boot 3.5.3 setup with Maven
- ✅ Multi-profile configuration (dev/prod)
- ✅ H2 database with JPA/Hibernate
- ✅ CORS configuration for Angular
- ✅ Global exception handling
- ✅ Application startup validation

#### **Security & Authentication**
- ✅ LDAP integration with Active Directory
- ✅ Custom authentication provider
- ✅ Role-based authorization (ADMIN, TECHNICIAN, USER)
- ✅ Development in-memory users
- ✅ Method-level security annotations

#### **Entity Models (11 Entities)**
- ✅ `User` - Government employees with LDAP sync
- ✅ `Ticket` - Helpdesk tickets with full lifecycle
- ✅ `TicketComment` - Audit trail and communication
- ✅ `Equipment` - IT assets with network discovery
- ✅ Enums: `UserRole`, `TicketStatus`, `TicketPriority`, `TicketCategory`, `EquipmentType`, `EquipmentStatus`, `CommentType`

#### **Data Access Layer**
- ✅ Spring Data JPA repositories
- ✅ Custom query methods for statistics
- ✅ Complex filtering capabilities
- ✅ LDAP synchronization queries

#### **Business Logic Services**
- ✅ `UserService` - LDAP sync, role management, statistics
- ✅ `TicketService` - Complete lifecycle, escalation, audit
- ✅ `EquipmentService` - Inventory, network discovery
- ✅ `NetworkDiscoveryService` - SNMP scanning, automation
- ✅ `DatabaseService` - Schema validation, maintenance

#### **REST API Controllers**
- ✅ `AuthController` - Authentication endpoints
- ✅ `UserController` - User CRUD operations
- ✅ `TicketController` - Ticket lifecycle management
- ✅ `EquipmentController` - Equipment inventory
- ✅ `DashboardController` - Statistics and analytics
- ✅ `HealthController` - System monitoring
- ✅ `NetworkDiscoveryController` - Network scanning

#### **Advanced Features**
- ✅ SNMP4J network discovery
- ✅ Async processing for background tasks
- ✅ Comprehensive validation
- ✅ Structured logging
- ✅ Database cleanup operations

### ✅ **Frontend - CORE COMPLETE (60%)**

#### **Project Structure & Configuration**
- ✅ Angular 18 with TypeScript
- ✅ Feature-based module architecture
- ✅ Lazy loading routes
- ✅ Angular Material + PrimeNG setup
- ✅ Tailwind CSS removed - Pure Material Design

#### **Authentication & Security**
- ✅ `AuthService` with token management
- ✅ `AuthGuard` for route protection
- ✅ Login component with LDAP form
- ✅ Role-based access control

#### **Core Modules & Components**
- ✅ `AppModule` - Main application
- ✅ `LayoutModule` - Shared layouts
- ✅ `LoginModule` - Authentication
- ✅ `DashboardModule` - Statistics overview
- ✅ `UsersModule` - User management
- ✅ `TicketsModule` - Ticket management

#### **UI Components**
- ✅ Main layout with responsive navigation
- ✅ Dashboard with admin statistics
- ✅ User list with data tables
- ✅ User dialog forms (create/edit)
- ✅ Ticket list component
- ✅ Delete confirmation dialogs

#### **Services & Models**
- ✅ TypeScript interfaces for all data models
- ✅ HTTP services with error handling
- ✅ `UserService` for user operations
- ✅ `TicketService` for ticket operations
- ✅ `DashboardService` for statistics

---

## 🗂️ **Complete File Structure**

### **Backend Structure**
```
backend/
├── pom.xml                              # Maven dependencies
├── src/main/java/ma/gov/dgh/helpdesk/
│   ├── dgh_helpdesk/
│   │   └── DghHelpdeskApplication.java  # Main Spring Boot app
│   ├── config/                          # Configuration classes
│   │   ├── AsyncConfig.java
│   │   ├── DevelopmentSecurityConfig.java
│   │   └── SimpleSecurityConfig.java
│   ├── controller/                      # REST Controllers (8)
│   │   ├── AuthController.java          # Authentication
│   │   ├── DashboardController.java     # Statistics
│   │   ├── DatabaseController.java      # DB operations
│   │   ├── EquipmentController.java     # Equipment CRUD
│   │   ├── HealthController.java        # Health checks
│   │   ├── NetworkDiscoveryController.java # Network scanning
│   │   ├── TestController.java          # Testing endpoints
│   │   ├── TicketController.java        # Ticket CRUD
│   │   └── UserController.java          # User CRUD
│   ├── dto/                            # Data Transfer Objects
│   │   └── UserAdminDto.java
│   ├── entity/                         # JPA Entities (11)
│   │   ├── CommentType.java            # Enum
│   │   ├── Equipment.java              # IT assets
│   │   ├── EquipmentStatus.java        # Enum
│   │   ├── EquipmentType.java          # Enum
│   │   ├── Ticket.java                 # Helpdesk tickets
│   │   ├── TicketCategory.java         # Enum
│   │   ├── TicketComment.java          # Comments/audit
│   │   ├── TicketPriority.java         # Enum
│   │   ├── TicketStatus.java           # Enum
│   │   ├── User.java                   # Government employees
│   │   └── UserRole.java               # Enum
│   ├── exception/                      # Exception handling
│   │   ├── BusinessException.java
│   │   ├── GlobalExceptionHandler.java
│   │   └── GlobalExceptionLogger.java
│   ├── repository/                     # Data access layer
│   │   ├── EquipmentRepository.java
│   │   ├── TicketCommentRepository.java
│   │   ├── TicketRepository.java
│   │   └── UserRepository.java
│   ├── security/                       # Security configuration
│   │   ├── CustomLdapAuthenticationProvider.java
│   │   ├── CustomUserDetails.java
│   │   └── CustomUserDetailsService.java
│   ├── service/                        # Business logic (6)
│   │   ├── DatabaseService.java        # DB maintenance
│   │   ├── EquipmentService.java       # Equipment management
│   │   ├── NetworkDiscoveryService.java # Network scanning
│   │   ├── SnmpService.java            # SNMP operations
│   │   ├── TicketService.java          # Ticket lifecycle
│   │   └── UserService.java            # User management
│   └── validation/                     # Custom validators
│       ├── ValidationUtils.java
│       ├── ValidIpAddress.java
│       └── ValidMacAddress.java
├── src/main/resources/
│   ├── application.properties          # Main config
│   ├── application-dev.properties      # Development
│   ├── application-prod.properties     # Production
│   ├── data.sql                        # Sample data
│   └── schema-validation.sql           # DB validation
└── src/test/java/                      # Test classes
```

### **Frontend Structure**
```
frontend/
├── package.json                        # npm dependencies
├── angular.json                        # Angular CLI config
├── tsconfig.json                       # TypeScript config
├── src/
│   ├── main.ts                         # Bootstrap
│   ├── index.html                      # Main HTML
│   ├── styles.css                      # Global styles
│   ├── environments/                   # Environment configs
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/images/                  # DGH logos
│   │   ├── dgh_logo.png
│   │   ├── dgh-logo.svg
│   │   └── dgh-logo-small.svg
│   └── app/
│       ├── app.component.ts            # Root component
│       ├── app.module.ts               # Main module
│       ├── app-routing.module.ts       # Routes
│       ├── app.routes.ts               # Route definitions
│       ├── core/                       # Core services
│       │   ├── guards/
│       │   │   └── auth.guard.ts       # Route protection
│       │   ├── models/                 # TypeScript interfaces
│       │   │   ├── ticket.model.ts     # Ticket interfaces
│       │   │   └── user.model.ts       # User interfaces
│       │   └── services/               # HTTP services
│       │       ├── auth.service.ts     # Authentication
│       │       ├── ticket.service.ts   # Ticket operations
│       │       └── user.service.ts     # User operations
│       ├── features/                   # Feature modules
│       │   ├── dashboard/              # Dashboard module
│       │   │   ├── admin-dashboard.component.ts
│       │   │   ├── dashboard-layout.component.ts
│       │   │   ├── dashboard.component.ts
│       │   │   ├── dashboard.module.ts
│       │   │   └── dashboard.service.ts
│       │   ├── equipment/
│       │   │   └── equipment.routes.ts # Routes only
│       │   ├── login/                  # Authentication module
│       │   │   ├── login.component.ts
│       │   │   └── login.module.ts
│       │   ├── tickets/                # Ticket management
│       │   │   ├── delete-ticket-dialog/
│       │   │   ├── ticket-list/
│       │   │   │   └── ticket-list.component.ts
│       │   │   ├── tickets.module.ts
│       │   │   └── tickets.routes.ts
│       │   └── users/                  # User management
│       │       ├── delete-user-dialog/
│       │       ├── user-dialog/
│       │       ├── user-list/
│       │       │   └── user-list.component.ts
│       │       └── users.module.ts
│       └── layout/                     # Shared layouts
│           ├── index.ts
│           ├── layout.module.ts
│           └── main-layout/
│               └── main-layout.component.ts
```

---

## 📋 **Key Dependencies**

### **Backend Maven Dependencies**
```xml
<!-- Spring Boot Core -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- LDAP Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-ldap</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>

<!-- Network Discovery -->
<dependency>
    <groupId>org.snmp4j</groupId>
    <artifactId>snmp4j</artifactId>
    <version>3.7.7</version>
</dependency>
```

### **Frontend npm Dependencies**
```json
{
  "dependencies": {
    "@angular/core": "^18.0.0",
    "@angular/material": "^18.0.0",
    "primeng": "^17.3.0",
    "rxjs": "^7.8.1"
  }
}
```

---

## 🚀 **Next Development Priorities**

### **🔥 High Priority (Complete These Next)**
1. **Ticket Management UI**
   - ❌ Ticket creation/editing forms
   - ❌ Comment system implementation
   - ❌ Assignment workflow UI
   - ❌ Status change interface

2. **Enhanced Dashboard**
   - ❌ Real-time statistics charts
   - ❌ Performance metrics visualization
   - ❌ Quick action buttons

3. **Equipment Management**
   - ❌ Equipment list component
   - ❌ Network discovery UI
   - ❌ Equipment details forms

### **🔶 Medium Priority**
1. **Reporting System**
2. **Notification System**
3. **Advanced Filtering**
4. **Bulk Operations**

### **🔷 Low Priority**
1. **Mobile App**
2. **API Documentation**
3. **Advanced Analytics**

---

## 💻 **Quick Start Commands**

```bash
# Backend (Terminal 1)
cd backend
mvnw.cmd spring-boot:run

# Frontend (Terminal 2)
cd frontend
npm install
npm start

# Access Points
# Frontend: http://localhost:4200
# Backend API: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

### **Default Development Users**
- **Admin**: username=`admin`, password=`admin123`
- **User**: username=`user`, password=`user123`
- **Helpdesk Admin**: username=`helpdesk-admin`, password=`helpdesk123`

---

## 🔐 **Security Configuration**

### **Development Environment**
- In-memory authentication enabled
- LDAP disabled (`spring.ldap.enabled=false`)
- H2 console accessible
- Debug logging enabled

### **Production Environment**
- LDAP authentication against `dgh.local`
- Secure session cookies
- Reduced logging levels
- Network discovery enabled

### **LDAP Configuration**
```properties
# Production LDAP Settings
spring.ldap.urls=ldap://192.168.1.100:389
spring.ldap.base=dc=dgh,dc=local
spring.security.ldap.user-search-filter=(sAMAccountName={0})
```

---

## 📈 **API Endpoints Summary**

### **Authentication**
- `POST /api/auth/login` - LDAP authentication
- `POST /api/auth/logout` - Logout

### **Users**
- `GET /api/users` - List users with filtering
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### **Tickets**
- `GET /api/tickets` - List tickets with pagination
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/{id}` - Update ticket
- `PUT /api/tickets/{id}/assign` - Assign ticket
- `PUT /api/tickets/{id}/status` - Change status
- `PUT /api/tickets/{id}/escalate` - Escalate ticket

### **Equipment**
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Add equipment
- `POST /api/equipment/discover` - Start discovery

### **Dashboard**
- `GET /api/dashboard/statistics` - Overall stats
- `GET /api/dashboard/users/statistics` - User stats
- `GET /api/dashboard/tickets/statistics` - Ticket stats

---

## 🏷️ **Project Metadata**

- **Repository**: `https://github.com/DevITJAX/dgh-helpdesk`
- **Branch**: `main`
- **Owner**: DevITJAX
- **License**: Not specified
- **Language**: Java (Backend), TypeScript (Frontend)
- **Framework**: Spring Boot 3.5.3, Angular 18
- **Database**: H2 (embedded)
- **Build Tool**: Maven (Backend), npm (Frontend)

---

## 💡 **Notes for Future Development**

1. **Architecture is solid** - Well-structured with proper separation of concerns
2. **Backend is nearly complete** - All major functionality implemented
3. **Frontend uses pure Material Design** - Consistent UI with Angular Material
4. **LDAP integration ready** - Just needs production LDAP server
5. **Network discovery functional** - SNMP scanning capabilities built
6. **Security properly configured** - Role-based access implemented
7. **Database schema mature** - All relationships and indexes defined

**Next developer should focus on completing the Angular forms and UI components.**

---

*This index file serves as a comprehensive reference for understanding the DGH HelpDesk project structure, implementation status, and development roadmap.*
