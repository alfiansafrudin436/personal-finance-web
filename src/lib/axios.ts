import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const TOKEN_STORAGE_KEY = 'token';

/** Reads the stored token, guarded so it is safe during server rendering. */
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // A blocked storage API should not break signing in.
  }
};

export const clearStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Nothing useful to do if storage is unavailable.
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // An expired or invalid token leaves the app unusable, so drop it and
    // send the user back to sign in. The login call itself is excluded: a
    // wrong password also answers 401 and must surface as a form error.
    const isAuthRequest = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthRequest) {
      clearStoredToken();
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
