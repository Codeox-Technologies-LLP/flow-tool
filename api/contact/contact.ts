import { apiClient } from "@/api/axios";
import { ContactData, ContactListParams, ContactListResponse } from "@/types/contact";


export const contactApi = {
  list: async (params: ContactListParams): Promise<ContactListResponse> => {
    const response = await apiClient.get<ContactListResponse>(
      "/contacts/list",
      { params }
    );
    return response.data;
  },

  detail: async (id: string): Promise<{ status: boolean; data: ContactData }> => {
    const response = await apiClient.get(`/contacts/detail/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; contactId?: string }> => {
    const response = await apiClient.post("/contacts/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: ContactData }> => {
    const response = await apiClient.put(`/contacts/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/contacts/delete/${id}`);
    return response.data;
  },
};
