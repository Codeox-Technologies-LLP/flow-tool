import { apiClient } from "@/api/axios";
import type {
  OperationTypeListParams,
  OperationTypeListResponse,
  OperationTypeData,
} from "@/types/operation-type";

export const operationTypeApi = {
  list: async (params: OperationTypeListParams): Promise<OperationTypeListResponse> => {
    const response = await apiClient.get<OperationTypeListResponse>(
      "/operation-type/list",
      { params }
    );
    return response.data;
  },

  create: async (data: Record<string, unknown>): Promise<{ status: boolean; message: string; operationTypeId?: string }> => {
    const response = await apiClient.post("/operation-type/create", data);
    return response.data;
  },

  edit: async (id: string, data: Record<string, unknown>): Promise<{ status: boolean; message: string; data?: OperationTypeData }> => {
    const response = await apiClient.put(`/operation-type/edit/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/operation-type/delete/${id}`);
    return response.data;
  },

  dropdown: async (): Promise<{ status: boolean; message: string; data?: OperationTypeData[] }> => {
    const response = await apiClient.get("/operation-type/dropdown");
    return response.data;
  },
};
