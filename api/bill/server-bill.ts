import { serverApiClient } from "@/api/server-fetch";
import { BillDetailResponse } from "./bill";

export async function getBillDetail(
  id: string
): Promise<{ status: boolean; data: BillDetailResponse } | null> {
  return serverApiClient.get<{ status: boolean; data: BillDetailResponse }>(
    `/bill/details/${id}`
  );
}
