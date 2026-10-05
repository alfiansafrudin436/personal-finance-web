import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { clearStoredToken, setStoredToken } from '@/lib/axios';

import { AuthState, UIState } from './types';

const noopStorage: Storage = {
  length: 0,
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

/**
 * The JWT itself lives in localStorage under its own key, because the axios
 * interceptor reads it on every request. This store keeps the profile that
 * goes with it, so the UI does not have to decode the token.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (user, token) => {
        setStoredToken(token);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        clearStoredToken();
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      // The store module is imported during server rendering too, where
      // localStorage does not exist, so the getter falls back to a no-op.
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Rehydration is async, so pages wait on isHydrated before deciding
      // whether to redirect an unauthenticated visitor.
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const useUIStore = create<UIState>()((set) => ({
  editingId: null,
  setEditingId: (editingId) => set({ editingId }),
}));

export type { AuthState, IUser, UIState } from './types';
