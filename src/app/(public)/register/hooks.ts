'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { authService } from '@/api/auth';
import { RegisterFormData, registerSchema } from '@/lib/schemas';
import { useAuthStore } from '@/store';

export const useHooks = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const submit = useCallback(
    async (values: RegisterFormData) => {
      setIsLoading(true);

      const response = await authService.register({
        name: values.name,
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

      // Register answers with a token when it signs the new user straight in;
      // without one, send them to the login form instead.
      if (response.data?.token) {
        login(response.data.user, response.data.token);
        router.replace('/dashboard');
        return;
      }

      router.replace('/login');
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
