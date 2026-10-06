'use client';

import { useAuthGuard } from '@/hooks/use-auth-guard';

export const useHooks = () => {
  const { isChecking } = useAuthGuard();

  return {
    data: { isChecking },
    methods: {},
  };
};
