# Zustand Store Configuration

This directory contains Zustand state management stores for the personal-finance application.

## Available Stores

### Auth Store (`useAuthStore`)
Manages user authentication state:
- `user`: Current logged-in user object
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- **Methods:**
  - `login(user)`: Log in a user
  - `logout()`: Log out the current user
  - `setLoading(loading)`: Set loading state

## Usage Examples

### In a Component

```tsx
import { useAuthStore, useUIStore, useBudgetStore } from '@/src/store';

function MyComponent() {
  const user = useAuthStore((state) => state.user);
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
    </div>
  );
}
```

### Using with React Hook Form

```tsx
import { useAuthStore } from '@/src/store';

function LoginForm() {
  const login = useAuthStore((state) => state.login);
  
  const onSubmit = async (data: any) => {
    // Login logic here
    login({ 
      id: '1', 
      email: data.email, 
      name: data.name 
    });
  };
  
  return <form onSubmit={onSubmit}>...</form>;
}
```

## Persistence

The auth store is persisted to localStorage using the `persist` middleware. This means authentication state survives page reloads.

## TypeScript Support

All stores are fully typed with TypeScript. The store definitions are in `src/store/index.ts`.
