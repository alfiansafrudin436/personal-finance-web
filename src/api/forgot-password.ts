import { Response } from "@/types";
import { apiClient } from "@/lib/axios";

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordData {
  message: string;
}

export const forgotPasswordService = {
  sendResetEmail: async (payload: ForgotPasswordPayload): Promise<Response<ForgotPasswordData>> => {
    try {
      const response = await apiClient.post("/auth/forgot-password", payload);
      return {
        data: response.data,
        isError: false,
        code: 200,
        errorMessage: "",
      };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      return {
        data: null as never,
        isError: true,
        code: err.response?.status ?? 500,
        errorMessage: err.response?.data?.message ?? "Internal Server Error",
      };
    }
  },
};
