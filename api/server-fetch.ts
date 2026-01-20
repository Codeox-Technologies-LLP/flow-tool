import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

async function makeAuthenticatedRequest(
  url: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    console.log("Server - No token available");
    return null;
  }

  // Get user info from cookies
  const userInfoCookie = cookieStore.get("user_info")?.value;
  let userInfo: {
    userId?: string;
    orgId?: string;
    roleId?: string;
    companyId?: string;
  } = {};

  if (userInfoCookie) {
    try {
      userInfo = JSON.parse(userInfoCookie);
    } catch (e) {
      console.error("Failed to parse user info:", e);
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Add user info to headers
  if (userInfo.userId) headers["userId"] = userInfo.userId;
  if (userInfo.orgId) headers["orgId"] = userInfo.orgId;
  if (userInfo.roleId) headers["roleId"] = userInfo.roleId;
  if (userInfo.companyId) headers["companyId"] = userInfo.companyId;

  return fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });
}

export const serverApiClient = {
  async get<T>(endpoint: string): Promise<T | null> {
    try {
      const url = `${baseURL}/api${endpoint}`;
      const response = await makeAuthenticatedRequest(url);

      if (!response) {
        return null;
      }

      if (!response.ok) {
        console.error(`Server - Failed to GET ${endpoint}:`, response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Server - Failed to GET ${endpoint}:`, error);
      return null;
    }
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T | null> {
    try {
      const url = `${baseURL}/api${endpoint}`;
      const response = await makeAuthenticatedRequest(url, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response) {
        return null;
      }

      if (!response.ok) {
        console.error(`Server - Failed to POST ${endpoint}:`, response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Server - Failed to POST ${endpoint}:`, error);
      return null;
    }
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T | null> {
    try {
      const url = `${baseURL}/api${endpoint}`;
      const response = await makeAuthenticatedRequest(url, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response) {
        return null;
      }

      if (!response.ok) {
        console.error(`Server - Failed to PUT ${endpoint}:`, response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Server - Failed to PUT ${endpoint}:`, error);
      return null;
    }
  },

  async delete<T>(endpoint: string, body?: unknown): Promise<T | null> {
    try {
      const url = `${baseURL}/api${endpoint}`;
      const response = await makeAuthenticatedRequest(url, {
        method: "DELETE",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response) {
        return null;
      }

      if (!response.ok) {
        console.error(`Server - Failed to DELETE ${endpoint}:`, response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Server - Failed to DELETE ${endpoint}:`, error);
      return null;
    }
  },
};
