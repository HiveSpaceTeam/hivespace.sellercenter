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

### Modal & Popup pattern

Always use `useModal` from `@hivespace/shared` for all modals and popups. Never create a local `ref<boolean>` to control modal visibility.

```typescript
import { useModal } from '@hivespace/shared'

const { openModal, closeModal } = useModal()

// Open a modal and await the user's result
const result = await openModal(MyModalComponent, { prop1: value1 })
```

**Key components** (import from `@hivespace/shared`):

| Component | Role |
|---|---|
| `ModalManager` | Place once in `App.vue` — renders whichever modal is currently active |
| `ModalWrapper` | Shell for modal content — provides title, description, close button, max-width |
| `ConfirmModal` | Pre-built confirmation dialog — use for delete / destructive actions |

Rules:
- `ModalManager` must exist in `App.vue` or the root layout; add it if it is missing
- The component passed to `openModal()` calls `closeModal(result)` to resolve the awaited promise
- Use `ConfirmModal` for any "are you sure?" interaction — never build a custom one
- Wrap form / content inside `ModalWrapper` so the modal chrome (header, close button) is consistent

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

## Loading States

Always use the shared loading components from `@hivespace/shared`. Never write raw `<div class="animate-spin ...">` inline.

| Situation | Component | When to use |
|---|---|---|
| Data loading inside a page section (table, list, card) | `<Spinner />` | The rest of the page stays interactive; only the content area is replaced |
| Blocking the entire UI (form submit, destructive action) | `<FullscreenLoader :visible="bool" :message="string" />` | User must not interact until the operation finishes |

**`Spinner`** — props: `size` (`'sm'` \| `'md'` \| `'lg'`, default `'md'`). Import from `@hivespace/shared`.

```vue
<!-- inline table/list loading state -->
<div v-if="appStore.isLoading" class="p-8 text-center">
  <Spinner />
  <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('...loading') }}</p>
</div>
```

**`FullscreenLoader`** — props: `visible` (boolean, required), `message` (string, optional). Import from `@hivespace/shared`. Place it at the root of the template so it teleports to `<body>`.

```vue
<FullscreenLoader :visible="submitting" :message="$t('...processing')" />
```

If unsure which to use, ask: "Does the user need to wait for this before doing anything else on the page?" → yes → `FullscreenLoader`; no → `Spinner`.

## UI Coding from Design Images

When the user shares a design image (screenshot, mockup, Figma export) and asks you to implement the UI:

1. **Scan `hivespace.ui-shared/src/components/` first** — before writing any new markup, identify which shared components can be reused or composed.
2. **Ask the user before coding** — list the shared components that map to elements in the design and confirm: _"I see `Button`, `Input`, `Select`, and `Tabs` from the shared library fit this design. Shall I use those, or do you have a reason to use a custom implementation?"_
3. **Propose shared component updates over local copies** — if a shared component is close but needs a new prop or variant, suggest updating it in `hivespace.ui-shared` rather than duplicating it locally.
4. **Never create local duplicates** — do not build a local `Button.vue`, `Modal.vue`, etc. when one already exists in `@hivespace/shared`.

**Shared component catalogue** (check `hivespace.ui-shared/src/components/common/` for the authoritative list):

| Category | Components available |
|---|---|
| Input / Form | `Input`, `TextArea`, `Select`, `MultipleSelect`, `Checkbox`, `Radio`, `RadioGroup`, `ToggleSwitch`, `FileInput`, `Dropzone`, `DatePicker`, `DateTimePicker`, `TimePicker`, `QuantityControl` |
| Feedback | `Alert`, `Toast`, `ToastContainer`, `Spinner`, `FullscreenLoader`, `Badge` |
| Navigation | `Tabs`, `Pagination`, `PageBreadcrumb`, `FilterChips`, `DropdownMenu` |
| Overlay / Modal | `ModalWrapper`, `ConfirmModal` (always via `useModal`) |
| Layout / Display | `ComponentCard`, `Avatar`, `Button`, `Link`, `ResponsiveImage`, `YouTubeEmbed` |

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

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **hivespace.sellercenter** (567 symbols, 878 relationships, 12 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/hivespace.sellercenter/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/hivespace.sellercenter/context` | Codebase overview, check index freshness |
| `gitnexus://repo/hivespace.sellercenter/clusters` | All functional areas |
| `gitnexus://repo/hivespace.sellercenter/processes` | All execution flows |
| `gitnexus://repo/hivespace.sellercenter/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
