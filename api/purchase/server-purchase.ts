import { serverApiClient } from "@/api/server-fetch";
import { GetPurchaseDetailResponse } from "./purchase";

export async function getPurchaseDetail(
  id: string
): Promise<{ status: boolean; data: GetPurchaseDetailResponse  } | null> {
  return serverApiClient.get<{ status: boolean; data: GetPurchaseDetailResponse  }>(
    `/purchase/details/${id}`
  );
}
