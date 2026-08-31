# Backend Service

Node.js + Express + TypeScript backend for the Academia-Industry Collaboration Portal.

## Features

- **Express.js** REST API with TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Security**: Helmet, CORS, rate limiting
- **Testing**: Jest + Supertest + fast-check (property-based testing)
- **Code Quality**: ESLint + Prettier

## Structure

```
src/
├── config/           # Configuration files
│   └── database.ts   # MongoDB connection
├── types/            # TypeScript type definitions
│   └── apiResponse.ts # API response envelope
└── index.ts          # Application entry point
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## API Response Format

All endpoints return responses in this format:

```typescript
{
  success: boolean;
  message: string;
  data?: any;
  errors?: Array<{ field?: string; message: string }>;
}
```

## Environment Variables

See `.env.example` for required configuration.

## Port

Default: **5000**
