import { CategoryType, Paginated, Response } from '@/types';
import { apiClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  toAccountId: string | null;
  toAccountName: string | null;
  categoryId: string;
  categoryName: string;
  categoryType: CategoryType;
  categoryIcon: string | null;
  categoryColor: string | null;
  amount: string;
  transactionDate: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: CategoryType;
  search?: string;
}

export interface TransactionPayload {
  accountId: string;
  categoryId: string;
  /** Required for a transfer, rejected for income and expense. */
  toAccountId?: string;
  amount: string;
  transactionDate: string;
  description?: string;
}

/** Drops empty filters so they do not reach the API as blank query params. */
const toParams = (
  filters: TransactionFilters,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value as string | number;
    }
  }
  return params;
};

export const transactionService = {
  getAll: async (
    filters: TransactionFilters = {},
  ): Promise<Response<Paginated<Transaction>>> =>
    request<Paginated<Transaction>>(() =>
      apiClient.get('/transactions', { params: toParams(filters) }),
    ),

  getById: async (id: string): Promise<Response<Transaction>> =>
    request<Transaction>(() => apiClient.get(`/transactions/${id}`)),

  create: async (payload: TransactionPayload): Promise<Response<Transaction>> =>
    request<Transaction>(() => apiClient.post('/transactions', payload)),

  update: async (
    id: string,
    payload: TransactionPayload,
  ): Promise<Response<Transaction>> =>
    request<Transaction>(() => apiClient.put(`/transactions/${id}`, payload)),

  remove: async (id: string): Promise<Response<string>> =>
    request<string>(() => apiClient.delete(`/transactions/${id}`)),
};
