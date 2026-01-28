import { apiClient } from "@/api/axios";
import { ClientData, ClientListParams, ClientListResponse } from "@/types/client";

export const clientApi = {
  list: async (params: ClientListParams): Promise<ClientListResponse> => {
    const response = await apiClient.get<ClientListResponse>(
      "/clients/list",
      { params }
    );
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: ClientData }> => {
    const response = await apiClient.get(`/clients/details/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; clientId?: string }> => {
    const response = await apiClient.post("/clients/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: ClientData }> => {
    const response = await apiClient.put(`/clients/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/clients/delete`, {
      data: { ids: [id] }
    });
    return response.data;
  },
};
