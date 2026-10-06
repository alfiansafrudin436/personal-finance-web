import { AccountType, CategoryType, Response } from '@/types';
import { apiClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export interface PeriodSummary {
  period: string;
  totalIncome: string;
  totalExpense: string;
  net: string;
  transactionCount: number;
}

export interface RangeSummary {
  startDate: string;
  endDate: string;
  totalIncome: string;
  totalExpense: string;
  net: string;
  transactionCount: number;
}

export interface AccountBalance {
  id: string;
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  total: string;
  transactionCount: number;
}

export interface TrendPoint {
  period: string;
  totalIncome: string;
  totalExpense: string;
  net: string;
}

export interface RecentTransaction {
  id: string;
  accountName: string;
  categoryName: string;
  categoryType: CategoryType;
  categoryIcon: string | null;
  categoryColor: string | null;
  amount: string;
  transactionDate: string;
  description: string | null;
}

export interface DashboardData {
  totalBalance: string;
  currentMonth: PeriodSummary;
  accounts: AccountBalance[];
  topExpenseCategory: CategoryBreakdown[];
  recentTransactions: RecentTransaction[];
  monthlyTrend: TrendPoint[];
}

export interface CategoryReportData {
  startDate: string;
  endDate: string;
  type: CategoryType;
  categories: CategoryBreakdown[];
}

export interface TrendData {
  months: number;
  trend: TrendPoint[];
}

export interface BalancesData {
  accounts: AccountBalance[];
  totalBalance: string;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export const reportService = {
  /** Everything the dashboard renders, in one request. */
  getDashboard: async (): Promise<Response<DashboardData>> =>
    request<DashboardData>(() => apiClient.get('/reports/dashboard')),

  getSummary: async (range: DateRange = {}): Promise<Response<RangeSummary>> =>
    request<RangeSummary>(() =>
      apiClient.get('/reports/summary', { params: range }),
    ),

  getByCategory: async (
    range: DateRange = {},
    type: CategoryType = 'expense',
  ): Promise<Response<CategoryReportData>> =>
    request<CategoryReportData>(() =>
      apiClient.get('/reports/by-category', { params: { ...range, type } }),
    ),

  getTrend: async (months = 6): Promise<Response<TrendData>> =>
    request<TrendData>(() =>
      apiClient.get('/reports/trend', { params: { months } }),
    ),

  getBalances: async (): Promise<Response<BalancesData>> =>
    request<BalancesData>(() => apiClient.get('/reports/balances')),
};
