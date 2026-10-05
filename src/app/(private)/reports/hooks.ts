'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  CategoryBreakdown,
  RangeSummary,
  TrendPoint,
  reportService,
} from '@/api/reports';
import { endOfMonthInput, startOfMonthInput } from '@/lib/format';
import { CategoryType } from '@/types';

export const useHooks = () => {
  const [startDate, setStartDate] = useState(startOfMonthInput());
  const [endDate, setEndDate] = useState(endOfMonthInput());
  const [type, setType] = useState<CategoryType>('expense');
  const [months, setMonths] = useState(6);

  const [summary, setSummary] = useState<RangeSummary | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // isLoading is raised by the handlers that trigger a refetch, never inside
  // the loader itself: a synchronous setState in an effect body costs an extra
  // render pass on every mount (react-hooks/set-state-in-effect).
  const loadReport = useCallback(async () => {
    const range = { startDate, endDate };
    const [summaryResponse, categoryResponse, trendResponse] =
      await Promise.all([
        reportService.getSummary(range),
        reportService.getByCategory(range, type),
        reportService.getTrend(months),
      ]);

    // Any one failure makes the page misleading, so the first error wins and
    // nothing partial is shown as if it were the whole picture.
    const failed = [summaryResponse, categoryResponse, trendResponse].find(
      (response) => response.isError,
    );

    if (failed) {
      setError(failed.errorMessage);
    } else {
      setError('');
      setSummary(summaryResponse.data);
      setCategories(categoryResponse.data.categories);
      setTrend(trendResponse.data.trend);
    }

    setIsLoading(false);
  }, [startDate, endDate, type, months]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadReport();
  }, [loadReport]);

  // Every control here changes a loader dependency, so each one shows the
  // spinner before the refetch lands.
  const withLoading = useCallback(
    <T>(setter: (value: T) => void) =>
      (value: T) => {
        setIsLoading(true);
        setter(value);
      },
    [],
  );

  return {
    data: {
      startDate,
      endDate,
      type,
      months,
      summary,
      categories,
      trend,
      isLoading,
      error,
    },
    methods: {
      reload: refresh,
      setStartDate: withLoading(setStartDate),
      setEndDate: withLoading(setEndDate),
      setType: withLoading(setType),
      setMonths: withLoading(setMonths),
    },
  };
};
