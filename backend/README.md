# DGH HelpDesk Backend

## Overview

The DGH HelpDesk Backend is a comprehensive Spring Boot application that provides IT helpdesk and inventory management services for the Ministry of Equipment and Water (وزارة التجهيز والماء) in Morocco.

## Features

### Core Functionality
- **User Management**: LDAP-integrated user authentication and authorization
- **Equipment Inventory**: Automated network discovery and equipment tracking
- **Ticket Management**: Complete helpdesk ticket lifecycle management
- **Network Discovery**: Automated scanning using NMAP, SNMP, and WMI
- **Dashboard & Analytics**: Real-time statistics and reporting

### Technical Features
- **Spring Boot 3.5.3** with Java 17
- **H2 Database** for data persistence
- **LDAP Authentication** for government employee login
- **RESTful APIs** with comprehensive error handling
- **Automated Network Scanning** with SNMP support
- **Async Processing** for background tasks
- **Comprehensive Validation** and error handling

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │  Repositories   │
│                 │    │                 │    │                 │
│ - UserController│────│ - UserService   │────│ - UserRepository│
│ - TicketController   │ - TicketService │    │ - TicketRepo    │
│ - EquipmentCtrl │    │ - EquipmentSvc  │    │ - EquipmentRepo │
│ - AuthController│    │ - NetworkDiscSvc│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   H2 Database   │
                    │                 │
                    │ - users         │
                    │ - equipment     │
                    │ - tickets       │
                    │ - ticket_comments│
                    └─────────────────┘
```

## Database Schema

### Core Tables
- **users**: Government employees with LDAP integration
- **equipment**: IT assets discovered through network scanning
- **tickets**: Helpdesk tickets with full lifecycle tracking
- **ticket_comments**: Comments and updates on tickets

## API Endpoints

### Authentication
- `POST /api/auth/login` - LDAP authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user information

### Users
- `GET /api/users` - List users with pagination and filtering
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `GET /api/users/technicians` - Get all technicians

### Equipment
- `GET /api/equipment` - List equipment with pagination and filtering
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/{id}` - Update equipment
- `GET /api/equipment/statistics` - Equipment statistics

### Tickets
- `GET /api/tickets` - List tickets with pagination and filtering
- `GET /api/tickets/{id}` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/{id}` - Update ticket
- `POST /api/tickets/{id}/assign` - Assign ticket to technician
- `PUT /api/tickets/{id}/status` - Change ticket status

### Network Discovery
- `POST /api/network-discovery/scan` - Start network discovery
- `POST /api/network-discovery/scan/{ip}` - Scan specific device
- `GET /api/network-discovery/status` - Get discovery status

### Dashboard
- `GET /api/dashboard/statistics` - Overall system statistics

### Health & Monitoring
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health status

## Configuration

### Application Properties
```properties
# Database Configuration
spring.datasource.url=jdbc:h2:file:./data/dgh_helpdesk
spring.datasource.username=sa
spring.datasource.password=password

# LDAP Configuration
spring.ldap.urls=ldap://localhost:389
spring.ldap.base=dc=dgh,dc=gov,dc=ma
spring.ldap.username=cn=admin,dc=dgh,dc=gov,dc=ma
spring.ldap.password=admin

# Network Discovery Configuration
network.discovery.enabled=true
network.discovery.subnet-ranges=192.168.1.0/24,10.0.0.0/8
network.discovery.snmp.community=public
```

## Security

### Authentication & Authorization
- **LDAP Integration**: Authenticates against government LDAP server
- **Role-based Access**: USER, TECHNICIAN, ADMIN roles
- **Method-level Security**: `@PreAuthorize` annotations
- **CORS Configuration**: Configured for Angular frontend

### Roles & Permissions
- **USER**: Create tickets, view own tickets
- **TECHNICIAN**: Assign tickets, update status, access equipment
- **ADMIN**: Full system access, user management, system configuration

## Development

### Prerequisites
- Java 17+
- Maven 3.6+
- LDAP server (for authentication)

### Running the Application
```bash
# Navigate to backend directory
cd backend

# Run with Maven
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

### Building
```bash
# Build JAR file
./mvnw clean package

# Run built JAR
java -jar target/dgh-helpdesk-0.0.1-SNAPSHOT.jar
```

### Database Access
- **H2 Console**: http://localhost:8080/h2-console
- **JDBC URL**: jdbc:h2:file:./data/dgh_helpdesk
- **Username**: sa
- **Password**: password

## Testing

### Running Tests
```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest
```

### Test Coverage
- Unit tests for services and repositories
- Integration tests for controllers
- Security tests for authentication

## Monitoring & Maintenance

### Health Checks
- Basic health: `GET /api/health`
- Detailed health: `GET /api/health/detailed`
- Service-specific: `GET /api/health/service/{serviceName}`

### Database Maintenance
- Schema validation on startup
- Cleanup old data: `POST /api/database/cleanup`
- Database backup: `POST /api/database/backup`

### Logging
- Application logs in `logs/` directory
- Configurable log levels in `application.properties`
- Structured logging for monitoring

## Deployment

### Production Configuration
1. Update LDAP server configuration
2. Configure production database
3. Set appropriate network discovery subnets
4. Configure SSL/TLS certificates
5. Set up monitoring and alerting

### Environment Variables
```bash
export SPRING_PROFILES_ACTIVE=production
export LDAP_URL=ldap://your-ldap-server:389
export DB_URL=jdbc:h2:file:/opt/dgh-helpdesk/data/dgh_helpdesk
```

## Troubleshooting

### Common Issues
1. **LDAP Connection Failed**: Check LDAP server configuration and network connectivity
2. **Database Lock**: Ensure only one application instance is running
3. **Network Discovery Not Working**: Verify NMAP installation and network permissions
4. **SNMP Timeout**: Check SNMP community string and firewall settings

### Debug Mode
```bash
# Enable debug logging
./mvnw spring-boot:run -Dspring.profiles.active=debug
```

## Contributing

1. Follow Java coding standards
2. Write unit tests for new features
3. Update documentation
4. Use meaningful commit messages
5. Test LDAP integration thoroughly

## License

Internal use only - Ministry of Equipment and Water, Morocco
