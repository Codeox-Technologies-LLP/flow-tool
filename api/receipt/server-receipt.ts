import { serverApiClient } from "@/api/server-fetch";
import { ReceiptData } from "./receipt";

export async function getReceiptDetail(
  id: string
): Promise<{ status: boolean; data: ReceiptData } | null> {
  return serverApiClient.get<{ status: boolean; data: ReceiptData }>(
    `/receipt/detail/${id}`
  );
}
