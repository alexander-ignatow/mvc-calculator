# Calculator API

> Express + TypeScript demo – feature-module architecture with layered design.

Built as a companion project for a mini-webinar on structuring Express applications
using **feature modules**, **clean layered architecture**, and **testable domain logic**.

---

## Quick start

```bash
# Install dependencies
npm install

# Start the dev server (with hot reload via tsx)
npm run dev

# — or build & run —
npm run build
npm start
```

The server starts on **http://localhost:3000** (override with `PORT` env var).

---

## About This Project

This project demonstrates a **layered architecture with feature modules** approach for structuring Express.js applications. Express is intentionally minimal and unopinionated — it provides excellent routing and middleware capabilities but offers no guidance on project organization. This flexibility is powerful but can lead to inconsistent codebases.

This calculator API showcases how to combine two proven architectural patterns:

1. **Modular (Feature-Based) Organization** — Code is grouped by business feature rather than technical role. Each module (`calculator`, `history`) is self-contained with its own routes, controllers, use-cases, and domain logic.

2. **Layered Architecture** — Within each module, code is organized into distinct layers with clear responsibilities and dependency rules.

### Project Modules

| Module | Purpose |
|--------|---------|
| **calculator** | Parses and evaluates mathematical expressions using a recursive descent parser |
| **history** | Persists and retrieves calculation history with pluggable storage backends |
| **shared** | Cross-cutting concerns: base error classes, middleware |

### Layers Within Each Module

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| **API** | `api/` | HTTP controllers, Express routes, request/response DTOs, input validation |
| **Application** | `app/` | Use-cases that orchestrate domain logic and infrastructure |
| **Domain** | `domain/` | Pure business logic, entities, value objects, domain errors — no framework dependencies |
| **Infrastructure** | `infra/` | Concrete implementations of repository interfaces, external service adapters |

### Key Benefits

- **Testability** — Domain logic is pure and easily unit-tested without HTTP mocks
- **Flexibility** — Swap storage backends by implementing a new repository (see MongoDB example)
- **Scalability** — Add new features as independent modules without touching existing code
- **Clarity** — Clear dependency flow: API → App → Domain ← Infra

For more background on Express.js architecture patterns and the reasoning behind this structure, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## API Reference

The Calculator API provides endpoints for evaluating mathematical expressions and managing calculation history. All responses are in JSON format.

### Base URL
```
http://localhost:3000
```

---

### Health Check

**GET** `/health`

Simple health check endpoint to verify the service is running.

**Response**
- **200 OK** – Returns plain text: `"Service is up and running"`

**Example**
```bash
curl http://localhost:3000/health
```

---

### Evaluate Expression

**POST** `/calculator`

Parses and evaluates a mathematical expression, then stores the result in history.

**Supported Operations:**
- Basic arithmetic: `+`, `-`, `*`, `/`
- Parentheses for grouping: `(`, `)`
- Unary negation: `-5`
- Decimal numbers: `3.14`

**Request Body**
```json
{
  "expression": "string"  // Required: non-empty mathematical expression
}
```

**Response**
- **200 OK** – Expression successfully evaluated
- **400 Bad Request** – Invalid request body or malformed expression
- **422 Unprocessable Entity** – Valid syntax but mathematical error (e.g., division by zero)

**Success Response (200)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "expression": "(10 + 2) * 3 - 4 / 2",
  "computation": {
    "type": "binary",
    "operator": "-",
    "left": {
      "type": "binary",
      "operator": "*",
      "left": {
        "type": "binary",
        "operator": "+",
        "left": { "type": "number", "value": 10 },
        "right": { "type": "number", "value": 2 }
      },
      "right": { "type": "number", "value": 3 }
    },
    "right": {
      "type": "binary",
      "operator": "/",
      "left": { "type": "number", "value": 4 },
      "right": { "type": "number", "value": 2 }
    }
  },
  "result": 34,
  "createdAt": "2026-02-10T12:00:00.000Z"
}
```

**Error Response (400) - Validation Error**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": "expression",
      "message": "expression must be a non-empty string"
    }
  ]
}
```

**Error Response (400) - Parse Error**
```json
{
  "error": "Invalid expression: unexpected token ')' at position 5"
}
```

**Error Response (422) - Division by Zero**
```json
{
  "error": "Division by zero"
}
```

**Examples**
```bash
# Basic arithmetic
curl -X POST http://localhost:3000/calculator \
  -H 'Content-Type: application/json' \
  -d '{"expression": "2 + 3 * 4"}'

# Complex expression with parentheses
curl -X POST http://localhost:3000/calculator \
  -H 'Content-Type: application/json' \
  -d '{"expression": "(10 + 2) * 3 - 4 / 2"}'

# Decimal numbers and negation
curl -X POST http://localhost:3000/calculator \
  -H 'Content-Type: application/json' \
  -d '{"expression": "-3.14 + 2.86"}'
```

---

### Get Calculation History

**GET** `/calculator`

Retrieves a paginated list of calculation history.

