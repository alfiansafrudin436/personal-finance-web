'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { authService } from '@/api/auth';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/lib/schemas';

export const useHooks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const submit = useCallback(
    async (values: ForgotPasswordFormData) => {
      setIsLoading(true);

      const response = await authService.forgotPassword({
        email: values.email,
      });

      setIsLoading(false);

      if (response.isError) {
        form.setError('root', {
          type: 'server',
          message: response.errorMessage,
        });
        return;
      }

      // Confirmation is deliberately not "we found that email": saying so
      // would let anyone test which addresses have an account.
      setIsSent(true);
    },
    [form],
  );

  return {
    data: {
      form,
      errors: form.formState.errors,
      isLoading,
      isSent,
    },
    methods: {
      onSubmit: form.handleSubmit(submit),
    },
  };
};
