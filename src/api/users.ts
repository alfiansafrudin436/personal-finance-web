import { Response } from '@/types';
import { apiClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export const userService = {
  /** Resolves the signed-in user from the token; takes no ID. */
  getMe: async (): Promise<Response<UserProfile>> =>
    request<UserProfile>(() => apiClient.get('/users/me')),

  updateMe: async (name: string): Promise<Response<UserProfile>> =>
    request<UserProfile>(() => apiClient.put('/users/me', { name })),
};
