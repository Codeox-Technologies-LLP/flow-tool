import axios from "axios";
import { cookieStorage } from "@/lib/utils/cookies";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and user info from cookies
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = cookieStorage.getAuthToken();
      const userInfo = cookieStorage.getUserInfo<{
        userId: string;
        orgId: string;
        roleId?: string;
        companyId?: string;
      }>();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add user info to headers
      if (userInfo?.userId) {
        config.headers["userId"] = userInfo.userId;
      }
      if (userInfo?.orgId) {
        config.headers["orgId"] = userInfo.orgId;
      }
      if (userInfo?.roleId) {
        config.headers["roleId"] = userInfo.roleId;
      }
      if (userInfo?.companyId) {
        config.headers["companyId"] = userInfo.companyId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear cookies and redirect to login
      if (typeof window !== "undefined") {
        cookieStorage.clearAll();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// Server-side API client with auth - use this in Server Components/Actions
export const createServerApiClient = async () => {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  return axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    },
  });
};
