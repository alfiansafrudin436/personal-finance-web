import { CategoryType, Response } from '@/types';
import { apiClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export interface Category {
  id: string;
  userId: string | null;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
}

export const categoryService = {
  getAll: async (type?: CategoryType): Promise<Response<Category[]>> =>
    request<Category[]>(() =>
      apiClient.get('/categories', { params: type ? { type } : undefined }),
    ),

  getById: async (id: string): Promise<Response<Category>> =>
    request<Category>(() => apiClient.get(`/categories/${id}`)),

  create: async (payload: CategoryPayload): Promise<Response<Category>> =>
    request<Category>(() => apiClient.post('/categories', payload)),

  update: async (
    id: string,
    payload: CategoryPayload,
  ): Promise<Response<Category>> =>
    request<Category>(() => apiClient.put(`/categories/${id}`, payload)),

  remove: async (id: string): Promise<Response<string>> =>
    request<string>(() => apiClient.delete(`/categories/${id}`)),
};
