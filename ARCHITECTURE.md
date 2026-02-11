# Express.js Architecture Guide

This document provides background on structuring Express.js applications and explains the architectural decisions made in this project.

## Why Architecture Matters in Express

Express.js is intentionally minimal and unopinionated. Unlike frameworks like NestJS or Rails, Express provides no default project structure, no conventions for organizing business logic, and no built-in patterns for separating concerns. This flexibility is a double-edged sword:

**Advantages:**
- Complete freedom to structure your application as needed
- No framework lock-in for architectural decisions
- Easy to start small and grow organically

**Challenges:**
- No standard way means every team reinvents the wheel
- Easy to create tightly coupled, hard-to-test code
- Business logic often ends up scattered across route handlers

The key insight is that **Express doesn't dictate structure, so separation of concerns becomes your responsibility**. Get the layers right, and the folder structure follows naturally.

---

## Common Architecture Patterns

### 1. MVC (Model-View-Controller)

The traditional pattern where:
- **Models** handle data and business logic
- **Views** render responses (often JSON in APIs)
- **Controllers** handle HTTP requests and coordinate between models and views

Works well for simpler applications but can lead to "fat controllers" or "fat models" as complexity grows.

### 2. Layered Architecture

Organizes code into horizontal layers:
- **Routes/Controllers** — HTTP handling
- **Services** — Business logic
- **Data Access** — Database operations

Each layer only depends on the layer below it. This is the "3-layer architecture" commonly recommended for Node.js backends.

### 3. Feature-Based (Modular)

Groups code by business feature rather than technical role:
```
features/
├── users/
│   ├── userController.ts
│   ├── userService.ts
│   └── userModel.ts
├── products/
│   ├── productController.ts
│   ├── productService.ts
│   └── productModel.ts
```

Excellent for larger applications where features are relatively independent.

### 4. Domain-Driven Design (DDD)

Focuses on the business domain with concepts like:
- **Entities** — Objects with identity
- **Value Objects** — Immutable objects without identity
- **Aggregates** — Clusters of entities treated as a unit
- **Repositories** — Abstractions over data access

Best suited for complex business domains where the core logic is the primary challenge.

---

## This Project's Approach: Layered Modules

This project combines **feature-based organization** with **layered architecture within each module**:

```
src/modules/
├── calculator/           # Feature module
│   ├── api/              # Layer: HTTP interface
│   ├── app/              # Layer: Application/Use-cases
│   └── domain/           # Layer: Business logic
│
└── history/              # Feature module
    ├── api/              # Layer: HTTP interface
    ├── app/              # Layer: Application/Use-cases
    ├── domain/           # Layer: Business logic
    └── infra/            # Layer: Infrastructure (repositories)
```

### Why This Combination?

1. **Modules provide encapsulation** — Each feature is self-contained and can evolve independently
2. **Layers provide structure** — Within each module, there's a clear place for each type of logic
3. **Dependencies flow inward** — HTTP depends on App, App depends on Domain, Infrastructure implements Domain interfaces

### Layer Responsibilities

| Layer | Contains | Knows About |
|-------|----------|-------------|
| **API** | Controllers, routes, DTOs, validation | App layer (use-cases) |
| **App** | Use-cases, orchestration | Domain layer (entities, interfaces) |
| **Domain** | Business rules, entities, interfaces | Nothing external |
| **Infra** | Repository implementations, external services | Domain interfaces |

---

## Key Principles

### 1. Don't Put Business Logic in Controllers

Controllers should be thin — validate input, call a use-case, return a response:

```typescript
// ✅ Good: Controller delegates to use-case
async calculate(req: Request, res: Response) {
  const dto = schema.parse(req.body);
  const result = await this.useCase.execute(dto.expression);
  res.json(result);
}

// ❌ Bad: Business logic in controller
async calculate(req: Request, res: Response) {
  const tokens = tokenize(req.body.expression);
  const ast = parse(tokens);
  const result = evaluate(ast);
  await db.insert({ expression, result });
  res.json(result);
}
```

### 2. Use Dependency Injection

Pass dependencies through constructors rather than importing them directly:

```typescript
// ✅ Good: Repository injected
class CalculateAndStoreUseCase {
  constructor(private readonly historyRepo: HistoryRepository) {}
}

// ❌ Bad: Direct import creates tight coupling
import { historyCollection } from '../db';
```

This makes testing trivial — just pass a mock repository.

### 3. Keep Domain Logic Pure

The domain layer should have no dependencies on frameworks, databases, or HTTP. This makes it:
- Easy to test with simple unit tests
- Portable to different contexts (CLI, background jobs, etc.)
- Focused purely on business rules

### 4. Define Interfaces in Domain, Implement in Infrastructure

The domain layer defines what it needs (e.g., `HistoryRepository` interface). The infrastructure layer provides concrete implementations (e.g., `InMemoryHistoryRepository`, `MongoHistoryRepository`). This is the Dependency Inversion Principle in action.

---

## Recommended Reading

### MDN: Express Routes and Controllers
**Link:** [Express Routes and Controllers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes)

An excellent tutorial-style introduction to organizing routes and controllers in Express. Explains how and why to separate route definitions from handler logic, and demonstrates building modular routes using `express.Router()`. Ideal for understanding the fundamentals of "where do routes and controllers go and why."

### Bulletproof Node.js Project Architecture
**Link:** [Bulletproof Node.js Project Architecture](https://softwareontheroad.com/ideal-nodejs-project-structure)

A practical guide to production-ready Node.js structure. Covers the 3-layer architecture (controllers, services, data access), explains why business logic shouldn't live in controllers, and discusses configuration management, dependency injection, and the pub/sub pattern for decoupling. Includes a companion [example repository](https://github.com/santiq/bulletproof-nodejs).

### Project Structure for an Express REST API When There Is No Standard Way
**Link:** [Project Structure When There Is No Standard Way](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way/)

A thoughtful article addressing the reality that Express doesn't prescribe structure. The key insight: focus on separating your logic into layers first, and the folder structure will emerge naturally. Emphasizes that the HTTP context (req/res) should end at the controller layer — don't pass Express objects into services.

### Node.js Project Architecture Best Practices
**Link:** [Node.js Project Architecture Best Practices](https://blog.logrocket.com/node-js-project-architecture-best-practices/)

A comprehensive overview of modern Node.js project organization. Covers folder structure, the MVC pattern, service and data access layers, dependency injection, configuration management, and testing. A good practical reference for "how things are typically done" in production Node.js applications.

### Exploring Design Patterns for Express.js Projects: MVC, Modular, and More
**Link:** [Express.js Design Patterns](https://dev.to/ehtisamhaq/exploring-design-patterns-for-expressjs-projects-mvc-modular-and-more-37lf)

Directly compares multiple architecture patterns: Feature-Based (Modular), Layered (MVC), and Domain-Driven Design. Includes example folder structures for each approach and guidance on when to choose which pattern. Particularly relevant for this project's "layers within modules" approach.

---

## Summary

Express's flexibility means you own your architecture decisions. The approach used in this project:

1. **Organizes by feature** — Each module is a self-contained unit
2. **Separates by layer** — Clear boundaries between HTTP handling, application logic, domain rules, and infrastructure
3. **Depends inward** — Outer layers depend on inner layers, never the reverse
4. **Injects dependencies** — Easy to test and swap implementations

This isn't the only valid approach, but it scales well from small projects to complex applications while keeping the codebase testable and maintainable.
