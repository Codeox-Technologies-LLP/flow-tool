import { serverApiClient } from "@/api/server-fetch";
import type { BrandData } from "./brand";

export async function getBrandDetail(id: string): Promise<{ status: boolean; data: BrandData } | null>
 {
  return serverApiClient.get<{ status: boolean; data: BrandData }>(
    `/brand/detail/${id}`
  );
}

