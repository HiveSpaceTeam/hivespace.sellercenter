# AGENTS.md

All development guidelines for this project have been consolidated into `CLAUDE.md`.

Please read `CLAUDE.md` before making any changes in this repository.

## Loading States (mandatory)

Never write raw `<div class="animate-spin ...">` inline. Always use the shared components from `@hivespace/shared`:

- **`<Spinner />`** — for inline/section loading (table, list, card content area). Props: `size` (`'sm'` | `'md'` | `'lg'`, default `'md'`).
- **`<FullscreenLoader :visible="bool" :message="string" />`** — for full-UI blocking operations (form submit, destructive actions). Place at template root so it teleports to `<body>`.

Decision rule: if the user cannot interact with the rest of the page while waiting → `FullscreenLoader`; otherwise → `Spinner`.
