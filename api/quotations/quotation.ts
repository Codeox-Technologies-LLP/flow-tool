import { apiClient } from "@/api/axios";

/* ===================== TYPES ===================== */

export interface QuotationData extends Record<string, unknown> {
  id: string;
  quotationId: string;
  relatedTo: string;
  locationId?: string;
  assignedTo?: string;
  expiryDate?: string;
  amount: number;
  status: string;
  edit?: unknown;
  delete?: unknown;
}

export interface quotationListParams {
  page?: number;
  limit?: number;
  search?: string;
  clientId?: string;
}

export interface QuotationListResponse {
  tools?: any[];
  filter?: unknown[];
  result: {
    tableHeader: any[];
    search: boolean;
    pagination: boolean;
    components: any[];
    data: QuotationData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}

/* ===================== API ===================== */

export const quotationApi = {
  /* ----------- LIST ----------- */
  list: async (
    params: quotationListParams,
  ): Promise<QuotationListResponse> => {
    const response = await apiClient.get<QuotationListResponse>(
      "/quotations/list",
      { params },
    );
    return response.data;
  },

  /* ----------- CREATE ----------- */
  create: async (
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.post("/quotations/create", data);
    return response.data;
  },

  /* ----------- EDIT ----------- */
  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.patch(`/quotations/edit/${id}`, data);
    return response.data;
  },

  /* ----------- DELETE ----------- */
  delete: async (
    id: string,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete("/quotations/delete", {
      data: { ids: [id] },
    });
    return response.data;
  },

  /* ----------- DETAIL ----------- */
  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: QuotationData }> => {
    const response = await apiClient.get(`/quotations/detail/${id}`);
    return response.data;
  },

  dropdownClients: async (): Promise<
    { _id: string; name: string; email?: string }[]
  > => {
    const response = await apiClient.get("/clients/dropdown");
    return response.data;
  },

  dropdownUsers: async (): Promise<
    { userId: string; name: string }[]
  > => {
    const response = await apiClient.get("/user-management/dropdown");
    return response.data;
  },
  dropdownProducts: async (): Promise<
    { _id: string; name: string; price: number; quantity?: number }[]
  > => {
    const response = await apiClient.get("/product/dropdown");
    return response.data;
  },
  dropdownWarehouses: async (): Promise<
    { _id: string; name: string }[]
  > => {
    const response = await apiClient.get("/warehouse/dropdown");
    return response.data;
  },
  dropdownDeals: async (): Promise<
    { _id: string; title: string }[]
  > => {
    const response = await apiClient.get("/deals/dropdown");
    return response.data;
  },




};
