import { Response } from '@/types';
import { authService, ForgotPasswordPayload } from '@/api/auth';

export type { ForgotPasswordPayload };

/**
 * Kept so existing imports keep working; the request itself lives in
 * `authService` alongside the other auth calls.
 */
export const forgotPasswordService = {
  sendResetEmail: async (
    payload: ForgotPasswordPayload,
  ): Promise<Response<string>> => authService.forgotPassword(payload),
};