**Query Parameters**
- `take` (optional, integer): Maximum number of items to return (default: 20, minimum: 1)
- `skip` (optional, integer): Number of items to skip from the beginning (default: 0, minimum: 0)

**Response**
- **200 OK** – Returns paginated history

**Success Response (200)**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "expression": "2 + 3",
      "computation": {
        "type": "binary",
        "operator": "+",
        "left": { "type": "number", "value": 2 },
        "right": { "type": "number", "value": 3 }
      },
      "result": 5,
      "createdAt": "2026-02-10T11:58:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "expression": "10 * 3",
      "computation": {
        "type": "binary",
        "operator": "*",
        "left": { "type": "number", "value": 10 },
        "right": { "type": "number", "value": 3 }
      },
      "result": 30,
      "createdAt": "2026-02-10T12:00:00.000Z"
    }
  ],
  "take": 20,
  "skip": 0
}
```

**Examples**
```bash
# Get first 20 calculations (default)
curl http://localhost:3000/calculator

# Get first 5 calculations
curl http://localhost:3000/calculator?take=5

# Get calculations 11-15 (skip first 10, take 5)
curl http://localhost:3000/calculator?take=5&skip=10

# Get next page after seeing 20 items
curl http://localhost:3000/calculator?take=20&skip=20
```

---

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start dev server with hot reload (tsx)   |
| `npm run build`      | Compile TypeScript to `dist/`            |
| `npm start`          | Run compiled JS from `dist/`             |
| `npm test`           | Run all tests (Vitest)                   |
| `npm run test:watch` | Run tests in watch mode                  |
| `npm run test:coverage` | Run tests with coverage report        |
| `npm run lint`       | Lint with ESLint                         |
| `npm run format`     | Format with Prettier                     |

---

## Architecture overview

```
src/
├── main.ts                        # Composition root – wires deps & starts server
├── app.ts                         # Express app factory (accepts dependencies)
│
├── shared/
│   ├── errors/                    # Base AppError class
│   └── middleware/                 # Central error-handler middleware
│
└── modules/
    ├── calculator/
    │   ├── api/                   # Routes, controller, Zod DTO
    │   ├── app/                   # CalculateAndStoreUseCase
    │   └── domain/                # Tokenizer, parser, evaluator, AST types, errors
    │
    └── history/
        ├── api/                   # Routes, controller, Zod DTO
        ├── app/                   # GetHistoryUseCase
        ├── domain/                # HistoryItem entity, HistoryRepository interface
        └── infra/                 # InMemoryHistoryRepository, MongoHistoryRepository (stub)

tests/
├── calculator.domain.spec.ts      # Unit tests: tokenizer, parser, evaluator
└── api.integration.spec.ts        # Integration tests: HTTP endpoints
```

### Layers

| Layer       | Responsibility                                   | Dependencies         |
| ----------- | ------------------------------------------------ | -------------------- |
| **Domain**  | Pure business logic, types, errors                | None                 |
| **App**     | Use-cases / application services                  | Domain, Repo interface |
| **API**     | HTTP controllers, routes, DTOs, validation        | App layer            |
| **Infra**   | Concrete repository implementations               | Domain (entity + interface) |
| **Shared**  | Cross-cutting: base errors, middleware            | –                    |

### Expression parsing pipeline

```
"(2+3)*4"  →  tokenize  →  [LPAREN, 2, PLUS, 3, RPAREN, MULTIPLY, 4, EOF]
                          →  parse (recursive descent)
                          →  AST { type: 'binary', operator: '*', ... }
                          →  evaluate  →  20
```

The parser implements a classic **recursive-descent** algorithm with the grammar:

```
Expression := Term (('+' | '-') Term)*
Term       := Factor (('*' | '/') Factor)*
Factor     := '-' Factor | '(' Expression ')' | Number
```

---

## Swapping the repository implementation

The project ships with **`InMemoryHistoryRepository`** (zero external dependencies).
A **MongoDB skeleton** is provided in `src/modules/history/infra/mongo-history.repository.ts`.

To switch to MongoDB:

1. Install the driver:

   ```bash
   npm install mongodb
   ```

2. Open `src/main.ts` and change the composition root:

   ```ts
   import { MongoClient } from 'mongodb';
   import { MongoHistoryRepository } from './modules/history/infra';

   const client = new MongoClient(process.env.MONGO_URI!);
   await client.connect();
   const collection = client.db('calculator').collection('history');

   const historyRepo = new MongoHistoryRepository(collection);
   const app = createApp(historyRepo);
   ```

3. Complete the TODO stubs inside `mongo-history.repository.ts` (type the
   collection, adjust the document mapping, etc.).

No other code needs to change — controllers, use-cases, and domain logic
are decoupled from the persistence layer via the `HistoryRepository` interface.

---

## Tech stack

- **Runtime** – Node.js 24+
- **Framework** – Express 5
- **Language** – TypeScript (strict mode, CommonJS)
- **Validation** – Zod
- **Testing** – Vitest + Supertest
- **Code quality** – ESLint + Prettier
