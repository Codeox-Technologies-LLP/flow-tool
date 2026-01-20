import { cookies } from "next/headers";
import type { UserInfoResponse } from "@/types/user-info";

export async function getUserInfo(): Promise<UserInfoResponse | null> {
  try {
    const cookieStore = await cookies();
    
    // Try to get token from cookies
    const token = cookieStore.get("auth_token")?.value;

    console.log("Server - Token found:", !!token);

    if (!token) {
      console.log("Server - No token available");
      return null;
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";
    const url = `${baseURL}/api/auth/user-info`;
    
    console.log("Server - Fetching from:", url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("Server - Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Server - Error response:", errorText);
      return null;
    }

    const data: UserInfoResponse = await response.json();
    console.log("Server - User info fetched successfully");
    return data;
  } catch (error) {
    console.error("Server - Failed to fetch user info:", error);
    return null;
  }
}
