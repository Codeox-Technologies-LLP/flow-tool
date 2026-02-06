import { apiClient } from "@/api/axios";
import { DeliveryData, DeliveryListParams, DeliveryListResponse } from "@/types/delivery";

export const deliveryApi = {
  list: async (params: DeliveryListParams): Promise<DeliveryListResponse> => {
    const response = await apiClient.get<DeliveryListResponse>(
      "/delivery/list",
      { params }
    );
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: DeliveryData }> => {
    const response = await apiClient.get(`/delivery/detail/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; deliveryId?: string }> => {
    const response = await apiClient.post("/delivery/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: DeliveryData }> => {
    const response = await apiClient.put(`/delivery/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/delivery/delete/${id}`);
    return response.data;
  }, 
  
  validate: async (
      id: string,
      data: Record<string, unknown> = {}
    ): Promise<{
      status: boolean;
      message: string;
      data?: DeliveryData;
    }> => {
      const response = await apiClient.patch(`/delivery/validate/${id}`, data);
      return response.data;
    },
};
