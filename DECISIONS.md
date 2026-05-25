# Technical Decisions & Rationale

This document explains the key technical decisions made during the development of the Salary Management Platform and the reasoning behind them.

## Technology Choices

### Monorepo with Turborepo

**Decision**: Use Turborepo for monorepo management

**Rationale**:
- **Code Sharing**: Easy to share types, utilities, and configs between frontend and backend
- **Atomic Changes**: Single PR can update both frontend and backend
- **Build Optimization**: Turborepo's caching significantly speeds up builds
- **Developer Experience**: Single `pnpm dev` command starts everything
- **Scalability**: Easy to add new apps/packages as the project grows

**Alternatives Considered**:
- Nx: More features but steeper learning curve
- Lerna: Less active development, no built-in caching
- Separate repos: More overhead, harder to maintain consistency

### React + Vite (Frontend)

**Decision**: Use React with Vite instead of Next.js

**Rationale**:
- **Simplicity**: This is primarily a dashboard app, not a content site
- **Performance**: Vite's HMR is extremely fast
- **Flexibility**: More control over build configuration
- **Bundle Size**: Smaller production bundles
- **Learning Curve**: Simpler mental model for the team

**Why Not Next.js**:
- SSR/SSG not needed for authenticated dashboard
- App Router adds complexity without clear benefits here
- Vite's dev experience is superior for SPAs

### Express (Backend)

**Decision**: Use Express instead of NestJS

**Rationale**:
- **Simplicity**: Straightforward, minimal boilerplate
- **Performance**: Lightweight, fast startup
- **Flexibility**: Easy to structure as needed
- **Ecosystem**: Massive middleware ecosystem
- **Team Familiarity**: Most developers know Express

**Why Not NestJS**:
- Overkill for this project size
- More boilerplate and decorators
- Steeper learning curve
- Longer build times

**Architecture**: Implemented NestJS-style patterns (services, repositories, DTOs) manually for best of both worlds

### PostgreSQL + Prisma

**Decision**: PostgreSQL with Prisma ORM

**Rationale**:
- **Type Safety**: Prisma generates TypeScript types from schema
- **Developer Experience**: Excellent autocomplete and type checking
- **Migrations**: Built-in migration system
- **Performance**: Efficient query generation
- **Reliability**: PostgreSQL is battle-tested for enterprise apps

**Alternatives Considered**:
- MongoDB: Less suitable for structured salary data and complex queries
- TypeORM: Less type-safe, more boilerplate
- Drizzle: Newer, less mature ecosystem

### TailwindCSS + shadcn/ui

**Decision**: TailwindCSS with shadcn/ui components

**Rationale**:
- **Modern Design**: Clean, minimalist aesthetic
- **Customization**: Full control over component code
- **Accessibility**: Built-in ARIA attributes
- **Dark Mode**: First-class support
- **No Runtime**: Zero JavaScript overhead
- **Developer Experience**: Excellent with TypeScript

**Why Not Component Libraries**:
- Material-UI: Heavy bundle, opinionated design
- Ant Design: Less modern aesthetic
- Chakra UI: Runtime CSS-in-JS overhead

### TanStack Query

**Decision**: TanStack Query for server state management

**Rationale**:
- **Caching**: Automatic caching with stale-while-revalidate
- **Optimistic Updates**: Built-in support
- **Devtools**: Excellent debugging experience
- **TypeScript**: First-class TypeScript support
- **Performance**: Automatic request deduplication

**Alternatives Considered**:
- SWR: Similar but less features
- Redux Toolkit Query: More boilerplate
- Apollo Client: Overkill without GraphQL

### Zustand

**Decision**: Zustand for client state management

**Rationale**:
- **Simplicity**: Minimal boilerplate
- **Performance**: No unnecessary re-renders
- **TypeScript**: Excellent type inference
- **Size**: Tiny bundle size (~1KB)
- **Middleware**: Built-in persist middleware

**Why Not Redux**:
- Too much boilerplate for this use case
- Larger bundle size
- More complex mental model

## Architecture Decisions

### Repository Pattern

**Decision**: Implement repository pattern for data access

**Rationale**:
- **Testability**: Easy to mock repositories in tests
- **Separation**: Business logic separate from data access
- **Flexibility**: Can swap database without changing business logic
- **Query Optimization**: Centralized place for query optimization

### Service Layer

**Decision**: Separate service layer for business logic

**Rationale**:
- **Reusability**: Services can be used by multiple controllers
- **Testing**: Easier to unit test business logic
- **Complexity Management**: Keeps controllers thin
- **Transaction Management**: Services handle multi-step operations

### JWT with Refresh Tokens

**Decision**: JWT access tokens + refresh token rotation

**Rationale**:
- **Security**: Short-lived access tokens limit exposure
- **Scalability**: Stateless authentication
- **Performance**: No database lookup on every request
- **User Experience**: Seamless token refresh

**Implementation Details**:
- Access token: 15 minutes (balance security/UX)
- Refresh token: 7 days (reasonable session length)
- Rotation: New refresh token on each use

### Zod for Validation

**Decision**: Use Zod for runtime validation

**Rationale**:
- **Type Safety**: Infer TypeScript types from schemas
- **Reusability**: Same schemas for frontend and backend
- **Error Messages**: Excellent error reporting
- **Composability**: Easy to build complex schemas
- **Performance**: Fast validation

