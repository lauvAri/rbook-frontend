# Repository Guidelines

## Project Structure & Module Organization
The app is a Vite + React + TypeScript frontend. Source lives under `src/`, with the main entry points in `src/main.tsx`, `src/App.tsx`, and routing in `src/router.ts` plus route files under `src/routes/`. Reusable UI components are grouped in `src/components/` using PascalCase folders (for example, `src/components/Button/`) with `index.ts` re-exports and CSS Modules (`*.module.css`). Feature-level modules sit in `src/features/`, shared logic in `src/utils/` and `src/lib/`, and state in `src/stores/` (Zustand). Static assets go in `public/`. Environment-specific settings live in `.env`, `.env.development`, and `.env.production`. Container and deployment helpers include `Dockerfile`, `docker-compose.yml`, and `nginx.conf`.

## Build, Test, and Development Commands
- `npm install`: Install dependencies from `package-lock.json`.
- `npm run dev`: Start the Vite dev server with HMR.
- `npm run build`: Type-check with `tsc -b` and build to `dist/`.
- `npm run preview`: Serve the production build locally.
- `npm run lint`: Run ESLint over the codebase.

## Coding Style & Naming Conventions
Use TypeScript + React (TSX). Match existing formatting in nearby files; ESLint is the primary guardrail (`eslint.config.js`). Component folders and files follow PascalCase (`Button.tsx`) with CSS Modules (`Button.module.css`). Routes follow file-based naming under `src/routes/`, including dynamic segments like `scripts.$scriptId.tsx`.

## Testing Guidelines
No test runner or test files are present in the repository. If tests are added, align file names with the framework defaults (for example, `*.test.tsx`) and document the new test command in `package.json`.

## Commit & Pull Request Guidelines
This workspace does not contain Git history, so no commit message convention is detectable. If you initialize Git, document the preferred format (for example, Conventional Commits) in this file. No PR template is present; include a short summary, the commands run, and screenshots for UI changes.

## Configuration & Security Notes
Check `.env*` files for required runtime settings. Avoid committing secrets; use environment variables and document any new keys in this guide.
