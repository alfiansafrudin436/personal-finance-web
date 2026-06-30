'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  forgotPasswordService,
  ForgotPasswordPayload,
} from '@/api/forgot-password';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/schemas';
import { yupResolver } from '@hookform/resolvers/yup';

export interface UseForgotPasswordReturn {
  data: null;
  methods: {
    isLoading: boolean;
    sendResetEmail: (data: ForgotPasswordFormData) => Promise<void>;
  };
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const sendResetEmail = useCallback(
    async (data: ForgotPasswordFormData) => {
      setIsLoading(true);

      try {
        const payload: ForgotPasswordPayload = {
          email: data.email,
        };

        const response = await forgotPasswordService.sendResetEmail(payload);

        if (response.isError) {
          form.setError('root', {
            type: 'server',
            message: response.errorMessage,
          });
          return;
        }

        // Success - redirect to login
        router.push('/login');
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

  return {
    data: null,
    methods: {
      isLoading,
      sendResetEmail,
    },
  };
}
