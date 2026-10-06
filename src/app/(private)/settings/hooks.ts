'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { userService } from '@/api/users';
import { useAuthStore } from '@/store';

export const useHooks = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // isLoading is raised by the handlers that trigger a refetch, never inside
  // the loader itself: a synchronous setState in an effect body costs an extra
  // render pass on every mount (react-hooks/set-state-in-effect).
  const loadProfile = useCallback(async () => {
    const response = await userService.getMe();

    if (response.isError) {
      setError(response.errorMessage);
    } else {
      setError('');
      setName(response.data.username);
      setEmail(response.data.email);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadProfile();
  }, [loadProfile]);

  const save = useCallback(async () => {
    if (!name.trim()) {
      setError('Nama harus diisi');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    const response = await userService.updateMe(name.trim());
    setIsSaving(false);

    if (response.isError) {
      setError(response.errorMessage);
      return;
    }

    setSuccessMessage('Profil berhasil disimpan');
    // Keep the name in the sidebar in step with what was just saved.
    setUser({
      id: response.data.id ?? user?.id ?? '',
      name: response.data.username ?? name.trim(),
      email: response.data.email ?? email,
    });
  }, [name, email, user, setUser]);

  const signOut = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout, router]);

  return {
    data: { name, email, isLoading, isSaving, error, successMessage },
    methods: {
      reload: refresh,
      setName,
      save,
      signOut,
      dismissError: () => setError(''),
    },
  };
};
