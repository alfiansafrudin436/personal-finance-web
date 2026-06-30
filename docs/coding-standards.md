# Personal Finance — Coding Standards (SSOT)

> Single source of truth for architecture and conventions.
> Consumed by: Cursor (`.cursor/rules/`), `AGENTS.md`, `CLAUDE.md`, GitHub Copilot.

## Project Context

| Item | Value |
|------|-------|
| Stack | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI |
| Form Validation | React Hook Form + Yup |
| Public routes | `(public)/login`, `(public)/register`, `(public)/forgot-password` |
| Private routes | `(private)/dashboard`, `(private)/transactions`, `(private)/categories`, `(private)/setting` |
| Global hooks | `src/hooks/` → import via `@/hooks/*` |
| UI components | `src/components/ui/` → import via `@/ui/*` or `@/components/ui/*` |
| Form components | `src/components/form/` → import via `@/form/*` |

---

## Role & Objectives

You are an expert Frontend Engineer specializing in Next.js (App Router), TypeScript, Tailwind CSS, Radix UI, React Hook Form, and Yup. Strictly follow the architectural standards, directory structures, separation of concerns, and import conventions below for every response.

---

## Directory Structure

```text
src/
├── app/
│   ├── (public)/              # Publicly accessible routes (no auth required)
│   │   ├── [page]/
│   │   │   ├── page.tsx       # UI presentation (export default LoginPage)
│   │   │   ├── hooks.ts       # State, logic, and methods
│   │   │   └── types.ts       # (Optional) page-specific types
│   │   └── [page]/ ...
│   └── (private)/             # Protected routes (auth required)
│       └── [page]/
│           ├── page.tsx
│           ├── hooks.ts
│           └── types.ts
├── api/                       # REST API service layer
│   └── [service].ts
├── components/               # Global reusable components
│   ├── ui/                   # Radix UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   └── dialog.tsx
│   ├── form/                 # Reusable form components
│   │   ├── FormInput.tsx
│   │   ├── FormError.tsx
│   │   ├── FormGroup.tsx
│   │   └── index.ts
│   └── [component-name]/     # e.g. sidebar, navbar, layout
│       ├── index.tsx
│       └── hooks.ts
├── hooks/                    # Global hooks only (e.g. use-mobile.ts)
├── lib/                      # Third-party initializations and utilities
│   ├── axios.ts             # Axios client with interceptors
│   ├── schemas.ts           # Yup validation schemas
│   └── utils.ts             # Utility functions
├── store/                   # Global state (Zustand / Redux) — when needed
├── types/                   # Global TypeScript definitions
│   └── index.ts               # Response<T> and shared types
└── utils/                   # Pure helpers — when needed
    └── helpers/
```

---

## Path Alias Rules

Cross-directory imports MUST use path aliases. Never use `../../` for cross-directory imports.

| Alias | Points to |
|-------|-----------|
| `@/api/*` | `src/api/*` |
| `@/components/*` | `src/components/*` |
| `@/ui/*` | `src/components/ui/*` (shortcut) |
| `@/lib/*` | `src/lib/*` |
| `@/store/*` | `src/store/*` |
| `@/types/*` | `src/types/*` |
| `@/hooks/*` | `src/hooks/*` |
| `@/helpers/*` | `src/utils/helpers/*` |

### Import hierarchy

1. **Same directory:** relative paths (e.g. `import { useHooks } from "./hooks";`)
2. **Cross directory:** path alias (e.g. `@/components/sidebar`, `@/api/auth`)

### Import ordering

Group imports at the top with a blank line between groups:

1. React & Next.js core
2. Third-party libraries
3. Global path aliases (`@/*`)
4. Local / same-directory imports

---

## API Layer & Global Types

### Response type (`src/types/index.ts`)

Every REST API function MUST return `Promise<Response<T>>`:

```typescript
export type Response<T> = {
  data: T;
  isError: boolean;
  code: number;
  errorMessage: string;
};
```

### API service (`src/api/[service].ts`)

- Centralize all network requests in `src/api/`
- Explicit return type: `Promise<Response<DataType>>`
- Always use try-catch and return a structured error object on failure

```typescript
import { Response } from "@/types";
import { apiClient } from "@/lib/axios";

export interface LoginPayload {
  email: string;
}

export interface LoginData {
  token: string;
  user: { id: string; name: string };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<Response<LoginData>> => {
    try {
      const response = await apiClient.post("/auth/login", payload);
      return {
        data: response.data,
        isError: false,
        code: 200,
        errorMessage: "",
      };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      return {
        data: null as never,
        isError: true,
        code: err.response?.status ?? 500,
        errorMessage: err.response?.data?.message ?? "Internal Server Error",
      };
    }
  },
};
```

---

## Page Patterns

### `page.tsx`

- Presentation only: Tailwind layout, UI structure, JSX
- No `useState`, `useEffect`, or inline event handlers — delegate to `methods`
- Destructure hook: `const { data, methods } = useHooks();`
- Declare as `const` arrow function, default export named `{PageName}Page`
- **Server vs Client:**
  - Prefer Server Components when no client interactivity
  - When consuming `useHooks()` directly, add `"use client";` to both `hooks.ts` and `page.tsx`
  - Alternative: Server `page.tsx` renders a colocated client child (e.g. `login-view.tsx`)

### `hooks.ts`

- Every interactive page MUST have `hooks.ts` exporting `useHooks` (per-folder convention)
- Add `"use client";` when using React state, effects, or browser APIs
- Return exactly `{ data, methods }`
- Process API responses before exposing to the page

---

## Global Component Patterns

`src/components/[component-name]/`:

- **`index.tsx`:** types at top + UI layout, `const` arrow function, default export, uses `useHooks()`
- **`hooks.ts`:** component state/logic, returns `{ data, methods }`, `"use client";` when needed

## Expected Output Format

When generating features, output files by type:

1. **API:** `src/api/[service].ts` with interfaces and `Promise<Response<T>>`
2. **Pages:** `types.ts` (if needed), `hooks.ts`, then `page.tsx`
3. **Components:** `hooks.ts`, then `index.tsx`
4. **Global hooks:** `src/hooks/[hook-name].ts`
