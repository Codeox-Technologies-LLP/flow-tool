import { serverApiClient } from "@/api/server-fetch";
import type { UserInfoResponse } from "@/types/user-info";

export async function getUserInfo(): Promise<UserInfoResponse | null> {
  return serverApiClient.get<UserInfoResponse>("/auth/user-info");
}
