# Zustand Store

Global client state for the app. Anything that belongs to one page lives in
that page's `hooks.ts` instead; only state shared across routes is here.

## `useAuthStore`

The signed-in user and the session flags.

| Field             | Meaning                                                |
| ----------------- | ------------------------------------------------------ |
| `user`            | `{ id, name, email }` of the signed-in user, or `null` |
| `isAuthenticated` | Whether a session is active                            |
| `isHydrated`      | Whether rehydration from localStorage has finished     |

| Method               | Does                                             |
| -------------------- | ------------------------------------------------ |
| `login(user, token)` | Stores the JWT and the profile                   |
| `logout()`           | Clears both                                      |
| `setUser(user)`      | Replaces the profile, e.g. after `GET /users/me` |

The JWT is **not** kept in this store. It lives in localStorage under its own
key (`src/lib/axios.ts`), because the axios request interceptor reads it on
every request and must not depend on React state. `login` and `logout` write
and clear it through `setStoredToken` / `clearStoredToken`.

`isHydrated` exists because `persist` rehydrates asynchronously: without it a
page cannot tell "not signed in" from "not read yet" and would redirect a
signed-in user to the login screen on every reload.

## `useUIStore`

Small cross-page UI state. Currently just `editingId`, for dialogs opened from
one page and read by another.

## Usage

```tsx
import { useAuthStore } from '@/store';

function Greeting() {
  // Select one field rather than the whole store, so the component
  // re-renders only when that field changes.
  const user = useAuthStore((state) => state.user);
  return <p>Halo, {user?.name}</p>;
}
```

Signing in, from a page's `hooks.ts`:

```ts
const login = useAuthStore((state) => state.login);

const response = await authService.login({ email, password });
if (!response.isError) {
  login(response.data.user, response.data.token);
}
```

## Persistence

`useAuthStore` persists `user` and `isAuthenticated` to localStorage under
`auth-storage`. The store module is also imported during server rendering,
where `localStorage` does not exist, so the storage getter falls back to a
no-op implementation.
