import { apiClient } from "@/api/axios";
import { InvoiceData, InvoiceListParams, InvoiceListResponse } from "@/types/invoice";

export const invoiceApi = {
  list: async (params: InvoiceListParams): Promise<InvoiceListResponse> => {
    const response = await apiClient.get<InvoiceListResponse>(
      "/invoice/list",
      { params }
    );
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: InvoiceData }> => {
    const response = await apiClient.get(`/invoice/detail/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; invoiceId?: string }> => {
    const response = await apiClient.post("/invoice/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: InvoiceData }> => {
    const response = await apiClient.put(`/invoice/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/invoice/delete/${id}`);
    return response.data;
  }
};
