import { apiClient } from "./axios";
import { cookieStorage } from "@/lib/utils/cookies";

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  status: boolean;
  message: string;
  orgId: string;
  userId: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  status: boolean;
  message: string;
  token: string;
  user: {
    userId: string;
    orgId: string;
    fullName: string;
    email: string;
    appRole: string;
    orgRole: string;
    activeCompany: string;
  };
}

export interface LoginRedirectResponse {
  status: boolean;
  message: string;
  token: string;
  redirectUrl: string;
}

export type LoginResponse = LoginSuccessResponse | LoginRedirectResponse;

export interface UserInfoResponse {
  userInfo: {
    _id: string;
    userId: string;
    orgId: string;
    basicDetails: {
      fullName: string;
      email: string;
    };
    orgRole: string;
    appRole: string;
    activeCompany: string;
  };
  companies: Array<{
    companyId: string;
    companyName: string;
  }>;
  sideBarItems: {
    modules: {
      header: string;
      search: boolean;
      items: any[];
    };
    reports: {
      header: string;
      search: boolean;
      items: Array<{
        displayName: string;
        route: string;
        icon: string;
      }>;
    };
  };
}

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
