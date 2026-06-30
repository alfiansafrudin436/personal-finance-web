# Personal Finance — Agent Instructions

Next.js 16 App Router personal finance app. Follow Clean Architecture with strict separation of UI and logic.

## Quick Rules

1. **Structure:** Pages and components use `page.tsx`/`index.tsx` (UI) + `hooks.ts` (logic)
2. **Hook contract:** Always return `{ data, methods }` from `useHooks()`
3. **Imports:** Cross-directory → `@/*` aliases. Same folder → relative (`./hooks`)
4. **API:** All requests in `src/api/`, return `Promise<Response<T>>`
5. **UI atoms:** Radix UI primitives in `src/components/ui/`, import via `@/ui/*`
6. **Form components:** Reusable form components in `src/components/form/`, import via `@/form/*`

## Path Aliases

| Alias            | Path                    |
| ---------------- | ----------------------- |
| `@/api/*`        | `src/api/*`             |
| `@/ui/*`         | `src/components/ui/*`   |
| `@/components/*` | `src/components/*`      |
| `@/form/*`       | `src/components/form/*` |
| `@/hooks/*`      | `src/hooks/*`           |
| `@/types/*`      | `src/types/*`           |
| `@/lib/*`        | `src/lib/*`             |

## Form Implementation

- **Validation:** Use React Hook Form with Yup for form validation
- **Schema:** Define schemas in `src/lib/schemas.ts`
- **Form Components:** Use reusable components from `@/form/*`:
  - `FormInput` - Reusable input with label and error support
  - `FormError` - Error message component
  - `FormGroup` - Group wrapper for label/input/error

## Routes

- **Public:** `/login`, `/register`, `/forgot-password`
- **Private:** `/dashboard`, `/transactions`, `/categories`, `/setting`

## Full Standards

See [`docs/coding-standards.md`](docs/coding-standards.md) for complete architecture, templates, and examples.
