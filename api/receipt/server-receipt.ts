import { serverApiClient } from "@/api/server-fetch";
import { ReceiptDetailData } from "./receipt"; 

export async function getReceiptDetail(
  id: string
): Promise<{ status: boolean; data: ReceiptDetailData } | null> {
  return serverApiClient.get<{ status: boolean; data: ReceiptDetailData }>(
    `/receipt/detail/${id}`
  );
}
