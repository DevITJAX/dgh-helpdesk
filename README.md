# DGH HelpDesk - IT Support Management System

**Direction Générale de l'Hydraulique** - Ministry of Equipment and Water, Morocco

A comprehensive IT helpdesk management system designed for government institutions, featuring role-based access control, ticket management, equipment monitoring, and comprehensive activity logging.

## 🏛️ Project Overview

The DGH HelpDesk is a modern, secure IT support management system built for the Moroccan Ministry of Equipment and Water. It provides a complete solution for managing IT support requests, user administration, equipment monitoring, and system auditing with government-grade security and compliance features.

### Key Features
- **LDAP Authentication** - Secure government domain integration
- **Role-Based Access Control** - Admin, Technician, and Employee roles
- **Ticket Management** - Complete lifecycle from creation to resolution
- **Real-time Dashboards** - Role-specific analytics and monitoring
- **Activity Logging** - Comprehensive audit trail for security compliance
- **Equipment Monitoring** - SNMP-based network device discovery
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Government Compliance** - Moroccan government standards and branding

## 🏗️ Architecture Overview

### Technology Stack

#### Frontend
- **React 18.2.0** - Modern functional components with hooks
- **Material-UI (MUI) v5** - Professional government-appropriate design system
- **React Router v6** - Client-side routing with protected routes
- **Axios** - HTTP client for API communication with interceptors
- **Recharts** - Data visualization for dashboards and analytics
- **React Context** - Global state management for authentication and user data

#### Backend
- **Spring Boot 3.5.3** - Java-based REST API with modern Spring features
- **Java 17** - Latest LTS version with modern language features
- **Spring Security** - Comprehensive authentication and authorization
- **Spring Data JPA** - Database operations with Hibernate
- **H2 Database** - Development database with file persistence
- **PostgreSQL** - Production database support
- **LDAP Integration** - Active Directory authentication for government domain
- **JWT Tokens** - Secure session management with refresh tokens
- **SNMP4J** - Network device discovery and monitoring

### System Architecture

The system follows a modern microservices-inspired architecture with clear separation of concerns:

- **Presentation Layer** - React-based frontend with Material-UI components
- **API Layer** - RESTful Spring Boot controllers with comprehensive validation
- **Business Logic Layer** - Service classes implementing business rules
- **Data Access Layer** - Repository pattern with JPA/Hibernate
- **Security Layer** - Spring Security with LDAP integration and JWT tokens
- **Monitoring Layer** - Spring Actuator for health checks and metrics

## 🎯 Role-Based System Design

### Admin Role (ROLE_ADMIN)
- **System Administration** - Full access to all system features
- **User Management** - Create, edit, and manage all users and roles
- **Global Analytics** - System-wide statistics and performance metrics
- **Security Monitoring** - Activity logs and security event tracking
- **Configuration Management** - System settings and LDAP configuration

### Technician Role (ROLE_TECHNICIAN)
- **Ticket Resolution** - Handle assigned support requests
- **Equipment Access** - View and monitor IT equipment status
- **Performance Tracking** - Personal metrics and SLA compliance
- **Knowledge Base** - Access to technical documentation
- **Time Management** - Log hours spent on ticket resolution

### Employee Role (ROLE_USER)
- **Ticket Creation** - Submit support requests and track progress
- **Self-Service** - Access knowledge base and common solutions
- **Communication** - Comment on tickets and receive updates
- **Profile Management** - Update personal information and preferences

## 📊 Dashboard System

### Admin Dashboard
- **System Statistics** - Real-time metrics and performance indicators
- **Ticket Analytics** - Distribution, trends, and SLA compliance
- **Technician Performance** - Individual and team productivity metrics
- **Equipment Monitoring** - Network device status and health
- **Activity Logs** - Comprehensive audit trail and security events
- **Quick Actions** - Rapid user creation and ticket management

### Technician Dashboard
- **Workload Overview** - Assigned tickets with priority indicators
- **SLA Alerts** - Urgent ticket notifications and deadline tracking
- **Performance Metrics** - Personal productivity and compliance stats
- **Recent Activity** - Latest ticket updates and assignments
- **Time Tracking** - Hours logged and productivity analysis

### Employee Dashboard
- **My Tickets** - Personal support request overview and status
- **Quick Creation** - Streamlined ticket submission process
- **Knowledge Base** - Self-service solutions and documentation
- **Recent Activity** - Personal ticket history and updates

## 🔒 Security Architecture

### Authentication & Authorization
- **LDAP Integration** - Government domain authentication
- **JWT Token Management** - Secure session handling with refresh tokens
- **Role-Based Access Control** - Granular permission system
- **Session Management** - Secure user session tracking and validation

### Data Protection
- **Input Validation** - Comprehensive server-side validation
- **SQL Injection Prevention** - Parameterized queries and ORM protection
- **XSS Protection** - Content security policies and input sanitization
- **Audit Logging** - Complete activity trail for compliance

### Compliance Features
- **Government Standards** - Moroccan government security requirements
- **Data Sovereignty** - Local data storage and processing
- **Audit Trails** - Comprehensive logging for regulatory compliance
- **Access Controls** - Role-based permissions and session management

## 🚀 Getting Started

### Prerequisites
- **Java 17** - JDK installation required
- **Node.js 18+** - Frontend development environment
- **Maven** - Backend build tool
- **PostgreSQL** - Production database (optional, H2 for development)

### Local Development Setup

#### Backend Setup
1. Navigate to the backend directory
2. Run `mvn spring-boot:run`
3. Backend will be available at `http://localhost:8080`

#### Frontend Setup
1. Navigate to the frontend directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Frontend will be available at `http://localhost:3000`

