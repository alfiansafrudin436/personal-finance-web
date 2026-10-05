# Personal Finance — Web

Next.js frontend for the personal finance app. Pairs with the Go API in
[`../personal-finance-service`](../personal-finance-service).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Radix UI ·
React Hook Form + Yup · Zustand · Recharts · Axios

## Getting started

```bash
pnpm install
cp .env.example .env.local   # points at the Go API
pnpm dev
```

Open http://localhost:3000. The API has to be running too, on the URL in
`NEXT_PUBLIC_API_URL` (default `http://localhost:9000/api`) — see the service
README for its setup.

| Script            | Does                       |
| ----------------- | -------------------------- |
| `pnpm dev`        | Dev server                 |
| `pnpm build`      | Production build           |
| `pnpm start`      | Serve the production build |
| `pnpm lint`       | ESLint                     |
| `pnpm type-check` | `tsc --noEmit`             |
| `pnpm format`     | Prettier                   |

## Routes

Public — `(public)/`:

| Route              | Page                 |
| ------------------ | -------------------- |
| `/login`           | Sign in              |
| `/register`        | Create an account    |
| `/forgot-password` | Request a reset link |

Private — `(private)/`, behind the token check in `src/hooks/use-auth-guard.ts`:

| Route           | Page                                                  |
| --------------- | ----------------------------------------------------- |
| `/dashboard`    | Balances, month summary, trend, recent activity       |
| `/transactions` | Filterable, paginated list; create, edit, delete      |
| `/accounts`     | Accounts with balances; archive instead of deleting   |
| `/categories`   | Own categories plus the read-only global ones         |
| `/budgets`      | Monthly budget per category with spend progress       |
| `/reports`      | Summary, income/expense trend, per-category breakdown |
| `/settings`     | Profile and sign out                                  |

## Conventions

Read [`docs/coding-standards.md`](docs/coding-standards.md) before changing
code. In short: UI in `page.tsx` / `index.tsx`, logic in a colocated
`hooks.ts` returning `{ data, methods }`, API calls in `src/api/`, and `@/*`
aliases instead of `../../`.

## A few things worth knowing

**Money is a string, end to end.** Amounts come from `NUMERIC(15,2)` columns
and stay strings through the API and the service layer. They are parsed only
at the display boundary, in `src/lib/format.ts`, so no amount is ever rounded
by a float on its way to or from the server.

**The API envelope is unwrapped in one place.** The Go API answers
`{ status, data }` on success and `{ errors: [{ msg, path }] }` on failure.
`src/lib/api-response.ts` knows that shape and nothing else does; every
service returns `Response<T>` and callers branch on `isError`.

**Transaction type comes from the category.** A transaction has no type column
of its own — its category decides whether it credits the account, debits it,
or moves money between two accounts. That is why the form only asks for a
destination account once a transfer category is picked.

**Chart colors were validated, not chosen by eye.** Income and expense use
blue and orange rather than the conventional green and red, which fail
deuteranopia separation badly. Both modes have their own validated steps; the
tokens are `--chart-income` and `--chart-expense` in
[`src/app/globals.css`](src/app/globals.css).
