# Complete Setup Guide

This guide will walk you through setting up and running the Salary Management Platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
1. **Node.js 20+** - [Download](https://nodejs.org/)
   ```bash
   node --version  # Should be v20.x.x or higher
   ```

2. **pnpm 9+** - Fast, disk space efficient package manager
   ```bash
   npm install -g pnpm@9.4.0
   pnpm --version  # Should be 9.x.x
   ```

3. **PostgreSQL 16** - [Download](https://www.postgresql.org/download/)
   ```bash
   psql --version  # Should be 16.x
   ```

## Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd c:\Users\dfg\Desktop\Salary-Management-Assessment

# Install all dependencies (this will install for all apps and packages)
pnpm install
```

This will install dependencies for:
- Root workspace
- Frontend (apps/web)
- Backend (apps/api)
- All shared packages (types, utils, tsconfig, eslint-config)

### 2. Setup PostgreSQL Database

#### Option A: Using PostgreSQL GUI (pgAdmin)
1. Open pgAdmin
2. Create a new database named `salary_management`
3. Note your connection details

#### Option B: Using Command Line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE salary_management;

# Exit
\q
```

### 3. Configure Environment Variables

Create environment file for the backend:

```bash
# Copy the example file
copy .env.example apps\api\.env

# Or manually create apps/api/.env with the following content:
```

**apps/api/.env:**
```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/salary_management

# JWT Secrets (change these in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# API Configuration
PORT=3001
NODE_ENV=development
API_PREFIX=api
API_VERSION=v1

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**Important**: Replace `your_password` with your actual PostgreSQL password!

### 4. Setup Database Schema

```bash
# Navigate to backend directory
cd apps\api

# Generate Prisma Client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Go back to root
cd ..\..
```

### 5. Seed the Database (Optional but Recommended)

This will create 10,000 sample employees:

```bash
# From root directory
pnpm seed
```

This takes about 30-60 seconds. You'll see progress logs.

### 6. Run the Application

#### Option A: Run Everything Together (Recommended)

From the root directory:
```bash
pnpm dev
```

This starts:
- ✅ Frontend dev server on http://localhost:3000
- ✅ Backend API server on http://localhost:3001

#### Option B: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
cd apps\api
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
cd apps\web
pnpm dev
```

### 7. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

### 8. Create a User Account

Since this is a fresh installation, you'll need to create an account:

1. Go to http://localhost:3000
2. You'll be redirected to the login page
3. For now, you can create a user directly in the database:

```bash
# Connect to PostgreSQL
psql -U postgres -d salary_management

# Create a user (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt")
VALUES (
  'clxxx123456789',
  'admin@company.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7qXqFlYKHO',
  'Admin',
  'User',
  'HR_MANAGER',
  NOW(),
  NOW()
);

# Exit
\q
```

Now you can login with:
- **Email**: admin@company.com
- **Password**: password123

## Verification Checklist

After setup, verify everything is working:

- [ ] PostgreSQL is running
- [ ] Database `salary_management` exists
- [ ] Backend starts without errors on port 3001
- [ ] Frontend starts without errors on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:3001/api/health
- [ ] Can login to the application
- [ ] Can see employees in the dashboard

## Common Issues and Solutions

### Issue: "Port 3000 is already in use"
**Solution**: 
```bash
# Find and kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Port 3001 is already in use"
**Solution**:
```bash
# Find and kill the process using port 3001
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Cannot connect to database"
**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   # Check if PostgreSQL service is running
   sc query postgresql-x64-16
   ```

2. Check your DATABASE_URL in `apps/api/.env`
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

### Issue: "Prisma Client not generated"
**Solution**:
```bash
cd apps\api
pnpm prisma:generate
```

### Issue: "Module not found" errors
**Solution**:
```bash
# Clean install
pnpm install --force
```

### Issue: "TypeScript errors"
**Solution**:
```bash
# Run type checking
pnpm typecheck
```

## Development Workflow

### Making Changes

1. **Frontend changes**: Edit files in `apps/web/src/`
   - Hot reload is enabled, changes appear instantly

2. **Backend changes**: Edit files in `apps/api/src/`
   - Server auto-restarts on file changes

3. **Shared types**: Edit files in `packages/types/src/`
   - Both frontend and backend will pick up changes

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format

# Type check all code
pnpm typecheck
```

### Database Management

```bash
# Open Prisma Studio (Database GUI)
cd apps\api
pnpm prisma:studio

# Create a new migration
pnpm prisma:migrate

# Reset database (WARNING: Deletes all data)
pnpm prisma migrate reset

# Re-seed database
cd ..\..
pnpm seed
```

## Building for Production

### Build Everything
```bash
pnpm build
```

### Build Individual Apps

**Backend:**
```bash
cd apps\api
pnpm build
pnpm start
```

**Frontend:**
```bash
cd apps\web
pnpm build
pnpm preview
```

## Project Structure

```
salary-management-platform/
├── apps/
│   ├── web/                 # Frontend React app
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── services/    # API services
│   │   │   ├── store/       # State management
│   │   │   └── lib/         # Utilities
│   │   └── package.json
│   │
│   └── api/                 # Backend Node.js app
│       ├── src/
│       │   ├── controllers/ # Request handlers
│       │   ├── services/    # Business logic
│       │   ├── repositories/# Data access
│       │   ├── middleware/  # Express middleware
│       │   └── config/      # Configuration
│       ├── prisma/          # Database schema
│       └── package.json
│
├── packages/
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Shared utilities
│   ├── tsconfig/           # Shared TS configs
│   └── eslint-config/      # Shared ESLint configs
│
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # Workspace configuration
└── turbo.json              # Turborepo configuration
```

## Available Scripts

### Root Level
```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps
pnpm test         # Run all tests
pnpm lint         # Lint all code
pnpm typecheck    # Type check all code
pnpm format       # Format all code
pnpm seed         # Seed database
```

### Backend (apps/api)
```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests
pnpm seed         # Seed database
pnpm prisma:studio    # Open Prisma Studio
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:migrate   # Run migrations
```

### Frontend (apps/web)
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm storybook    # Start Storybook
```

## Next Steps

After successful setup:

1. **Explore the Dashboard**: Navigate to http://localhost:3000/dashboard
2. **View Employees**: Go to http://localhost:3000/employees
3. **Add an Employee**: Click "Add Employee" button
4. **Test Filters**: Use the filter options to search employees
5. **Check Analytics**: View salary insights on the dashboard

## Getting Help

If you encounter issues:

1. Check this guide's "Common Issues" section
2. Review the main README.md
3. Check the ARCHITECTURE.md for system design
4. Review the DECISIONS.md for technical choices

## Tips for Development

1. **Keep terminals open**: Run backend and frontend in separate terminals to see logs
2. **Use Prisma Studio**: Great for viewing/editing database data
3. **Check browser console**: Frontend errors appear here
4. **Check terminal**: Backend errors appear in the API terminal
5. **Hot reload**: Both frontend and backend support hot reload

Happy coding! 🚀
