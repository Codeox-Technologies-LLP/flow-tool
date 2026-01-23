import { serverApiClient } from "@/api/server-fetch";
import type { CategoryData } from "./category";

export async function getCategoryDetail(id: string): Promise<{ status: boolean; data: CategoryData } | null>
 {
  return serverApiClient.get<{ status: boolean; data: CategoryData }>(
    `/category/detail/${id}`
  );
}

