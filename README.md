# MVC Calculator

A MVC structured calculator Express app built with TypeScript.

## Prerequisites

- Node.js >= 24.0.0
- npm >= 11.0.0

## Installation

```bash
npm install
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Building

Build the TypeScript code to JavaScript:

```bash
npm run build
```

## Running in Production

```bash
npm start
```

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test:watch
```

Run tests with coverage:

```bash
npm test:coverage
```

## Linting and Formatting

Run ESLint:

```bash
npm run lint
```

Fix ESLint issues automatically:

```bash
npm run lint:fix
```

Format code with Prettier:

```bash
npm run format
```

## API Endpoints

### Health Check

- **GET** `/health`
  - Returns: `Service is up and running`
  - Status: 200 OK

## Project Structure

```
mvc-calculator/
├── src/
│   ├── app.ts          # Express app configuration
│   ├── server.ts       # Server entry point
│   └── app.test.ts     # Tests
├── dist/               # Compiled JavaScript (gitignored)
├── node_modules/       # Dependencies (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json       # TypeScript configuration
├── eslint.config.mjs   # ESLint configuration
├── jest.config.mjs     # Jest configuration
├── .prettierrc         # Prettier configuration
└── README.md
```

## License

ISC
