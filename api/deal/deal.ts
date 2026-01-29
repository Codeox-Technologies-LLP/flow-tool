import { apiClient } from "@/api/axios";
import { DealData, DealListParams, DealListResponse } from "@/types/deal";

export const dealApi = {
  list: async (params: DealListParams): Promise<DealListResponse> => {
    const response = await apiClient.get<DealListResponse>(
      "/deals/list",
      { params }
    );
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: DealData }> => {
    const response = await apiClient.get(`/deals/details/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; dealId?: string }> => {
    const response = await apiClient.post("/deals/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: DealData }> => {
    const response = await apiClient.put(`/deals/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/deals/delete/${id}`);
    return response.data;
  },
};
