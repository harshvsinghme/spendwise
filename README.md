# SpendWise

SpendWise is a secure, Dockerized personal expense management backend built with TypeScript, Express, and PostgreSQL.

It helps you track expenses, manage monthly budgets, and automatically sends **email alerts when your budget usage exceeds 80%**.

Designed with **security, scalability, and clean architecture** in mind.

---

## Features

- Monthly budget tracking
- Email alerts at 80% budget usage
- Custom expense categories
- Email/password authentication
- Access & Refresh token based authentication
- PostgreSQL Row Level Security (RLS)
- Fully Dockerized
- Background jobs for alerts using queues
- Environment variable validation
- Structured & safe logging (no sensitive data leaks)
- Clean layered architecture

---

## Tech Stack

### Core
- TypeScript
- Node.js
- Express
- PostgreSQL
- Docker

### Security & Validation
- Zod (request + env validation)
- JWT Access/Refresh tokens
- Rate limiting
- Row Level Security (RLS)
- Centralized AppError handling

### Background Jobs & Cache
- BullMQ
- Redis (ioredis)

### Logging
- Pino
- pino-http
- Passwords and tokens automatically redacted

### Tooling
- pnpm workspaces
- Prettier
- ESLint
- node-pg-migrate

---

## Architecture

SpendWise follows clean architecture with dependency injection:

routes → controllers → services → repositories → database

### Layers

- Routes → HTTP definitions
- Middlewares → auth, validation, rate limiting, async handling
- Controllers → request orchestration
- Services → business logic
- Repositories → DB access (RLS enabled)
- Infra → DB, Redis, logger, queues

---

## Security Highlights

- PostgreSQL Row Level Security for strict user data isolation
- JWT access + refresh tokens
- Rate limiting
- Zod schema validation for requests and environment variables
- Sensitive data redaction in logs
- Centralized AppError
- Graceful shutdown
- Async + sync error handling

---

## Project Structure
```
backend/
  src/
    routes/
    controllers/
    services/
    repositories/
    middlewares/
    infra/
    validators/
    errors/
```

## Getting Started

### 1. Clone repository

```bash
git clone <repo-url>
cd spendwise
```

### 2. Create environment file

Create:

backend/.env

Example:
```
PORT="4000"
DATABASE_URL="postgresql://enteryourusernamehere:enteryourpasswordhere@postgres:5432/SpendWise-Local"
REDIS_URL="redis://redis:6379/0"
LOG_LEVEL="info"
JWT_ACCESS_SECRET="YOUR_JWT_ACCESS_SECRET"
JWT_REFRESH_SECRET="YOUR_JWT_REFRESH_SECRET"
ACCESS_TOKEN_TTL="900"
REFRESH_TOKEN_TTL="3600"
APP_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="abc.com"
SMTP_PASS="yourpassword"
```
All environment variables are validated at startup using Zod.

### 3. Start with Docker
```
docker compose up --build
```

## Development Scripts
```json
{
  "local": "NODE_ENV=local tsx watch src/server.ts",
  "build": "tsc -p tsconfig.json",
  "prod": "NODE_ENV=prod node dist/server.js",
  "format": "prettier --write '**/*.{ts,json}'",
  "lint": "eslint . --fix",
  "migrate:create": "node-pg-migrate create --migrationsDir migrations",
  "migrate:up": "node-pg-migrate up --migrationsDir migrations",
  "migrate:down": "node-pg-migrate down --migrationsDir migrations",
  "verify": "pnpm lint && pnpm format && pnpm build"
}
```

## Example Route
```ts
router.post(
  "/",
  requireAuth(userRepo, db),
  validate(createExpenseSchema),
  asyncHandler(expenseController.create)
);
```

#### Demonstrates:

- Authentication middleware

- Zod validation

- Async error handling

- Controller → Service → Repository pattern

- Dependency injection

## Budget Alert Flow
1. Expense recorded

2. Budget calculated

3. If usage ≥ 80%

4. Job added to BullMQ queue

5. Email notification sent asynchronously

## Design Goals
- Secure by default

- Type-safe everywhere

- Clean separation of concerns

- Production-ready logging

- Scalable architecture

- Easy maintenance

## License
MIT