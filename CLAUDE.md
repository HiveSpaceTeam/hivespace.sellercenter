# CLAUDE.md

## Tech Stack

- Vue 3 Composition API (`<script setup lang="ts">`)
- Vite · TypeScript · Tailwind CSS v4
- Pinia (state) · Vue Router 4 · vue-i18n
- `@hivespace/shared` — auth, HTTP client, layout shells, global store
- OIDC via `oidc-client-ts`

## Commands

```bash
npm run dev          # Dev server at http://localhost:5174
npm run build        # Production build (includes type-check)
npm run build-only   # Production build (skips type-check)
npm run lint         # ESLint with auto-fix
npm run type-check   # TypeScript validation
npm run format       # Prettier formatting
```

**Known baseline failures** (do not fix unless working on those files):

- `type-check`: ~11 errors — missing `@/services/user.service`, missing `quill-image-uploader` types, TS strict violations in demo files.
- `lint`: ~15 errors in demo components.
- `build` still succeeds.

## Environment Setup

Create `.env` in the project root:

```env
VITE_APP_CLIENT_ID=your-oidc-client-id
VITE_GATEWAY_BASE_URL=https://localhost:7001
VITE_APP_REDIRECT_URI=http://localhost:5174/callback/login
VITE_APP_POST_LOGOUT_REDIRECT_URI=http://localhost:5174/callback/logout
VITE_APP_SCOPE=openid profile email offline_access
VITE_APP_ENVIRONMENT=development
VITE_ENABLE_LOGGING=true
VITE_ENABLE_DEBUG=true
```

Config singleton built at startup in `src/config/index.ts`. Gateway URL resolved via `VITE_GATEWAY_BASE_URL` → `VITE_API_BASE_URL` → `VITE_API_URL`.

## Architecture

```text
src/
├── components/     # Reusable UI (common/, charts/, forms/, layout/, tables/)
├── views/          # Page-level route components
├── stores/         # Pinia stores — useStoreStore, useUserStore, useMediaStore, useCouponStore, useOrderStore
├── services/       # api.ts (ApiService instance) + *.service.ts per domain
├── types/          # api/, store/, utils/ subdirs; all exported from index.ts
├── composables/    # Shared Composition API logic
├── router/         # Vue Router + beforeEach auth guard
├── i18n/           # locales/{en,vi}/{module}.json merged in src/i18n/index.ts
├── icons/          # SVG components exported via index.ts
└── config/         # Env config singleton
```

## Key Patterns

### Shared library (`@hivespace/shared`)

Do **not** re-implement anything already exported by `@hivespace/shared`:

- `useAuth`, `useAppStore`, `ApiService`, `AppUser` — auth, notifications, HTTP
- Layout shells: `Default`, `Maintenance`, `NotFound`, `ServerError`, `demoRoutes`
- Shared i18n base translations — merge with local overrides in `src/i18n/index.ts`

**Before building any new UI component**, check `hivespace.ui-shared/src/components/` for an existing implementation. The shared library provides components in `common/`, `charts/`, `layout/`, `modal/`, `tables/` — reuse before creating.

### API layer (`src/services/api.ts`)

`apiService` is an `ApiService` instance configured with:

- Base URL from `config.api.baseUrl`
- `ensureFreshUser` callback → runs refresh-token exchange via `src/services/refresh.service.ts`; forces logout on `invalid_grant`
- `notifyCallback` → calls `useAppStore().notifyError(...)` for HTTP error toasts with i18n-sourced messages

Import `apiService` from `@/services/api` in all service files.

### Auth flow (`src/router/index.ts`)

1. `meta.allowAnonymous: true` → skip auth
2. Admins / system-admins → logout (this app is seller-only)
3. Non-seller with unverified email → `/verify-email`
4. Non-seller with verified email → `/register-seller`
5. Verified seller → pass through

### State management

- Pinia stores only — no prop drilling
- `useAppStore` imported directly from `@hivespace/shared` — **do not re-export it** from local stores
- Use `storeToRefs` when destructuring stores to preserve reactivity
- Toast: `useAppStore().notifySuccess/notifyError/notifyInfo`
- Stores are the single source of truth; components trigger actions and reactively display state

### API Integration Process

For each new backend domain, follow these four steps in order:

1. **Service** (`src/services/{module}.service.ts`) — HTTP calls only, no state
2. **Store** (`src/stores/{module}.ts`) — owns loading/error/data state; calls the service
3. **Expose via `storeToRefs`** — components import the store and destructure with `storeToRefs`; they must not call service methods directly
4. **Component triggers action** (e.g. `store.fetchData()`) and renders reactive state

### i18n

- Default locale: Vietnamese (`vi`); fallback: English (`en`)
- Files: `src/i18n/locales/{en,vi}/{module}.json`
- Shared translations merged first; local keys override
- Key structure: `module.subkey` (e.g., `orders.status.pending`)
- When adding a feature: create `{module}.json` for both `en` and `vi`, import in `src/i18n/index.ts`

## Feature Development Order

1. **Types** → `src/types/api/{module}.types.ts` and `src/types/store/{module}.types.ts`; export from `src/types/index.ts`
2. **Service** → `src/services/{module}.service.ts` using `apiService`
3. **Store** → `src/stores/{module}.ts`; export from `src/stores/index.ts`
4. **Components** → `src/components/` (reusable) or `src/views/` (page-level)
5. **Route** → `src/router/index.ts`
6. **i18n** → `src/i18n/locales/en/{module}.json` + `vi/{module}.json`; import in `src/i18n/index.ts`

## Component Patterns

- **Container / Presentational**: Views (`src/views/`) orchestrate data and logic; components (`src/components/`) only render UI and emit events — no direct service calls from presentational components.
- **Composables**: Extract reusable stateful logic into `src/composables/` (e.g. `useModal.ts`, `usePagination.ts`). One composable per logical concern.
- **Icons**: New SVG icons go into `src/icons/` as `.vue` components and must be exported from `src/icons/index.ts`.

## Types & Interfaces

```
src/types/
├── api/      # Request/response shapes and backend contracts
├── store/    # Pinia store state interfaces and action types
└── utils/    # Common utility/helper types
```

- Shared types: add to the appropriate subdir, export from `src/types/index.ts`
- Component-specific types: define inline in the component file unless reused elsewhere
- Import pattern: `import type { Foo } from '@/types'`

## Code Conventions

- **Components**: `<script setup lang="ts">` exclusively — no Options API
- **Styling**: Tailwind CSS utility classes only; custom CSS only when no utility class applies
- **Functions**: Arrow functions exclusively (except top-level declarations requiring hoisting)
- **Naming**: PascalCase `.vue` files; kebab-case `.ts` service/util files; camelCase variables/functions
- **Text**: All user-facing strings via `$t('module.key')` — no hardcoded text
- **Types**: `import type { Foo } from '@/types'` for shared types; component-local types stay in the component file
- **State**: Pinia for all shared state — `storeToRefs` when destructuring
- **Error handling**: `try/finally` with `useAppStore().setLoading(true/false)` in stores; display errors via `notifyError`
- **Props/emits**: Always typed with `defineProps<{...}>()` and `defineEmits<{...}>()`

## Development Workflow

1. Run `npm run lint` before and after changes — fix any new errors introduced
2. Make incremental changes and verify in the browser between steps
3. Before adding any new UI, check `hivespace.ui-shared/src/components/` for an existing component
4. Test with both `npm run dev` (runtime) and `npm run build` (type-safe build)
