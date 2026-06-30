# Claude Code — Personal Finance

Read and follow [`docs/coding-standards.md`](docs/coding-standards.md) for all code changes in this project.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Shadcn UI · Axios

## Non-negotiables

- Pages/components: UI in `page.tsx` or `index.tsx`, logic in colocated `hooks.ts`
- Hook returns `{ data, methods }` via `useHooks()` (per-folder naming)
- Cross-directory imports use `@/*` path aliases — never `../../`
- API calls centralized in `src/api/` with `Response<T>` wrapper
- Prefer Server Components; add `"use client"` only when needed

## Output Format

When generating features:

1. API → `src/api/[service].ts`
2. Pages → `types.ts` (optional), `hooks.ts`, `page.tsx`
3. Components → `hooks.ts`, `index.tsx`
4. Global hooks → `src/hooks/[name].ts`

For templates and examples, see `docs/coding-standards.md`.
