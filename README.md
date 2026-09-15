# Express Prisma 8 PostgreSQL TypeScript API

A production-ready RESTful API backend built with Express, TypeScript, Prisma 8 ORM, and PostgreSQL.

This application provides a structured API architecture featuring secure JWT-based authentication, request payload validation, centralized custom error handling, and type-safe database interactions with Prisma.

## Key Features

- TypeScript Core: Strongly typed codebase ensuring type safety across controllers, middlewares, and models.
- Prisma ORM & PostgreSQL: Modern database abstraction layer providing type-safe database operations.
- JWT Authentication: Secure user login and route protection using JSON Web Tokens.
- Input Validation: Middleware for validating payload structure and request parameters.
- Global Error Handling: Centralized error handling using a unified custom error handler.
- Cross-Origin Resource Sharing: Pre-configured CORS and JSON body-parsing middlewares.

## Tech Stack

- Runtime: Node.js / Bun
- Framework: Express.js
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Authentication: JSON Web Tokens (JWT) & bcrypt

## Prerequisites

Before running this application, ensure the following are installed and configured:

- Node.js (v18+) or Bun runtime (v1.0+)
- PostgreSQL database instance (v15+)
- Git

## Environment Setup

1. Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

2. Configure environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
JWT_SECRET="your_jwt_secret_key"
PORT=3000
```

## Installation

Install project dependencies using your package manager:

```bash
# Using Bun
bun install

# Using NPM
npm install
```

## Database Migration & Setup

Generate Prisma contract definitions and apply database schema changes:

```bash
# Generate Prisma contracts
bun run contract:emit
# or
npx prisma contract emit
```

## Running the Application

### Development Mode

Start the server with hot reloading enabled:

```bash
# Using Bun
bun dev

# Using NPM
npm run dev
```

The server will start listening at `http://localhost:3000`.

## API Routes Overview

### System

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint | Public |

### User Endpoints (`/users`)

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/` | Register a new user | Public |
| `POST` | `/users/login` | User login | Public |
| `GET` | `/users/` | List all users | Required (JWT) |
| `GET` | `/users/:id` | Get user by ID | Required (JWT) |
| `PATCH` | `/users/:id` | Update user details | Required (JWT) |
| `DELETE` | `/users/:id` | Delete user profile | Required (JWT) |

## Project Structure

```text
├── controllers/          # Business logic and request handlers
├── middleware/           # Authentication, validation, and error middlewares
├── routes/               # API route definitions
├── src/
│   └── prisma/           # Prisma contract and database client configuration
├── utils/                # Utility modules (AppError, asyncHandler)
├── .env.example          # Environment template
├── .gitignore            # Git exclusion definitions
├── index.ts              # Express application entry point
├── package.json          # Dependency definitions and scripts
├── tsconfig.json         # TypeScript compiler configuration
└── README.md             # Project documentation
```
