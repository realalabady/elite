<!-- Copilot / AI agent instructions for this repository -->

# Copilot instructions — Elite Medical Booking

Purpose

- Help contributors and AI agents understand the repo structure, run/build conventions, and project-specific patterns so suggestions and code changes are correct and consistent.

Quick architecture summary

- Frontend: React + TypeScript + Vite (UI uses Shadcn components + Radix primitives). See [src/components](src/components) and [src/pages](src/pages).
- Backend: NestJS app in [src/backend](src/backend). Entry point: [src/backend/main.ts](src/backend/main.ts#L1).
- Database: Prisma + PostgreSQL. Schema: [prisma/schema.prisma](prisma/schema.prisma). Generated client lives under [generated/prisma](generated/prisma).
- Local mock alternative: `json-server` using `db.json` and middleware files (`middleware.cjs` / `middleware.js`).

Important scripts (use these exactly)

- `npm run dev` — start frontend (Vite). Use this during UI changes.
- `npm run backend:dev` — run NestJS backend in TS (uses `tsx` and `tsconfig.backend.json`). Backend listens on port 3002 by default (see [src/backend/main.ts](src/backend/main.ts#L1)).
- `npm run backend:dev:json` — start backend with `USE_JSON_SERVER=true`, useful when using `json-server` instead of Prisma.
- `npm run json-server` — start json-server (serves `db.json` on port 3002 with middleware). Useful for frontend-only iterative work.
- `npm run build` — frontend production build (Vite). `npm run backend:start:prod` builds TypeScript backend and runs `dist/main.js`.

Conventions & patterns

- API surface: follow existing REST patterns in controllers under [src/backend/\*controller.ts](src/backend). Use DTOs in the `booking/dto` folder for input validation.
- Static assets: backend serves `public/` (see `useStaticAssets` in [src/backend/main.ts](src/backend/main.ts#L1)). Keep public assets here.
- Prisma: prefer using `npx prisma generate`, `npx prisma db push`, and `npx prisma db seed` for schema changes. Generated Prisma client is imported from `generated/prisma` in backend services.
- Frontend data layer: services in `src/services/api.ts` are the central place for HTTP calls; match existing fetch patterns and error handling.
- UI components: prefer reusing `src/components/ui/*` shadcn wrappers and `src/components/layout/*` for consistent styling.

TypeScript configs

- There are separate TS configs: `tsconfig.app.json` (frontend), `tsconfig.backend.json` (backend). When modifying backend tooling, target the backend TS config.

When changing backend APIs

- Update the controller, service, DTO, and Prisma usage together. Follow existing patterns in `appointments.controller.ts`, `doctors.controller.ts`, and `services.controller.ts`.
- If it touches DB schema, add Prisma schema changes and run `npx prisma db push` + `npx prisma generate`. Seed data lives in `prisma/seed.ts`.

Local development notes

- To iterate UI only: run `npm run dev` and point the Vite dev server at the backend (set `VITE_API_URL` in `.env` or use the default). For quick frontend-only endpoints, run `npm run json-server`.
- To run full stack locally: open two shells:
  1. `npm run backend:dev` (or `npm run backend:dev:json`)
  2. `npm run dev`

Code style and linting

- ESLint is configured; run `npm run lint` before committing changes. Follow existing code patterns (React hooks, shadcn component usage, and file organization).

Useful files to reference

- Backend entry and CORS/static config: [src/backend/main.ts](src/backend/main.ts#L1)
- Controllers: [src/backend/\*.controller.ts](src/backend)
- Services: [src/backend/\*.service.ts](src/backend)
- Prisma schema & seed: [prisma/schema.prisma](prisma/schema.prisma) and [prisma/seed.ts](prisma/seed.ts)
- Frontend entry: [src/main.tsx](src/main.tsx)
- UI components: [src/components/ui](src/components/ui) and [src/components/layout](src/components/layout)

What to avoid

- Don't change API ports or static asset paths without updating `src/backend/main.ts` and `VITE_API_URL` usages.
- Avoid adding global CSS outside `src/index.css` / `src/App.css`; follow Tailwind utility usage.

If you need to run tests or DB migration

- Tests: no dedicated test scripts are present in the repo; inspect `package.json` before adding test runners.
- DB migrations: the repo contains `prisma/migrations/` — for schema evolution prefer `npx prisma migrate dev` only when you need a new migration record.

Questions or missing information

- If backend credentials, hosting, or CI details are needed, ask the repo owner — they are not checked in here.

---

If anything here is unclear or you want more specific examples (adding an endpoint, creating a component, or running the seed), say which area and I will expand the instructions.
