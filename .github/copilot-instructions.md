## Copilot Instructions – KG Security System Frontend

Goal: Give AI agents the minimum, project-specific context to implement features safely and consistently (React + TS + Vite + Tailwind v4 + TanStack Query + Axios + zod).

### Core Architecture
- Providers stack (`src/Providers.tsx`): `QueryClientProvider` → `AuthProvider` → `BrowserRouter` (React Router v7 style imports from `react-router`).
- Auth: `contexts/auth-context.tsx` stores `accessToken` in state + `localStorage` and mirrors it to `window.__ACCESS_TOKEN` so the Axios interceptor always has the latest token before re-render cycles.
- Routing: `Routes.tsx` wraps route groups with `ProtectedRoute` / `PublicOnlyRoute`. Protected content (e.g. `/home`) also nests inside a layout shell (`components/layout/sidebar-project.tsx`). Add new protected pages inside the `<Route element={<ProtectedRoute/>}>` block and (if using the sidebar chrome) beneath the sidebar layout element.
- API Layer: Single Axios instance in `lib/api.ts`. Request interceptor attaches `Authorization` if token present. Response interceptor unwraps the unified `{ success, content, message }` envelope (types in `interfaces/api-result.ts`) and throws `ApiError` on failures. Never duplicate unwrap logic.
- React Query: Singleton `queryClient` (`lib/tanstack-query.ts`). Use stable array keys; invalidate explicitly after mutations.
- Env handling: Only read env via `env.ts` (zod-validated). Extend `envSchema` when adding variables.

### UI & Styling Patterns
- Design system primitives live in `components/ui/*` and expose semantic `data-slot` attributes (e.g. `<div data-slot="card-header"/>`). Reuse these rather than re-styling raw HTML elements.
- Variant patterns: Use `class-variance-authority` (see `button.tsx`) instead of conditional string concatenation scattered across components.
- Layout / Navigation: Sidebar system (`components/ui/sidebar.tsx`) uses internal state + CSS variables (width constants) and keyboard shortcut `b`. High-level composition example: `components/app-sidebar.tsx` combines sample nav data with `NavProjects` / `NavUser`.
- shadcn-based approach: Treat existing primitives as canonical (they already wrap Radix + Tailwind). When adding UI:
	- Prefer composing existing primitives over creating raw `<div>`/`<button>` with new class strings.
	- If a new variant/state is needed, extend the relevant `cva` config (e.g., `buttonVariants`) instead of branching with inline conditionals.
	- Only create a brand‑new primitive in `components/ui/` if it will be reused across multiple features; otherwise compose locally in the page/feature layer.
	- Maintain `data-slot` semantics (match existing naming conventions) to keep themable surface consistent.

### Typical Implementation Flows
1. New API call: add function to `src/services/<domain>.ts` using `api.get/post<Expected>()`; return the already unwrapped data; keep side-effects out.
2. New protected page: create `src/pages/NewFeature/index.tsx`, add a `<Route path="/new-feature" element={<NewFeature/>} />` inside the protected + sidebar route branch.
3. Mutation pattern: `const mutation = useMutation({ mutationFn: serviceFn, onError: (e)=> setErr(parseApiError(e,'Fallback')) });` (mirror `pages/Login`).
4. Auth state changes: call `useAuth().login(response)` with full `LoginResponse` for token persistence; logout via `useAuth().logout()` to clear storage + in-memory cache.

### Conventions
- Imports: Always prefer `@/` alias; avoid relative `../../../` paths.
- Errors surfaced to UI must pass through `parseApiError(error, msg)` for consistent messaging.
- Do NOT create additional Axios instances; extend the existing one if needed (e.g., custom headers) by cloning config per call.
- Keep services pure (no navigation, no localStorage). Put navigation in pages/hooks.
- Component structure: small stateless wrappers exposing `data-slot` for theming; extend by wrapping, not editing internals unless adding a truly shared capability.

### Commands
- Dev server: `pnpm dev` (uses `VITE_PORT` or 3000).
- Build: `pnpm build` (type check + bundle). Lint/format: `pnpm biome:check` (or `:lint`, `:format`). Type-only check: `pnpm typecheck`.

### Avoid
- Reading `import.meta.env` outside `env.ts`.
- Bypassing interceptors, or manually parsing the API envelope.
- Embedding network logic directly in React components.
- Introducing new global state libraries before validating React Query + Context suffices.

### Reference Examples
Login flow: `pages/Login/index.tsx` (mutation + error parsing + auth context). Auth boundary: `components/auth/protected-route.tsx`. API pattern: `services/auth.ts` + `lib/api.ts`. UI variant pattern: `components/ui/button.tsx`. Sidebar composition: `components/app-sidebar.tsx`.

If something is unclear (e.g., adding query invalidation helpers, expanding sidebar navigation data strategy) leave a concise TODO in code and surface a note in PR.

(End – request feedback: note any missing areas like test harness setup, future token refresh strategy, or i18n.)