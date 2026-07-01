import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (user) => set({ 
        user, 
        isLoading: false,
        isAuthenticated: true, 
      }),
      
      logout: () => set({ 
        user: null, 
        isLoading: false,
        isAuthenticated: false, 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
