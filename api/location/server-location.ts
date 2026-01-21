import { serverApiClient } from "@/api/server-fetch";

interface LocationDetailData {
  _id: string;
  orgId: string;
  companyId: string;
  name: string;
  parentId: string | null;
  warehouseId: string;
  path: string;
  type?: string;
  mainLocation: boolean;
  __v: number;
}

interface LocationDetailResponse {
  status?: boolean;
  data?: LocationDetailData;
  message?: string;
}

export async function getLocationDetail(id: string): Promise<LocationDetailResponse> {
  try {
    const response = await serverApiClient.get<LocationDetailData>(
      `/location/detail/${id}`
    );
    
    // The API returns the location object directly without wrapping
    if (response) {
      return {
        status: true,
        data: response,
      };
    }
    
    return {
      status: false,
      message: "Location not found",
    };
  } catch (error) {
    console.error("Error fetching location detail:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to fetch location",
    };
  }
}

// Note: Audit log endpoint not provided in API docs yet
// Add this when the endpoint is available
export async function getLocationAudit(id: string) {
  try {
    const response = await serverApiClient.get(`/location/audit/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching location audit:", error);
    return {
      status: false,
      data: [],
    };
  }
}
