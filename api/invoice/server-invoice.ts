import { serverApiClient } from "../server-fetch";

export interface InvoiceDetailData {
  _id: string;
  invoiceId: string;
  companyId: string;
  orgId: string;
  relatedTo: string;
  contactId?: string;
  assignedTo?: string;
  locationId?: string;
  dealId?: string;
  quotationId?: string;
  expiryDate?: string;
  amount: number;
  status: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  deliveryAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  products: Array<{
    product: string;
    productName: string;
    qty: number;
    rate: number;
    discount: number;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface InvoiceDetailResponse {
  status: boolean;
  message: string;
  data?: InvoiceDetailData;
}

export async function getInvoiceDetail(
  id: string
): Promise<InvoiceDetailResponse> {
  try {
    const response = await serverApiClient.get<InvoiceDetailResponse>(
      `/invoice/detail/${id}`
    );

    if (response?.status) {
      return response;
    }

    return {
      status: false,
      message: "Invoice not found",
    };
  } catch (error) {
    console.error("Error fetching Invoice detail:", error);

    return {
      status: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch Invoice detail",
    };
  }
}