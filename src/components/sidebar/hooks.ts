'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconArrowsExchange,
  IconChartPie,
  IconLayoutDashboard,
  IconSettings,
  IconTags,
  IconTargetArrow,
  IconWallet,
} from '@tabler/icons-react';

import { useAuthStore } from '@/store';

export const sidebarItems = [
  { title: 'Dashboard', url: '/dashboard', icon: IconLayoutDashboard },
  { title: 'Transaksi', url: '/transactions', icon: IconArrowsExchange },
  { title: 'Akun', url: '/accounts', icon: IconWallet },
  { title: 'Kategori', url: '/categories', icon: IconTags },
  { title: 'Anggaran', url: '/budgets', icon: IconTargetArrow },
  { title: 'Laporan', url: '/reports', icon: IconChartPie },
  { title: 'Pengaturan', url: '/settings', icon: IconSettings },
];

export const useHooks = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // The dashboard must not stay highlighted on every nested route, so only
  // the exact path or a true sub-path of it counts as active.
  const isActive = useCallback(
    (url: string) => pathname === url || pathname.startsWith(`${url}/`),
    [pathname],
  );

  const handleSignOut = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout, router]);

  return {
    data: { items: sidebarItems, user, isActive },
    methods: { handleSignOut },
  };
};
