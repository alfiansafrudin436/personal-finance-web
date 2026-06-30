# Personal Finance — Copilot Instructions

Follow the architecture in [docs/coding-standards.md](../docs/coding-standards.md).

## Architecture Summary

- **Pages:** `page.tsx` (presentation) + `hooks.ts` (logic returning `{ data, methods }`)
- **Components:** `index.tsx` + `hooks.ts` under `src/components/[name]/`
- **API:** `src/api/[service].ts` with `Promise<Response<T>>`
- **Imports:** `@/*` aliases for cross-directory; relative for same folder

## Key Aliases

- `@/ui/*` → `src/components/ui/*`
- `@/hooks/*` → `src/hooks/*`
- `@/api/*` → `src/api/*`
- `@/types/*` → `src/types/*`

## Conventions

- Export pages as `const XxxPage = () => {}; export default XxxPage;`
- No `useState`/`useEffect` in `page.tsx` — delegate to `methods`
- `"use client"` only on files that need client-side React features
