import { serverApiClient } from "@/api/server-fetch";
import type {  PaymentMadeDetailResponse } from "./paymentMade";

export async function getPaymentMadeDetail(id: string): Promise<PaymentMadeDetailResponse | null>
 {
  return serverApiClient.get<PaymentMadeDetailResponse>(
    `/payment-made/detail/${id}`
  );
}

