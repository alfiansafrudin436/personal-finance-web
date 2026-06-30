import { Response } from '@/types';
import { apiClient } from '@/lib/axios';

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

export interface LoginData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RegisterData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<Response<LoginData>> => {
    try {
      const response = await apiClient.post('/auth/login', payload);
      return {
        data: response.data,
        isError: false,
        code: 200,
        errorMessage: '',
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      return {
        data: null as never,
        isError: true,
        code: err.response?.status ?? 500,
        errorMessage: err.response?.data?.message ?? 'Internal Server Error',
      };
    }
  },

  register: async (
    payload: RegisterPayload,
  ): Promise<Response<RegisterData>> => {
    try {
      const response = await apiClient.post('/auth/register', payload);
      return {
        data: response.data,
        isError: false,
        code: 201,
        errorMessage: '',
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      return {
        data: null as never,
        isError: true,
        code: err.response?.status ?? 500,
        errorMessage: err.response?.data?.message ?? 'Internal Server Error',
      };
    }
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<Response<{ message: string }>> => {
    try {
      const response = await apiClient.post('/auth/forgot-password', payload);
      return {
        data: response.data,
        isError: false,
        code: 200,
        errorMessage: '',
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      return {
        data: null as never,
        isError: true,
        code: err.response?.status ?? 500,
        errorMessage: err.response?.data?.message ?? 'Internal Server Error',
      };
    }
  },
};
