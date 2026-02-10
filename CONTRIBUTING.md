# Contributing Guide for AI Agents and Assistants

Thank you for contributing to the MVC Calculator project! This guide is specifically designed for AI agents and assistants to help make effective contributions.

## Quick Start

1. Explore the codebase before making changes
2. Run existing tests to understand current functionality
3. Make minimal, focused changes
4. Write tests for your changes
5. Ensure all tests pass and code is properly formatted

## Contribution Workflow

### 1. Understanding the Task

- Read the issue or requirement completely
- Identify the minimal changes needed
- Consider edge cases and potential impacts
- Ask clarifying questions if needed

### 2. Exploring the Codebase

Before making changes:

```bash
# View project structure
ls -la src/

# Check existing tests
npm test

# Review code quality
npm run lint
```

### 3. Making Changes

**Golden Rules:**
- Make the smallest possible changes to achieve the goal
- Follow existing code patterns and conventions
- Don't modify unrelated code
- Don't remove working functionality unless necessary

**TypeScript Guidelines:**
- Use proper types (avoid `any`)
- Export functions and types appropriately
- Use interfaces for object shapes
- Enable strict mode checks

**Code Style:**
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments only when necessary for clarity

### 4. Writing Tests

All new functionality must include tests:

```typescript
// Example test structure
describe('Feature Name', () => {
  it('should handle normal case', async () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = await someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });

  it('should handle edge case', async () => {
    // Test edge cases
  });

  it('should handle error case', async () => {
    // Test error handling
  });
});
```

**Testing Best Practices:**
- Test both success and failure cases
- Use descriptive test names
- Keep tests independent
- Don't test implementation details
- Use supertest for API endpoint testing

### 5. Running Quality Checks

Before committing, ensure:

```bash
# Build succeeds
npm run build

# All tests pass
npm test

# No linting errors
npm run lint

# Code is formatted
npm run format
```

### 6. Committing Changes

- Write clear, concise commit messages
- One logical change per commit
- Use present tense ("Add feature" not "Added feature")
- Reference issue numbers when applicable

Example commit messages:
- `Add /calculate endpoint for basic operations`
- `Fix validation error handling in calculator`
- `Update README with API documentation`

## Code Review Checklist

Before submitting your changes, verify:

- [ ] Code compiles without TypeScript errors
- [ ] All tests pass
- [ ] New functionality has tests
- [ ] Code follows ESLint rules
- [ ] Code is formatted with Prettier
- [ ] No console.log statements left in code
- [ ] Error handling is appropriate
- [ ] Documentation is updated if needed
- [ ] No sensitive data or secrets in code

## Common Tasks

### Adding a New Endpoint

1. Add route handler in `src/app.ts`
2. Create controller function if complex logic needed
3. Add types for request/response
4. Write tests in corresponding `.test.ts` file
5. Update API documentation in README

### Adding Business Logic

1. Create new file in appropriate directory
2. Export functions with proper types
3. Keep functions pure when possible
4. Write comprehensive tests
5. Import and use in route handlers

### Fixing a Bug

1. Write a failing test that reproduces the bug
2. Fix the bug with minimal changes
3. Ensure the test now passes
4. Verify no other tests are broken

## TypeScript Patterns

### Function with Types

```typescript
interface InputData {
  value: number;
  operation: string;
}

function processData(input: InputData): string {
  // Implementation
  return result;
}
```

### Express Handler with Types

```typescript
interface CustomRequest extends Request {
  customProperty?: string;
}

app.post('/endpoint', (req: CustomRequest, res: Response) => {
  // Implementation
});
```

### Error Handling

```typescript
try {
  const result = await riskyOperation();
  res.status(200).json({ data: result });
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

## Testing Patterns

### API Endpoint Test

```typescript
import request from 'supertest';
import app from './app';

describe('POST /endpoint', () => {
  it('should process valid request', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send({ data: 'test' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result');
  });
});
```

### Unit Test

```typescript
import { functionToTest } from './module';

describe('functionToTest', () => {
  it('should return expected result', () => {
    const result = functionToTest('input');
    expect(result).toBe('expected');
  });
});
```

## Debugging Tips

### TypeScript Errors
```bash
# See all type errors
npm run build
```

### Test Failures
```bash
# Run specific test file
npm test -- app.test.ts

# Run tests in watch mode
npm run test:watch
```

### Runtime Errors
```bash
# Run in development with detailed logging
npm run dev
```

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Guide](https://github.com/visionmedia/supertest)

## Questions?

If you need clarification:
1. Check existing code for patterns
2. Review test files for examples
3. Check AGENTS.md for AI-specific guidance
4. Consult README.md for project overview

## Remember

- **Minimal changes**: Only change what's necessary
- **Test everything**: All code should be tested
- **Follow patterns**: Match existing code style
- **Think about users**: Consider how changes affect users
- **Ask when unsure**: Better to ask than make wrong assumptions

Happy contributing! 🚀
