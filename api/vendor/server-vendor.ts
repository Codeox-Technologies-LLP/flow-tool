import { serverApiClient } from "@/api/server-fetch";

export interface VendorDetailData {
  _id: string;
  id: string;
  orgId: string;
  companyId: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VendorDetailResponse {
  status?: boolean;
  data?: VendorDetailData;
  message?: string;
}

export async function getVendorDetail(
  id: string
): Promise<VendorDetailResponse> {
  try {
    const response = await serverApiClient.get<{
      status: boolean;
      data: VendorDetailData;
    }>(`/vendor/detail/${id}`);

    if (response?.status) {
      return {
        status: true,
        data: response.data,
      };
    }

    return {
      status: false,
      message: "Vendor not found",
    };
  } catch (error) {
    console.error("Error fetching vendor detail:", error);
    return {
      status: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch vendor",
    };
  }
}