### Feature-Based Frontend Structure

**Decision**: Organize frontend by features, not file types

**Rationale**:
- **Scalability**: Easy to find related code
- **Modularity**: Features are self-contained
- **Team Collaboration**: Reduces merge conflicts
- **Code Splitting**: Natural boundaries for code splitting

## Performance Decisions

### Server-Side Pagination

**Decision**: Implement server-side pagination from day one

**Rationale**:
- **Scalability**: Required for 10,000+ employees
- **Performance**: Reduces payload size
- **User Experience**: Faster initial load
- **Database**: Reduces query load

### Database Indexing

**Decision**: Index frequently queried columns

**Rationale**:
- **Query Performance**: Dramatically faster lookups
- **Analytics**: Enables fast aggregations
- **Filtering**: Supports complex filter combinations

**Indexed Columns**:
- email (unique lookups)
- country, department, jobTitle (filtering)
- salary (range queries)
- status (filtering)

### Query Caching

**Decision**: Implement aggressive caching with TanStack Query

**Rationale**:
- **Performance**: Instant navigation between pages
- **UX**: Optimistic updates feel instant
- **API Load**: Reduces unnecessary requests
- **Offline**: Works with stale data

**Cache Strategy**:
- 5-minute stale time for most queries
- Invalidate on mutations
- Background refetch on window focus

## Security Decisions

### Input Validation

**Decision**: Validate all inputs on both frontend and backend

**Rationale**:
- **Defense in Depth**: Multiple layers of protection
- **User Experience**: Immediate feedback on frontend
- **Security**: Backend validation prevents malicious requests
- **Data Integrity**: Ensures clean data in database

### Rate Limiting

**Decision**: Implement rate limiting at API level

**Rationale**:
- **DDoS Protection**: Prevents abuse
- **Cost Control**: Limits resource usage
- **Fair Usage**: Ensures availability for all users

**Configuration**:
- 100 requests per minute per IP
- Configurable via environment variables

### Helmet Security Headers

**Decision**: Use Helmet middleware for security headers

**Rationale**:
- **XSS Protection**: Prevents cross-site scripting
- **Clickjacking**: Prevents iframe embedding
- **MIME Sniffing**: Prevents content type confusion
- **Best Practices**: Industry-standard security

## Developer Experience Decisions

### Biome Instead of ESLint + Prettier

**Decision**: Use Biome for linting and formatting

**Rationale**:
- **Performance**: 100x faster than ESLint
- **Simplicity**: Single tool for linting and formatting
- **Configuration**: Minimal configuration needed
- **Future**: Active development, modern architecture

### Husky + lint-staged

**Decision**: Pre-commit hooks for code quality

**Rationale**:
- **Quality**: Prevents bad code from being committed
- **Consistency**: Enforces standards automatically
- **Speed**: Only checks changed files
- **Team**: Ensures everyone follows same standards

### Conventional Commits

**Decision**: Enforce conventional commit messages

**Rationale**:
- **Changelog**: Automatic changelog generation
- **Versioning**: Semantic versioning automation
- **Clarity**: Clear commit history
- **Tooling**: Better integration with CI/CD

## Testing Decisions

### Vitest

**Decision**: Use Vitest for testing

**Rationale**:
- **Speed**: Extremely fast test execution
- **Vite Integration**: Shares Vite config
- **API**: Jest-compatible API
- **TypeScript**: First-class TypeScript support
- **Watch Mode**: Excellent watch mode

### React Testing Library

**Decision**: Use React Testing Library for component tests

**Rationale**:
- **User-Centric**: Tests how users interact with UI
- **Maintainability**: Less brittle than implementation tests
- **Accessibility**: Encourages accessible components
- **Best Practices**: Industry standard

## Trade-offs & Compromises

### localStorage for Tokens

**Trade-off**: Using localStorage instead of httpOnly cookies

**Reasoning**:
- **Simplicity**: Easier to implement
- **Flexibility**: Works with any backend
- **Mobile**: Compatible with mobile apps

**Mitigation**:
- XSS protection via CSP
- Short token expiry
- Refresh token rotation

### No GraphQL

**Trade-off**: REST API instead of GraphQL

**Reasoning**:
- **Simplicity**: Easier to implement and understand
- **Caching**: Better HTTP caching
- **Tooling**: More mature REST tooling

**When to Reconsider**:
- Complex nested queries needed
- Multiple clients with different data needs
- Real-time subscriptions required

### No Microservices

**Trade-off**: Monolithic backend instead of microservices

**Reasoning**:
- **Simplicity**: Easier to develop and deploy
- **Performance**: No network overhead
- **Transactions**: Easier to maintain data consistency

**When to Reconsider**:
- Team size > 20 developers
- Need independent scaling
- Different technology requirements per service

## Lessons Learned

### What Worked Well
- Monorepo structure enabled rapid development
- Type sharing prevented many bugs
- TanStack Query simplified state management
- Prisma's type safety caught errors early
- shadcn/ui provided excellent starting point

### What Could Be Improved
- More comprehensive testing from start
- Earlier performance profiling
- More granular error handling
- Better logging structure from day one

### Future Considerations
- Consider GraphQL for complex queries
- Implement WebSockets for real-time features
- Add Redis for caching layer
- Implement event sourcing for audit logs
