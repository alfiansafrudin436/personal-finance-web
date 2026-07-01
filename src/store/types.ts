interface IUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (user: IUser) => void;
  logout: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}