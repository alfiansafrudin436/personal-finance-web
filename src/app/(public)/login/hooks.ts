'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { authService, LoginPayload } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginFormData } from '@/lib/schemas';
import { yupResolver } from '@hookform/resolvers/yup';

export interface UseLoginReturn {
  data: null;
  methods: {
    register: (onSuccess?: () => void) => void;
    isLoading: boolean;
    login: (data: LoginFormData) => Promise<void>;
  };
}

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const login = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);

      try {
        const payload: LoginPayload = {
          email: data.email,
          password: data.password,
        };

        const response = await authService.login(payload);

        if (response.isError) {
          form.setError('root', {
            type: 'server',
            message: response.errorMessage,
          });
          return;
        }

        // Store token and redirect
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
      } catch (error) {
        form.setError('root', {
          type: 'system',
          message: 'An unexpected error occurred. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const register = useCallback((onSuccess?: () => void) => {
    onSuccess?.();
  }, []);

  return {
    data: null,
    methods: {
      register,
      isLoading,
      login,
    },
  };
}
