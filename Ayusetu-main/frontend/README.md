# Frontend Service

React + Vite + TypeScript + Tailwind CSS frontend for the Academia-Industry Collaboration Portal.

## Features

- **React 18** with TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Vitest** for testing
- **ESLint + Prettier** for code quality

## Structure

```
src/
├── types/           # TypeScript type definitions
│   └── api.ts      # API response types
├── test/           # Test utilities
│   └── setup.ts    # Vitest setup
├── App.tsx         # Root component
├── main.tsx        # Application entry point
└── index.css       # Global styles (Tailwind)
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API URLs
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

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run Vitest tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for required configuration.

All frontend environment variables must be prefixed with `VITE_` to be exposed to the client.

## Port

Default: **5173**

## API Proxy

The Vite dev server is configured to proxy `/api` requests to the backend at `http://localhost:5000`.

## Styling

This project uses **Tailwind CSS** with a custom color palette defined in `tailwind.config.js`.

## Testing

- **Framework**: Vitest
- **Utils**: React Testing Library
- **Coverage**: v8 provider

Run tests with:
```bash
npm test
```

## Build

Production build outputs to `dist/`:
```bash
npm run build
```
