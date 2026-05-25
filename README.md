# Enterprise Salary Management Platform

A production-grade, full-stack salary management system built with modern technologies and best practices. Designed to handle 10,000+ employees with exceptional performance, scalability, and user experience.

## 🎯 Project Overview

This platform demonstrates enterprise-grade software engineering with:
- **Clean Architecture**: Modular, maintainable, and scalable codebase
- **Modern Tech Stack**: React, TypeScript, Node.js, PostgreSQL
- **Production Ready**: Docker, CI/CD, comprehensive testing
- **Performance Optimized**: Handles 10K+ employees efficiently
- **Beautiful UI**: Modern, minimalist design with shadcn/ui

## 🏗️ Architecture

### Monorepo Structure
```
salary-management-platform/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # Node.js + Express backend
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utilities
│   ├── tsconfig/     # Shared TypeScript configs
│   └── eslint-config/# Shared ESLint configs
└── docker-compose.yml
```

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Auth**: JWT with refresh tokens
- **Validation**: Zod
- **Logging**: Winston

### DevOps
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Code Quality**: Biome, Husky, lint-staged
- **Testing**: Vitest, React Testing Library

## 📦 Installation & Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL 16

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment variables
copy .env.example apps\api\.env
# Edit apps/api/.env with your PostgreSQL credentials

# 3. Setup database
cd apps\api
pnpm prisma:generate
pnpm prisma:migrate
cd ..\..

# 4. Start development servers (both frontend and backend)
pnpm dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/api/health

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### Running Frontend and Backend Separately

If you prefer to run them in separate terminals:

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

## 📊 Features

### Core Functionality
- ✅ Employee CRUD operations
- ✅ Advanced search and filtering
- ✅ Server-side pagination
- ✅ Salary analytics dashboard
- ✅ Country-wise salary insights
- ✅ Department analytics
- ✅ Job title salary comparisons
- ✅ Hiring trends visualization

### Technical Features
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC ready)
- ✅ Request rate limiting
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling
- ✅ Structured logging
- ✅ Database query optimization
- ✅ API versioning
- ✅ CORS configuration
- ✅ Security headers (Helmet)

### UI/UX Features
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading states
- ✅ Error states
- ✅ Empty states
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Keyboard navigation
- ✅ Accessibility (WCAG compliant)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## 📝 Scripts

### Root Level
```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm format       # Format code with Biome
```

### Backend (apps/api)
```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm seed         # Seed database with 10K employees
pnpm prisma:studio # Open Prisma Studio
```

### Frontend (apps/web)
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm storybook    # Start Storybook
```

## 🔒 Security

- JWT access tokens (15min expiry)
- Refresh token rotation
- Password hashing with bcrypt
- Input sanitization
- SQL injection prevention (Prisma)
- XSS protection
- CORS configuration
- Rate limiting
- Helmet security headers

## 📈 Performance

- Server-side pagination
- Database indexing
- Query optimization
- React memoization
- Code splitting
- Lazy loading
- Asset optimization
- Gzip compression

## 🎨 UI Components

Built with shadcn/ui for consistency and accessibility:
- Button, Input, Label
- Card, Dialog, Dropdown Menu
- Select, Toast, Table
- All components support variants and dark mode

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - List employees (paginated)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/filters` - Get filter options

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/country-salary-stats` - Country stats
- `GET /api/analytics/job-title-salary-stats` - Job title stats
- `GET /api/analytics/department-stats` - Department stats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit with conventional commits
4. Push and create a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

Built with ❤️ by the development team

---

**Note**: This is a demonstration project showcasing enterprise-grade development practices.



admin ID = admin@company.com
password = password123