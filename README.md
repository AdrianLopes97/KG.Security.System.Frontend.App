# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## Authentication & Route Protection

A lightweight auth layer was added following the architecture guidelines (centralized service + context + Axios interceptor):

### Files
- `src/contexts/auth-context.tsx`: Manages `accessToken` state, persistence (localStorage), tab synchronization, and exposes `login`, `logout` + `isAuthenticated`.
- `src/lib/api.ts`: Request interceptor attaches `Authorization: Bearer <token>` when a token exists.
- `src/components/auth/protected-route.tsx`: Route guard components `ProtectedRoute` (requires auth) and `PublicOnlyRoute` (redirects if already authenticated).
- `src/pages/Login/index.tsx`: Uses `useAuth()` to persist the token after successful login and navigate to `/home`.
- `src/Routes.tsx`: Applies guards so `/home` and nested routes are protected; `/login` is inaccessible when authenticated.

### Usage Pattern
1. Perform login via service (`login(credentials)`), then call `auth.login(response)` with the returned `LoginResponse`.
2. For logout (e.g., future UI button): `const { logout } = useAuth(); logout();` then navigate to `/login`.
3. Any new protected routes should be nested inside the `<Route element={<ProtectedRoute />}>` block.
4. To prevent logged-in users from seeing pages (login/register), wrap content with `<PublicOnlyRoute>`.

### Extending
- Add user profile decoding (e.g., from JWT) inside `login()` and store as new `user` field in context.
- Implement refresh token logic by adding another request/response interceptor pair handling 401 responses.

### Token Storage Notes
Currently uses `localStorage` for simplicity; consider moving to an HTTP-only cookie or secure storage for production security requirements.

---
