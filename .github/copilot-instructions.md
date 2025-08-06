# Copilot Instructions for DGH HelpDesk

## Project Overview
- DGH HelpDesk is a full-stack IT support management system for the Moroccan Ministry of Equipment and Water.
- The system is split into a React frontend (`frontend/`) and a Spring Boot backend (`backend/`).
- Role-based access: Admin, Technician, Employee (User), each with distinct dashboard and permissions.

## Architecture & Data Flow
- **Frontend**: React 18, Material-UI, React Router, Axios, Context API. Organized by features (auth, dashboard, tickets, users, equipment).
- **Backend**: Spring Boot 3, Java 17, Spring Security, JPA, H2 (dev) / PostgreSQL (prod), LDAP for authentication, JWT for sessions.
- **API**: All endpoints are under `/api/`. Frontend communicates with backend via Axios services in `frontend/src/services/`.
- **Dashboards**: Each role has a tailored dashboard. See `dashboardService.js` for API patterns.

## Developer Workflows
- **Backend**: Build/run with `mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).
- **Frontend**: Start with `npm install` then `npm start` in `frontend/`.
- **Testing**: Backend - `./mvnw test`. Frontend - add tests in `src/` (no test runner configured by default).
- **Database**: H2 for dev (file: `data/dgh_helpdesk.mv.db`). H2 console at `/h2-console` (backend running).
- **Credentials**: See `LOGIN_CREDENTIALS.md` or README for test users.

## Project-Specific Conventions
- **Styling**: Use only MUI components and `sx` prop. No custom CSS.
- **State**: Use React Context + useReducer for global state.
- **Components**: Functional components/hooks only. No class components.
- **API Services**: All API calls go through `frontend/src/services/`. Follow the pattern in `dashboardService.js`.
- **Role Logic**: Role checks and protected routes in `ProtectedRoute.js`, `RoleBasedRoute.js`, and `AuthContext.js`.
- **Backend Structure**: Follows standard Spring Boot layering: `controller/`, `service/`, `repository/`, `entity/`, `config/`.
- **Activity Logging**: All major actions are logged (see backend ActivityLog features).

## Integration & Cross-Component Patterns
- **Authentication**: LDAP (Active Directory) via backend, JWT tokens stored in frontend, sent via Axios.
- **Equipment Monitoring**: SNMP-based, managed by backend, surfaced in frontend dashboards.
- **Activity Logs**: Exposed via `/api/activity-logs` endpoints, consumed in frontend for admin/tech dashboards.
- **Error Handling**: API errors are caught and logged in services, surfaced to UI via context/hooks.

## Examples
- To add a new dashboard metric: Add backend endpoint in `DashboardController`, service in `dashboardService.js`, and UI in `features/dashboard/`.
- To add a new role: Update backend enums, security config, and add role logic in frontend context/routes.

## Key Files & Directories
- `frontend/src/services/dashboardService.js` — API patterns for dashboard data
- `frontend/src/contexts/AuthContext.js` — Auth/session logic
- `frontend/src/components/ProtectedRoute.js` — Route protection
- `backend/src/main/java/ma/gov/dgh/helpdesk/controller/` — REST API controllers
- `backend/src/main/resources/application.properties` — Backend config
- `LOGIN_CREDENTIALS.md`, `README.md` — Test users, setup, and project details

---
For more, see the main `README.md` and per-app `README.md` files. Keep instructions concise, actionable, and specific to this codebase.
