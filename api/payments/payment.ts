import { apiClient } from "@/api/axios";

/* ===================== TYPES ===================== */

export interface PaymentData extends Record<string, unknown> {
  id: string;
  paymentId: string;
  invoiceId: string;
  relatedTo: string;
  createdAt: string;
  paymentMethod?: string;
  refNo?: string;
  amount: number;
  status: string;
  edit?: unknown;
  delete?: unknown;
}

export interface paymentListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaymentListResponse {
  tools?: any[];
  filter?: unknown[];
  result: {
    tableHeader: any[];
    search: boolean;
    pagination: boolean;
    components: any[];
    data: PaymentData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}


export interface PaymentDetailResponse {
  status: boolean;
  message: string;
  payment: PaymentData;
  invoice?: any | null;
}
/* ===================== API ===================== */

export const paymentApi = {
  /* ----------- LIST ----------- */
  list: async (
    params: paymentListParams,
  ): Promise<PaymentListResponse> => {
    const response = await apiClient.get<PaymentListResponse>(
      "/payment/list",
      { params },
    );
    return response.data;
  },

  /* ----------- CREATE ----------- */
  create: async (
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string; paymentId:string }> => {
    const response = await apiClient.post("/payment/create", data);
    return response.data;
  },

  /* ----------- EDIT ----------- */
  edit: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.put(`/payment/edit/${id}`, data);
    return response.data;
  },

  /* ----------- DELETE ----------- */
  delete: async (
    id: string,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.delete(`/payment/delete/${id}`);
    return response.data;
  },

  /* ----------- DETAIL ----------- */
  detail: async (
    id: string,
  ): Promise<{ status: boolean; data: PaymentData }> => {
    const response = await apiClient.get(`/payment/detail/${id}`);
    return response.data;
  },
};
