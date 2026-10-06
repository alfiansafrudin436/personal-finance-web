import { Response } from '@/types';
import { apiClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  amount: string;
  spent: string;
  remaining: string;
  period: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetListData {
  period: string;
  budgets: Budget[];
}

export interface BudgetPayload {
  categoryId: string;
  amount: string;
  /** Budget month as `YYYY-MM`. */
  period: string;
}

export const budgetService = {
  /** `period` is `YYYY-MM`; omitted, the API answers for the current month. */
  getAll: async (period?: string): Promise<Response<BudgetListData>> =>
    request<BudgetListData>(() =>
      apiClient.get('/budgets', { params: period ? { period } : undefined }),
    ),

  /** Re-posting the same category and period replaces the amount. */
  save: async (payload: BudgetPayload): Promise<Response<Budget>> =>
    request<Budget>(() => apiClient.post('/budgets', payload)),

  update: async (id: string, amount: string): Promise<Response<Budget>> =>
    request<Budget>(() => apiClient.put(`/budgets/${id}`, { amount })),

  remove: async (id: string): Promise<Response<string>> =>
    request<string>(() => apiClient.delete(`/budgets/${id}`)),
};
