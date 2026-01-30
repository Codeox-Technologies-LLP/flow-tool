import { apiClient } from "@/api/axios";
import { ProformaData, ProformaListParams, ProformaListResponse } from "@/types/proforma";

export const proformaApi = {
  list: async (params: ProformaListParams): Promise<ProformaListResponse> => {
    const response = await apiClient.get<ProformaListResponse>(
      "/proforma/list",
      { params }
    );
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: ProformaData }> => {
    const response = await apiClient.get(`/proforma/detail/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; proformaId?: string }> => {
    const response = await apiClient.post("/proforma/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: ProformaData }> => {
    const response = await apiClient.put(`/proforma/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/proforma/delete/${id}`);
    return response.data;
  }
};
