import { serverApiClient } from "../server-fetch";

export interface ProformaProduct {
  productId: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface ProformaClientContact {
  name: string;
  email: string;
  phone: string;
}

export interface ProformaClient {
  id: string;
  name: string;
  email: string;
  source: string;
  type: string;
  billingAddress: unknown;
  deliveryAddresses: unknown[];
  contacts: ProformaClientContact[];
}

export interface ProformaInvoice {
  id: string;
  proformaId: string;
  quotationId: string | null;
  expiryDate: string;
  amount: number;
  status: string;
  products: ProformaProduct[];
  billingAddress: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface ProformaDetailData {
  _id: string;
  proformaId: string;
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

export interface ProformaDetailResponse {
  status: boolean;
  message: string;
  data?: ProformaDetailData;
}

export async function getProformaDetail(
  id: string
): Promise<ProformaDetailResponse> {
  try {
    const response = await serverApiClient.get<ProformaDetailResponse>(
      `/proforma/detail/${id}`
    );

    if (response?.status) {
      return response;
    }

    return {
      status: false,
      message: "Proforma not found",
    };
  } catch (error) {
    console.error("Error fetching proforma detail:", error);

    return {
      status: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch proforma detail",
    };
  }
}