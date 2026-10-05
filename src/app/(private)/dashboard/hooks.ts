'use client';

import { useCallback, useEffect, useState } from 'react';

import { DashboardData, reportService } from '@/api/reports';

export const useHooks = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // isLoading is raised by the handlers that trigger a refetch, never inside
  // the loader itself: a synchronous setState in an effect body costs an extra
  // render pass on every mount (react-hooks/set-state-in-effect).
  const loadDashboard = useCallback(async () => {
    const response = await reportService.getDashboard();

    if (response.isError) {
      setError(response.errorMessage);
      setDashboard(null);
    } else {
      setError('');
      setDashboard(response.data);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadDashboard();
  }, [loadDashboard]);

  const summary = dashboard?.currentMonth;

  return {
    data: {
      dashboard,
      summary,
      isLoading,
      error,
      // The chart needs the net line even when a month had no activity, so
      // the API already returns a row per month and this stays a pass-through.
      trend: dashboard?.monthlyTrend ?? [],
      accounts: dashboard?.accounts ?? [],
      topCategories: dashboard?.topExpenseCategory ?? [],
      recentTransactions: dashboard?.recentTransactions ?? [],
    },
    methods: { reload: refresh },
  };
};
