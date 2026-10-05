'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getStoredToken } from '@/lib/axios';
import { userService } from '@/api/users';
import { useAuthStore } from '@/store';

/**
 * Keeps the private pages behind a token. The check runs on the client because
 * the token lives in localStorage, so `isChecking` stays true until there is
 * an answer, and callers render nothing rather than a flash of signed-in UI.
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!getStoredToken()) {
        router.replace('/login');
        return;
      }

      // The profile may be missing after a reload even though the token is
      // still valid, so fetch it rather than trusting persisted state alone.
      if (user) {
        if (active) setIsChecking(false);
        return;
      }

      const response = await userService.getMe();
      if (!active) return;

      if (response.isError) {
        logout();
        router.replace('/login');
        return;
      }

      setUser({
        id: response.data.id,
        name: response.data.username,
        email: response.data.email,
      });
      setIsChecking(false);
    };

    void verify();

    return () => {
      active = false;
    };
  }, [user, router, setUser, logout]);

  return { isChecking, user };
};
