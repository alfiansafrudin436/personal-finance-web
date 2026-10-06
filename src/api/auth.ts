import { Response } from '@/types';
import { apiClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginData {
  token: string;
  user: AuthUser;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<Response<LoginData>> =>
    request<LoginData>(() => apiClient.post('/auth/login', payload)),

  register: async (payload: RegisterPayload): Promise<Response<LoginData>> =>
    request<LoginData>(() => apiClient.post('/auth/register', payload)),

  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<Response<string>> =>
    request<string>(() => apiClient.post('/auth/forgot-password', payload)),

  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<Response<string>> =>
    request<string>(() => apiClient.post('/auth/reset-password', payload)),
};
