import { serverApiClient } from "../server-fetch";

export interface DeliveryDetailData {
  _id: string;
  deliveryId: string;
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

export interface DeliveryDetailResponse {
  status: boolean;
  message: string;
  data?: DeliveryDetailData;
}

export async function getDeliveryDetail(
  id: string
): Promise<DeliveryDetailResponse> {
  try {
    const response = await serverApiClient.get<DeliveryDetailResponse>(
      `/delivery/detail/${id}`
    );

    if (response?.status) {
      return response;
    }

    return {
      status: false,
      message: "Delivery not found",
    };
  } catch (error) {
    console.error("Error fetching Delivery detail:", error);

    return {
      status: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch Delivery detail",
    };
  }
}