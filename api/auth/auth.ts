import { apiClient } from "@/api/axios";
import { cookieStorage } from "@/lib/utils/cookies";
import type { UserInfoResponse } from "@/types/user-info";
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>("/auth/verify-otp", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfoResponse> => {
    const response = await apiClient.get<UserInfoResponse>("/auth/user-info");
    return response.data;
  },

  resendOtp: async (email: string): Promise<RegisterResponse> => {
    // Get stored registration data from cookie
    const tempUser = cookieStorage.getTempRegisterData();
    if (!tempUser) {
      throw new Error("No registration data found");
    }
    const response = await apiClient.post<RegisterResponse>("/auth/register", tempUser);
    return response.data;
  },
};
