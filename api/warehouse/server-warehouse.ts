import { cookies } from "next/headers";
import type { WarehouseData } from "./warehouse";
import type { WarehouseAuditEntry, WarehouseAuditResponse } from "@/types/warehouse";

async function makeAuthenticatedRequest(url: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    console.log("Server - No token available");
    return null;
  }

  // Get user info from cookies
  const userInfoCookie = cookieStore.get("user_info")?.value;
  let userInfo: { userId?: string; orgId?: string; roleId?: string; companyId?: string } = {};
  
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
  };

  // Add user info to headers
  if (userInfo.userId) headers["userId"] = userInfo.userId;
  if (userInfo.orgId) headers["orgId"] = userInfo.orgId;
  if (userInfo.roleId) headers["roleId"] = userInfo.roleId;
  if (userInfo.companyId) headers["companyId"] = userInfo.companyId;

  return fetch(url, {
    headers,
    cache: "no-store",
  });
}

export async function getWarehouseDetail(id: string): Promise<{ status: boolean; data: WarehouseData } | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";
    const url = `${baseURL}/api/warehouse/detail/${id}`;

    const response = await makeAuthenticatedRequest(url);
    
    if (!response) {
      return null;
    }

    if (!response.ok) {
      console.error("Server - Failed to fetch warehouse:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server - Failed to fetch warehouse detail:", error);
    return null;
  }
}

export async function getWarehouseAudit(id: string): Promise<WarehouseAuditResponse | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";
    const url = `${baseURL}/api/warehouse/audit/${id}`;

    const response = await makeAuthenticatedRequest(url);
    
    if (!response) {
      return null;
    }

    if (!response.ok) {
      console.error("Server - Failed to fetch warehouse audit:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server - Failed to fetch warehouse audit:", error);
    return null;
  }
}
