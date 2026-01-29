import { apiClient } from "@/api/axios";
import type {
  LocationData,
  LocationListParams,
  LocationListResponse,
} from "@/types/location";

export const locationApi = {
  list: async (params: LocationListParams): Promise<LocationListResponse> => {
    const response = await apiClient.get<LocationListResponse>(
      "/location/list",
      { params }
    );
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: LocationData }> => {
    const response = await apiClient.get(`/location/detail/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; locationId?: string }> => {
    const response = await apiClient.post("/location/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: LocationData }> => {
    const response = await apiClient.put(`/location/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/location/delete`, {
      data: { ids: [id] }
    });
    return response.data;
  },
  

  dropdown: async (options: { locationId?: string; type?: string }) => {
    const {  locationId, type } = options;

    let route = "/location/dropdown";
    if (locationId) {
      route += `/${locationId}`;
    }

    const response = await apiClient.get(route, {
      params: { type },
    });

    return response.data;
  },
};