#### Docker Development
1. Ensure Docker and Docker Compose are installed
2. Run `docker-compose up` from the project root
3. Backend: `http://localhost:8080`, Frontend: `http://localhost:3000`

### Configuration

#### Backend Configuration
The backend uses Spring Boot configuration with the following key properties:
- Database connection settings
- LDAP server configuration
- JWT token settings
- SNMP network discovery parameters

#### Frontend Configuration
The frontend is configured through environment variables:
- API base URL configuration
- Authentication token management
- Feature flags and settings

### Default Credentials
- **Admin**: `admin` / `admin123`
- **Technician**: `tech` / `tech123`
- **Employee**: `user` / `user123`

## ☁️ Deployment & CI/CD

### Azure Cloud Deployment
The system is configured for automated deployment to Azure Cloud:

- **Azure Container Registry (ACR)** - Docker image storage
- **Azure Container Instances (ACI)** - Containerized application hosting
- **GitHub Actions** - Automated CI/CD pipeline
- **Azure Resource Group** - Organized cloud resource management

### CI/CD Pipeline
The GitHub Actions workflow automatically:
1. Builds Docker images for backend and frontend
2. Pushes images to Azure Container Registry
3. Deploys to Azure Container Instances
4. Manages environment-specific configurations

### Required Secrets
The following GitHub repository secrets are required for deployment:
- Azure Container Registry credentials
- Azure service principal credentials
- Resource group and container instance names
- Frontend API URL configuration

## 📱 User Experience Features

### Responsive Design
- **Mobile-First Approach** - Progressive enhancement for all devices
- **Touch Optimization** - Mobile-friendly controls and navigation
- **Adaptive Layouts** - Responsive grid systems and components
- **Accessibility** - WCAG compliance and screen reader support

### Government Branding
- **Official DGH Logo** - Consistent branding throughout the application
- **Professional Design** - Government-appropriate color scheme and typography
- **Bilingual Support** - French and Arabic text support
- **Official Standards** - Compliance with Moroccan government design guidelines

### Performance Features
- **Real-time Updates** - Live data refresh and notifications
- **Optimized Loading** - Efficient data fetching and caching
- **Progressive Enhancement** - Core functionality with enhanced features
- **Offline Capabilities** - Basic functionality without network connection

## 🔧 System Features

### Ticket Management
- **Complete Lifecycle** - From creation to resolution and closure
- **Priority System** - Critical, High, Medium, and Low priority levels
- **Status Tracking** - Open, In Progress, Resolved, and Closed states
- **Assignment System** - Automatic and manual technician assignment
- **SLA Management** - Service level agreement monitoring and alerts
- **Time Tracking** - Estimated vs actual resolution time logging
- **Customer Satisfaction** - Rating system for service quality

### Equipment Monitoring
- **SNMP Integration** - Network device discovery and monitoring
- **Inventory Management** - Comprehensive asset tracking system
- **Status Monitoring** - Real-time equipment health and availability
- **Location Tracking** - Physical and network location management
- **Maintenance Records** - Service history and warranty information

### Activity Logging
- **Comprehensive Audit Trail** - All system activities and user actions
- **Security Events** - Authentication attempts and suspicious activities
- **User Actions** - Ticket operations and system modifications
- **IP Tracking** - Source address monitoring for security
- **Export Capabilities** - Compliance reporting and audit trails

## 📈 Analytics & Reporting

### Performance Metrics
- **Ticket Resolution Times** - Average time to resolution by priority
- **SLA Compliance** - Service level agreement adherence tracking
- **Technician Productivity** - Individual and team performance metrics
- **Customer Satisfaction** - Service quality ratings and trends
- **System Utilization** - Resource usage and capacity planning

### Data Visualization
- **Interactive Charts** - Real-time data visualization with Recharts
- **Dashboard Widgets** - Role-specific information displays
- **Trend Analysis** - Historical data and forecasting capabilities
- **Export Functionality** - PDF and Excel report generation

## 🏛️ Government Compliance

### Moroccan Government Standards
- **Official Branding** - DGH logo and government color scheme
- **Security Requirements** - Government-grade security and authentication
- **Data Sovereignty** - Local data storage and processing compliance
- **Audit Requirements** - Comprehensive logging for regulatory compliance

### Security Compliance
- **LDAP Integration** - Government domain authentication
- **Role-Based Access** - Granular permission system
- **Audit Trails** - Complete activity logging and monitoring
- **Data Protection** - Secure data handling and storage

## 🤝 Contributing

### Development Guidelines
- **Code Standards** - Java 17 and React 18 best practices
- **Testing Strategy** - Unit, integration, and component testing
- **Documentation** - Comprehensive code and API documentation
- **Security Focus** - Security-first development approach

### Project Structure
The project follows a feature-based organization:
- **Backend** - Spring Boot application with layered architecture
- **Frontend** - React application with component-based structure
- **Shared Resources** - Common utilities and configurations
- **Documentation** - Comprehensive project documentation

## 📞 Support & Contact

### Technical Support
- **Documentation** - Complete API reference and user guides
- **Troubleshooting** - Common issues and solutions
- **Security Updates** - Regular security patches and updates
- **Development Support** - Code documentation and best practices

### Organization Information
**Organization**: Direction Générale de l'Hydraulique  
**Ministry**: Ministry of Equipment and Water  
**Country**: Morocco  
**System**: DGH HelpDesk IT Support Management  
**Version**: 1.0.0  
**Last Updated**: 2025

---

**© 2025 Direction Générale de l'Hydraulique - Ministry of Equipment and Water, Morocco**

*Built with modern technologies for government IT support excellence, featuring comprehensive security, role-based access control, and government compliance standards.*
