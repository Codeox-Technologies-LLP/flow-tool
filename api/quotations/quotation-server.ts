import { serverApiClient } from "@/api/server-fetch";

/* ===================== TYPES ===================== */

export interface QuotationDetailResponse {
  status: boolean;
  data: {
    client: {
      id: string;
      name: string;
      email: string;
      source: string;
      type: string;
      billingAddress: any;
      deliveryAddresses: any[];
      contacts: {
        name: string;
        email: string;
        phone: string;
      }[];
    };
    quotation: {
      id: string;
      dealId?: string;
      expiryDate?: string;
      amount: number;
      status: string;
      products: {
        productId: string;
        name: string;
        description: string;
        qty: number;
        rate: number;
        discount: number;
        amount: number;
        delivered: number;
      }[];
      createdAt: string;
      updatedAt: string;
    };
    deliveryId: string | null;
  };
}

/* ===================== SERVER CALL ===================== */

export async function getQuotationDetail(
  id: string
): Promise<QuotationDetailResponse | null> {
  return serverApiClient.get<QuotationDetailResponse>(
    `/quotations/detail/${id}`
  );
}
