# Architecture Documentation

## System Overview

The Salary Management Platform is built as a modern monorepo application using Turborepo, featuring a clean separation between frontend, backend, and shared packages.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + Vite (Modern SPA)                           │  │
│  │  - TailwindCSS + shadcn/ui (Minimalist Design)      │  │
│  │  - TanStack Query (Server State)                     │  │
│  │  - Zustand (Client State)                            │  │
│  │  - React Router (Navigation)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js                                          │  │
│  │  - Rate Limiting                                     │  │
│  │  - CORS                                              │  │
│  │  - Helmet (Security)                                 │  │
│  │  - Request Logging                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers (Request Handling)                      │  │
│  │  ├── AuthController                                  │  │
│  │  ├── EmployeeController                              │  │
│  │  └── AnalyticsController                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                           │  │
│  │  ├── AuthService                                     │  │
│  │  ├── EmployeeService                                 │  │
│  │  └── AnalyticsService                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Repositories (Data Access)                          │  │
│  │  └── EmployeeRepository                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma ORM                                          │  │
│  │  - Type-safe queries                                 │  │
│  │  - Migration management                              │  │
│  │  - Connection pooling                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 16                                       │  │
│  │  - Indexed queries                                   │  │
│  │  - ACID compliance                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### Backend Patterns

#### 1. Repository Pattern
- **Purpose**: Abstract data access logic
- **Implementation**: `EmployeeRepository` handles all database operations
- **Benefits**: 
  - Easy to test (mock repositories)
  - Database-agnostic business logic
  - Centralized query optimization

#### 2. Service Layer Pattern
- **Purpose**: Encapsulate business logic
- **Implementation**: Services orchestrate repositories and implement business rules
- **Benefits**:
  - Reusable business logic
  - Clear separation of concerns
  - Easy to test

#### 3. DTO Pattern
- **Purpose**: Data transfer between layers
- **Implementation**: Zod schemas validate and transform data
- **Benefits**:
  - Type safety
  - Input validation
  - API contract enforcement

#### 4. Middleware Pattern
- **Purpose**: Cross-cutting concerns
- **Implementation**: Auth, validation, error handling, logging
- **Benefits**:
  - Reusable functionality
  - Clean request pipeline
  - Easy to add/remove features

### Frontend Patterns

#### 1. Feature-Based Architecture
```
src/
├── features/
│   ├── auth/
│   ├── employees/
│   └── analytics/
├── components/
│   ├── ui/          # Reusable UI primitives
│   └── layouts/     # Layout components
├── services/        # API clients
├── hooks/           # Custom React hooks
└── store/           # Global state
```

#### 2. Compound Component Pattern
- **Purpose**: Flexible, composable UI components
- **Implementation**: shadcn/ui components
- **Benefits**:
  - Flexible API
  - Better composition
  - Reduced prop drilling

#### 3. Custom Hooks Pattern
- **Purpose**: Reusable stateful logic
- **Implementation**: `useToast`, `useAuth`, etc.
- **Benefits**:
  - Logic reuse
  - Cleaner components
  - Easy to test

## Data Flow

### Authentication Flow
```
1. User submits credentials
2. Frontend → POST /api/auth/login
3. Backend validates credentials
4. Backend generates JWT tokens (access + refresh)
5. Frontend stores tokens in localStorage
6. Frontend sets user in Zustand store
7. Subsequent requests include access token in Authorization header
8. On token expiry, frontend auto-refreshes using refresh token
```

### Employee CRUD Flow
```
1. User action (create/update/delete)
2. Frontend validates with Zod schema
3. Frontend → API request with JWT
4. Backend authenticates request
5. Backend validates input
6. Service layer processes business logic
7. Repository executes database operation
8. Response sent to frontend
9. TanStack Query updates cache
10. UI re-renders with new data
```

### Analytics Flow
```
1. Dashboard page loads
2. TanStack Query fetches analytics
3. Backend aggregates data from database
4. Complex calculations performed in service layer
5. Results cached by TanStack Query
6. Charts render with Recharts
7. Data auto-refreshes on stale time
```

## Scalability Considerations

### Database Optimization
- **Indexes**: Created on frequently queried columns (country, department, salary, email)
- **Pagination**: Server-side pagination prevents loading all records
- **Query Optimization**: Prisma generates efficient SQL queries
- **Connection Pooling**: Prisma manages connection pool automatically

### Frontend Performance
- **Code Splitting**: Vite automatically splits code by route
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo, useMemo, useCallback prevent unnecessary renders
- **Virtual Scrolling**: Ready for implementation with @tanstack/react-virtual
- **Query Caching**: TanStack Query caches API responses

### Backend Performance
- **Rate Limiting**: Prevents API abuse
- **Request Validation**: Early rejection of invalid requests
- **Structured Logging**: Winston for efficient log management
- **Error Handling**: Centralized error handling reduces overhead

## Security Architecture

### Authentication & Authorization
- **JWT Access Tokens**: Short-lived (15 minutes)
- **Refresh Tokens**: Long-lived (7 days), rotated on use
- **Password Hashing**: bcrypt with 12 rounds
- **Token Storage**: localStorage (with XSS protection)

### API Security
- **Helmet**: Security headers (XSS, clickjacking, etc.)
- **CORS**: Configured for specific origins
- **Rate Limiting**: 100 requests per minute per IP
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection**: Prevented by Prisma's parameterized queries

### Data Security
- **Sensitive Data**: Never logged or exposed in errors
- **Environment Variables**: Validated and type-safe
- **HTTPS**: Required in production
- **Audit Logs**: Track all data modifications

## Deployment Architecture

### Development
```
Developer Machine
├── Frontend (Vite Dev Server) :3000
├── Backend (tsx watch) :3001
└── PostgreSQL :5432
```

### Cloud Deployment Options
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Railway, Render, Fly.io, AWS ECS
- **Database**: Neon, Supabase, AWS RDS, Digital Ocean

## Monitoring & Observability

### Logging
- **Winston**: Structured JSON logging
- **Log Levels**: error, warn, info, debug
- **Log Files**: Separate files for errors and combined logs
- **Request Logging**: All HTTP requests logged with duration

### Health Checks
- **API Health**: GET /api/health
- **Database Health**: Prisma connection check
- **Metrics**: Ready for Prometheus integration

## Future Enhancements

### Scalability
- [ ] Redis caching layer
- [ ] Message queue (Bull/BullMQ)
- [ ] Horizontal scaling with load balancer
- [ ] Database read replicas
- [ ] CDN for static assets

### Features
- [ ] Real-time updates (WebSockets)
- [ ] Advanced analytics (ML predictions)
- [ ] Bulk operations (CSV import/export)
- [ ] Audit log viewer
- [ ] Advanced RBAC with permissions

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing in pipeline
- [ ] Infrastructure as Code (Terraform)
- [ ] Monitoring (Datadog, New Relic)
- [ ] Error tracking (Sentry)
