# AI Agents Guide

This document provides guidance for AI agents and assistants working on this codebase.

## Project Overview

This is a TypeScript-based Express.js application following the MVC (Model-View-Controller) architecture pattern. The project is designed to be a calculator application with a RESTful API.

## Technology Stack

- **Runtime**: Node.js 24+
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Jest with Supertest
- **Code Quality**: ESLint + Prettier

## Code Style and Standards

### TypeScript

- Always use strict TypeScript settings
- Prefer interfaces over types for object definitions
- Use explicit return types for public functions
- Avoid using `any` type; use `unknown` or proper typing instead

### Code Organization

- Follow MVC pattern: Models, Views (if applicable), Controllers
- Keep business logic separate from routing
- One concern per file
- Maximum function length: ~20-30 lines
- Use descriptive variable and function names

### Testing

- Write tests for all new features
- Test files should be co-located with source files (e.g., `app.test.ts` next to `app.ts`)
- Use descriptive test names: `should return success when valid input provided`
- Aim for high test coverage (>80%)
- Test both happy paths and edge cases

### Error Handling

- Always handle errors gracefully
- Use proper HTTP status codes
- Return meaningful error messages
- Log errors appropriately

## Development Workflow

1. **Understand the Task**: Read the issue or requirement thoroughly
2. **Explore**: Review existing code to understand patterns and conventions
3. **Plan**: Create a minimal change plan before implementing
4. **Implement**: Make small, focused changes
5. **Test**: Write and run tests for your changes
6. **Lint**: Ensure code passes linting and formatting checks
7. **Review**: Review your changes before committing

## Commands Reference

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Compile TypeScript to JavaScript

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Check code with ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
```

## Best Practices for AI Agents

### Do's

- ✅ Make minimal, targeted changes
- ✅ Follow existing code patterns and conventions
- ✅ Write tests for new functionality
- ✅ Run tests after making changes
- ✅ Keep commits small and focused
- ✅ Use TypeScript features properly (types, interfaces)
- ✅ Handle errors appropriately
- ✅ Update documentation when needed

### Don'ts

- ❌ Don't modify unrelated code
- ❌ Don't remove existing tests unless they're broken
- ❌ Don't commit commented-out code
- ❌ Don't use `any` type unless absolutely necessary
- ❌ Don't ignore ESLint or TypeScript errors
- ❌ Don't skip writing tests
- ❌ Don't make breaking changes without discussion

## Common Patterns

### Express Route Handler

```typescript
app.get('/endpoint', (req: Request, res: Response) => {
  // Handle request
  res.status(200).json({ message: 'Success' });
});
```

### Writing Tests

```typescript
describe('Feature', () => {
  it('should do something specific', async () => {
    const response = await request(app).get('/endpoint');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `npm run build` to see all type errors
2. **Test Failures**: Run `npm test` to see detailed error messages
3. **Linting Issues**: Run `npm run lint` to see all issues
4. **Import Errors**: Check that paths are correct and files exist

## Getting Help

If you encounter issues:

1. Check existing code for similar patterns
2. Review test files for examples
3. Check the README.md for setup instructions
4. Consult the CONTRIBUTING.md for contribution guidelines
