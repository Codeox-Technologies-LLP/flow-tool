import { serverApiClient } from "@/api/server-fetch";
import type {  PaymentDetailResponse } from "./payment";

export async function getPaymentDetail(id: string): Promise<PaymentDetailResponse | null>
 {
  return serverApiClient.get<PaymentDetailResponse>(
    `/payment/detail/${id}`
  );
}

