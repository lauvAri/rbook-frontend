# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

R-Book is a React + TypeScript + Vite frontend application for executing R language scripts and managing statistical analysis workflows. The application is designed mobile-first with responsive web support, featuring a code execution engine with variable substitution and CSV file upload capabilities.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Core Architecture

### Tech Stack
- **Build Tool**: Vite with React Fast Refresh
- **Compiler**: React Compiler enabled (babel-plugin-react-compiler)
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand for global state, TanStack Query for server state
- **HTTP Client**: Axios with interceptors for auth tokens
- **UI Components**: Custom components with CSS Modules
- **Styling**: CSS custom properties for theming (light/dark mode support)

### Path Aliases
- `@/` maps to `src/` (configured in vite.config.ts)

### Feature-Based Architecture

The codebase follows a feature-based organization pattern:

```
src/
├── features/           # Feature modules with domain-specific logic
│   ├── code-runner/   # R script execution feature
│   │   ├── api/       # API calls
│   │   ├── components/ # Feature-specific components
│   │   ├── hooks/     # Feature-specific hooks
│   │   └── types/     # Feature-specific types
│   └── user/          # User authentication and management
│       ├── api/
│       ├── stores/    # User state (Zustand)
│       └── types/
├── components/        # Shared UI components (Button, Card, Input, etc.)
├── lib/              # Third-party library configurations
│   ├── axios.ts      # Pre-configured axios instance with auth
│   └── react-query.ts # TanStack Query configuration
├── routes/           # Route components (TanStack Router)
├── stores/           # Global state (Zustand) - only cross-feature state
└── utils/            # Shared utility functions
```

### Key Architectural Patterns

**1. Axios Configuration (src/lib/axios.ts)**
- Automatically attaches Bearer token from localStorage to all requests
- Handles 401 responses by clearing auth state and redirecting to /login
- Base URL configured via `VITE_API_URL` environment variable (default: http://localhost:8080/api)

**2. State Management**
- **User Auth State**: Stored in Zustand with localStorage persistence (`user-storage` key)
- **Server State**: Managed by TanStack Query with 1-minute stale time, no refetch on window focus
- **Theme State**: Global Zustand store in `src/stores/theme.ts` for light/dark mode

**3. Routing Structure**
- Routes defined in `src/router.ts` with component imports from `src/routes/`
- Dynamic segments use `$` prefix (e.g., `scripts.$scriptId.tsx`)
- Search params validated with `validateSearch` (page, chapter, etc.)
- Layout wrapper in `src/routes/__root.tsx`

**4. Component Organization**
- Shared components in `src/components/` with PascalCase folder names
- Each component folder contains: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts`
- Feature-specific components stay within their feature folder

## Backend API Integration

The API documentation is located at `docs/api.md`. Key points:

- **Base URL**: `/api` (proxied in development)
- **Authentication**: Bearer token in Authorization header (handled automatically by axios)
- **Response Format**: `{ code: number, message: string, data: any }`
- **Error Codes**: 0 = success, 401 = unauthorized, 403 = forbidden, 1001-1004 = domain errors

### Key API Endpoints

**Scripts (Code Runner)**
- `GET /code-runner/scripts?chapter={name}` - List scripts with optional chapter filter
- `GET /code-runner/scripts/{id}` - Get script details
- `POST /code-runner/execute` - Execute R script with variables/fileData

**User Management**
- `POST /user/login` - Login with captcha verification
- `POST /user/logout` - Logout
- `GET /user/list` - Admin: list all users
- `POST /user/batch-import` - Admin: bulk create users

**Admin Endpoints**
- `/admin/scripts/*` - Script CRUD operations
- `/admin/chapters/*` - Chapter management
- `/admin/users/*` - User management and logs

### Script Execution

R scripts support three execution modes:
1. **Direct execution**: No parameters
2. **Variable substitution**: Pass variables object with dynamic parameters
3. **File upload**: Pass fileData (CSV string) and isRawInput flag

Execution results return an array of outputs with `type: "text"` or `type: "image"` (base64-encoded PNG/JPEG).

## UI Design Guidelines

**Color Scheme** (defined in `src/index.css`):
- Primary: `#0984e3` (blue)
- Accent: `#fdcb6e` (yellow)
- Avoid blue-purple gradients; use solid colors (small components may use gradients)

**Theme Support**:
- Components must support both light and dark modes using CSS custom properties from `src/index.css`
- Theme toggle available via `ThemeToggleButton` component
- Theme state persisted in localStorage

**Responsive Design**:
- Mobile-first approach
- Adapt layouts for larger screens while maintaining mobile usability

## Environment Variables

Required environment variables in `.env` files:

```bash
# .env
VITE_APP_NAME=R-Book

# .env.development
VITE_API_URL=http://localhost:8080/api

# .env.production
VITE_API_URL=/api
```

## Docker Deployment

The project includes Docker support:
- `Dockerfile` for containerization
- `docker-compose.yml` for orchestration
- `nginx.conf` for production serving

## TypeScript Configuration

- `tsconfig.json` - Root config
- `tsconfig.app.json` - Application code (src/)
- `tsconfig.node.json` - Node/Vite config files

## Important Notes

- React Compiler is enabled, which impacts dev/build performance but optimizes runtime
- Monaco Editor is used for code editing (`@monaco-editor/react`)
- Markdown rendering with KaTeX math support (via `react-markdown`, `remark-math`, `rehype-katex`)
- GFM (GitHub Flavored Markdown) supported via `remark-gfm`
- CSS Modules used for component styling to prevent style conflicts
