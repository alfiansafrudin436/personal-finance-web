'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { authService } from '@/api/auth';
import { getStoredToken } from '@/lib/axios';
import { LoginFormData, loginSchema } from '@/lib/schemas';
import { useAuthStore } from '@/store';

export const useHooks = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  // The form lives here, not in page.tsx: two useForm calls would mean the
  // page renders one instance while setError writes to another, so server
  // errors would never appear.
  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (getStoredToken()) router.replace('/dashboard');
  }, [router]);

  const submit = useCallback(
    async (values: LoginFormData) => {
      setIsLoading(true);

      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      setIsLoading(false);

      if (response.isError) {
        form.setError('root', {
          type: 'server',
          message: response.errorMessage,
        });
        return;
      }

      login(response.data.user, response.data.token);
      router.replace('/dashboard');
    },
    [form, login, router],
  );

  return {
    data: {
      form,
      errors: form.formState.errors,
      isLoading,
    },
    methods: {
      onSubmit: form.handleSubmit(submit),
    },
  };
};
