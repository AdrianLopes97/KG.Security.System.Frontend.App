# Copilot Instructions for KG Security System Frontend

Purpose: Enable AI coding agents to contribute productively and consistently within this React + TypeScript + Vite application.

## Architecture & Core Concepts
- Tech stack: Vite + React 19 (TSX), TanStack Query v5, Axios, Tailwind CSS v4 (with `@tailwindcss/vite`), class-variance-authority for design tokens, zod for runtime env validation.
- Directory layout highlights:
  - `src/env.ts` validates required environment variables (e.g. `VITE_BASE_API_URL`) using zod. Always access env through this module—do not read `import.meta.env` directly elsewhere.
  - `src/lib/api.ts` central Axios instance. Response interceptor unwraps unified backend envelope `ApiResult<T>`; on success returns `response.data = content`; on error throws `ApiError` (custom error carrying original payload). Avoid duplicating unwrapping logic—re-use this instance.
  - `src/lib/tanstack-query.ts` exports a singleton `queryClient`; use this for React Query provider & invalidation patterns.
  - `src/interfaces/api-result.ts` defines the canonical API envelope + type guards + `ApiError` and `unwrapApiResult` helper.
  - `src/services/*` service-layer wrappers (e.g. `auth.ts`) isolate endpoint paths; keep them thin and typed.
  - `src/utils/parse-api-error.ts` extracts a user-friendly message from unknown/axios errors. Use in UI error boundaries, mutations, and toast/alert flows.
  - `src/components/ui/*` design-system primitives using tailwind + cva with semantic `data-slot` attributes for styling consistency.

## API & Data Flow Pattern
1. UI (page/component) triggers a React Query mutation or query.
2. Service function (e.g. `login(credentials)`) calls `api` from `lib/api.ts` with typed generics `<ExpectedResponse>`.
3. Axios interceptor unwraps `{ success: true, content }` into raw domain object; errors become thrown `ApiError` (message preserved). Catch errors at UI/mutation boundary and pass to `parseApiError` for messaging.
4. Tokens or session data (currently `accessToken` only) are manually persisted (see `pages/Login`). Future enhancements: central auth context / secure storage.

## Conventions & Guidelines
- Imports: Use `@/` alias for anything under `src/` (configured in `tsconfig` + `vite.config.ts`). Prefer grouped logical layers: `@/lib`, `@/services`, `@/components`, `@/pages`.
- Do not bypass the interceptor by creating ad-hoc Axios instances—extend `api` if customization needed.
- If backend returns the unified envelope and you need raw metadata, extend response typing instead of removing interceptor.
- Errors shown to end users should go through `parseApiError(error, fallback)` for localization-friendly messaging.
- Keep service functions pure & side-effect free (no direct `localStorage`, navigation, or UI logic). Handle those in pages/hooks.
- When adding React Query usage: always supply a stable key array (`['resource', id]`) and leverage invalidate patterns centrally (e.g. helper constants if growth requires).
- UI components: Extend existing primitives; follow established pattern `(props) => <div data-slot="..." />` and reuse `cn` (`lib/utils.ts`) + `cva` variant pattern.
- Tailwind: Favor semantic composition via variants instead of inline duplications; check existing `buttonVariants` & `alertVariants` before adding new tokens.
- Env vars: Add to `envSchema` with explicit zod validation & defaults; never assume optional presence at runtime.

## Typical Tasks (Examples)
- New service endpoint: create `src/services/<domain>.ts`, import `api`, export typed async function returning the unwrapped entity; let interceptor shape result.
- New mutation page: use `useMutation({ mutationFn: serviceFn, onError: (e)=> setErr(parseApiError(e)) })` mirroring `pages/Login`.
- Adding a component variant: extend the `cva` definition (e.g. `buttonVariants`) rather than branching inside the component body.

## Build & Tooling
- Dev: `pnpm dev` (served on port `VITE_PORT` or default 3000).
- Build: `pnpm build` runs type build (`tsc -b`) then Vite bundle.
- Type check only: `pnpm typecheck`.
- Formatting / lint (Biome): `pnpm biome:format`, `pnpm biome:lint`, `pnpm biome:check` (writes by design; avoid committing unformatted code).

## Adding Dependencies
- Use `pnpm add <pkg>`; keep runtime deps vs dev deps clear (`-D`). Ensure type packages only when not bundled with library.

## Testing & Future Considerations
- (No test harness yet) — if adding tests, co-locate under `src/__tests__` or adopt a dedicated `tests/` folder; ensure service layer remains easily mockable via the centralized `api`.

## Things To Avoid
- Duplicating API unwrap logic.
- Directly reading `import.meta.env` outside `env.ts`.
- Embedding fetch/axios calls inside React components—route via service functions.
- Introducing new global state libs without assessing if React Query suffices.

## When Unsure
Reference existing patterns in: `pages/Login/index.tsx`, `services/auth.ts`, `components/ui/button.tsx`, `lib/api.ts`.

(End) — Please review and indicate if any sections need deeper coverage (e.g., planned auth context, routing strategy, state management extensions).