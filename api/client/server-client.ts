import { serverApiClient } from "@/api/server-fetch";

interface ClientContact {
  name: string;
  email: string;
  phone: string;
  companyId:string
}

interface ClientDetailData {
  id: string;
  client?: string;
  name: string;
  email: string;
  source: string;
  type: string;
  owner?: string;
  billingAddress?: any;
  deliveryAddresses?: any[];
  contacts?: ClientContact[];
  totalQuotations?: number;
  totalInvoices?: number;
}

interface ClientDetailResponse {
  status: boolean;
  data?: ClientDetailData;
  message?: string;
}

export async function getClientDetail(
  id: string
): Promise<ClientDetailResponse> {
  try {
    const response = await serverApiClient.get<any>(
      `/clients/details/${id}`
    );

    if (response && response.status && response.data) {
      const actualData = response.data.data || response.data;
      
      return {
        status: true,
        data: actualData,
      };
    }

    if (response && response.id) {
      return {
        status: true,
        data: response,
      };
    }

    return {
      status: false,
      message: "Client not found",
    };
  } catch (error) {
    console.error("Error fetching client detail:", error);

    return {
      status: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch client details",
    };
  }
}