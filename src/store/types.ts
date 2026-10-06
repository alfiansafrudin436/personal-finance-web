import { AuthUser } from '@/api/auth';

export type IUser = AuthUser;

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  setUser: (user: IUser) => void;
  setHydrated: () => void;
}

export interface UIState {
  /** Id of the record an edit dialog is currently open for. */
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}
