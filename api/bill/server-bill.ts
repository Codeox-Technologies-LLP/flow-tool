import { serverApiClient } from "@/api/server-fetch";
import { BillData } from "./bill";

export async function getBillDetail(
  id: string
): Promise<{ status: boolean; data: BillData } | null> {
  return serverApiClient.get<{ status: boolean; data: BillData }>(
    `/bill/details/${id}`
  );
}
