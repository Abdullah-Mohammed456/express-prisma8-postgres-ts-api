# Express + PostgreSQL API

A TypeScript REST API prototype using Express, PostgreSQL, Prisma contract tooling, bcrypt, and JWT-based login.

## Features

- User registration and login
- JWT-protected user routes
- Request validation and centralized error handling
- PostgreSQL access through the Prisma contract setup

## Requirements

- Bun
- PostgreSQL 15 or later

## Local setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Copy the environment example:

   ```bash
   cp .env.example .env
   ```

3. Set DATABASE_URL in .env. Generate a JWT signing key with:

   ```bash
   openssl rand -base64 48
   ```

   Put the generated value in JWT_SECRET in .env. Use a separate secret in your hosting provider settings. The API refuses to start if JWT_SECRET is missing or shorter than 32 bytes. Keep .env private and never commit it.

4. Start the API:

   ```bash
   bun dev
   ```

The server listens on port 3000 by default. Changing JWT_SECRET invalidates existing login tokens.

## Prisma contract

Generate the Prisma contract with:

```bash
bun run contract:emit
```

This command emits the contract; it does not apply database migrations. A migration workflow is not configured in the repository yet.

## API routes

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| GET | / | Health check | Public |
| POST | /users/ | Register a user | Public |
| POST | /users/login | Log in | Public |
| GET | /users/ | List users | JWT required |
| GET | /users/:id | Get a user | JWT required |
| PATCH | /users/:id | Update a user | JWT required |
| DELETE | /users/:id | Delete a user | JWT required |

## Current limitations

- No automated test, build, or lint scripts are configured in package.json.
- No deployment procedure is documented.
- The old JWT signing value appeared in committed source history. Configure and rotate the production JWT_SECRET before deploying; changing it logs out existing token holders.
- The repository uses a Prisma 8 release-candidate CLI with @prisma/client 7.10.0; verify the versions are compatible before using the database integration.

## Project structure

```text
controllers/     Request handlers
middleware/      Authentication, validation, and error handling
routes/          API route definitions
src/prisma/      Prisma contract and database client
utils/           Shared utilities
config/          Runtime environment validation
index.ts         Express application entry point
package.json     Dependencies and scripts
```
