# Employee List

A simple employee listing application built as a **Kubernetes learning project**. It demonstrates a classic three-tier architecture—React frontend, Express API, and PostgreSQL database—containerized with Docker and ready to be deployed to a Kubernetes cluster.

## Overview

The app lets you view and manage employee records (name, position, start date, employment type). The UI currently stores new entries in local React state; the backend exposes a full REST API backed by PostgreSQL. Health and readiness endpoints are included for Kubernetes liveness and readiness probes.

```
┌─────────────────┐     HTTP      ┌─────────────────┐     SQL       ┌─────────────────┐
│  employee-list  │ ────────────► │  employee-list  │ ────────────► │   PostgreSQL    │
│      -fe        │               │      -be        │               │       17        │
│  React + Vite   │               │  Express + TS   │               │                 │
│  Port 5173      │               │  Port 3000      │               │  Port 5432      │
└─────────────────┘               └─────────────────┘               └─────────────────┘
```

## Tech Stack

| Layer    | Directory           | Technologies                          |
|----------|---------------------|---------------------------------------|
| Frontend | `employee-list-fe/` | React 19, TypeScript, Vite, Tailwind CSS 4, React Router |
| Backend  | `employee-list-be/` | Express 5, TypeScript, node-pg        |
| Database | Docker service      | PostgreSQL 17                         |
| Dev ops  | Root                | Docker, Docker Compose                |

## Project Structure

```
employee-list/
├── docker-compose.yaml       # Local dev: frontend, backend, and database
├── employee-list-fe/         # React frontend
│   ├── Dockerfile
│   └── src/
│       ├── pages/Home.tsx    # Employee list UI and add form
│       └── ...
├── employee-list-be/         # Express API
│   ├── Dockerfile
│   └── src/
│       ├── app.ts            # App entry, health/readiness probes
│       ├── config/db.ts      # PostgreSQL connection pool
│       ├── routes/employees.routes.ts
│       └── middleware/errorHandler.ts
└── README.md
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js 22+](https://nodejs.org/) (optional, for running services outside Docker)


## Getting Started

### Clone Repository

```bash
git clone https://github.com/janarnelbanaag/employee-list
cd employee-list
```

### 1. Configure backend environment

Create `employee-list-be/.env`:

```env
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=employees
```

When running the backend outside Docker Compose, set `DB_HOST=localhost` and `DB_PORT=5433` (the mapped host port).

### 2. Initialize the database

The backend expects an `employees` table. Connect to PostgreSQL and run:

```sql
CREATE TABLE employees (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    position    VARCHAR(255) NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE,
    employment  VARCHAR(50) NOT NULL CHECK (employment IN ('probationary', 'regular', 'contract'))
);
```

With Docker Compose running, connect via:

```bash
docker compose exec db psql -U postgres -d employees
```

### 3. Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:3000      |
| Database | localhost:5433 (host port) |

Source directories are mounted as volumes for hot reload during development.

### 4. Run services individually (optional)

**Backend**

```bash
cd employee-list-be
npm ci
node --watch src/app.ts
```

**Frontend**

```bash
cd employee-list-fe
npm install
npm run dev
```

## API Reference

Base path: `/api/employee`

| Method | Endpoint   | Description                    |
|--------|------------|--------------------------------|
| GET    | `/`        | List all employees             |
| GET    | `/:id`     | Get employee by ID             |
| PUT    | `/:id`     | Replace employee fields        |
| PATCH  | `/:id`     | Partially update employee      |
| DELETE | `/:id`     | Delete employee by ID          |

### Health endpoints (for Kubernetes)

| Endpoint  | Purpose   | Behavior                                      |
|-----------|-----------|-----------------------------------------------|
| `GET /health` | Liveness  | Returns `200` when the process is running     |
| `GET /ready`  | Readiness | Returns `200` when the database is reachable; `503` otherwise |

### Example response

```json
{
  "success": true,
  "status": 200,
  "message": "success",
  "employees": [
    {
      "id": 1,
      "name": "Jane Doe",
      "position": "Engineer",
      "start_date": "2024-01-15",
      "end_date": null,
      "employment": "regular"
    }
  ]
}
```

Request bodies use camelCase (`startDate`, `endDate`); the database stores snake_case columns.

## Author

Jan Arnel Banaag
