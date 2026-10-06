import { AccountType, Response } from '@/types';
import { apiClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountListData {
  accounts: Account[];
  totalBalance: string;
  totalAccounts: number;
}

export interface AccountPayload {
  name: string;
  type: AccountType;
  balance?: string;
  currency?: string;
}

export const accountService = {
  getAll: async (includeArchived = false): Promise<Response<AccountListData>> =>
    request<AccountListData>(() =>
      apiClient.get('/accounts', { params: { includeArchived } }),
    ),

  getById: async (id: string): Promise<Response<Account>> =>
    request<Account>(() => apiClient.get(`/accounts/${id}`)),

  create: async (payload: AccountPayload): Promise<Response<Account>> =>
    request<Account>(() => apiClient.post('/accounts', payload)),

  update: async (
    id: string,
    payload: AccountPayload,
  ): Promise<Response<Account>> =>
    request<Account>(() => apiClient.put(`/accounts/${id}`, payload)),

  remove: async (id: string): Promise<Response<string>> =>
    request<string>(() => apiClient.delete(`/accounts/${id}`)),

  archive: async (id: string): Promise<Response<string>> =>
    request<string>(() => apiClient.patch(`/accounts/${id}/archive`)),

  unarchive: async (id: string): Promise<Response<string>> =>
    request<string>(() => apiClient.patch(`/accounts/${id}/unarchive`)),
};
